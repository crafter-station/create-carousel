#!/usr/bin/env bun

import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

type UploadAsset = {
	file?: string;
	filename?: string;
	directUrl?: string;
	url?: string;
	mimeType?: string;
};

type Platform = "linkedin" | "instagram";

const endpoint = process.env.BUFFER_API_ENDPOINT ?? "https://api.buffer.com/graphql";
const contentRoot = process.env.CONTENT_ROOT ?? "/Users/cuevaio/projects/content";

function usage(): never {
	console.error(`Usage:
  queue-buffer-post.ts --manifest uploads/tmpfiles.json --linkedin-caption source/copy-linkedin.md --instagram-caption source/copy-instagram.md [--review source/pre-publish-review.md] [--linkedin-title "Post title"] [--output-dir uploads] [--platform both] [--live]

Defaults to dry-run. Pass --live only when the user explicitly approved queueing and source/pre-publish-review.md is approved.

Media contract:
  Instagram uses image assets from the manifest.
  LinkedIn uses one PDF/document asset from the manifest.`);
	process.exit(1);
}

function readArg(name: string): string | undefined {
	const index = process.argv.indexOf(name);
	if (index === -1) return undefined;
	return process.argv[index + 1];
}

function envAny(names: string[]): string | undefined {
	for (const name of names) {
		const value = process.env[name];
		if (value) return value;

		const zshValue = zshEnv(name);
		if (zshValue) return zshValue;
	}
	return undefined;
}

function zshEnv(name: string): string | undefined {
	if (!/^[A-Z0-9_]+$/.test(name)) return undefined;
	const result = spawnSync("/bin/zsh", ["-lc", `printenv ${name}`], {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "ignore"],
	});
	const value = result.stdout?.trim();
	return value || undefined;
}

function assertEnv(value: string | undefined, label: string): string {
	if (!value) {
		throw new Error(`Missing required environment variable for ${label}`);
	}
	return value;
}

async function readText(filePath: string): Promise<string> {
	return (await readFile(filePath, "utf8")).trim();
}

function assetUrl(asset: UploadAsset): string | undefined {
	return asset.directUrl || asset.url;
}

function assetSearchText(asset: UploadAsset): string {
	return `${asset.file ?? ""} ${asset.filename ?? ""} ${asset.directUrl ?? ""} ${asset.url ?? ""}`.toLowerCase();
}

function isImage(asset: UploadAsset): boolean {
	const mime = asset.mimeType?.toLowerCase();
	if (mime?.startsWith("image/")) return true;
	return /\.(png|jpe?g|webp)(\?|$)/.test(assetSearchText(asset));
}

function isDocument(asset: UploadAsset): boolean {
	const mime = asset.mimeType?.toLowerCase();
	if (mime === "application/pdf") return true;
	return /\.pdf(\?|$)/.test(assetSearchText(asset));
}

function selectedPlatforms(value: string | undefined): Platform[] {
	if (!value || value === "both") return ["linkedin", "instagram"];
	if (value === "linkedin" || value === "instagram") return [value];
	throw new Error(`Unsupported platform: ${value}. Use linkedin, instagram, or both.`);
}

function titleFromAsset(asset: UploadAsset): string {
	const source = asset.filename || asset.file || assetUrl(asset) || "carousel.pdf";
	return path.basename(source).replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim() || "Carousel";
}

function createInstagramPostInput(channelId: string, text: string, urls: string[]) {
	return {
		text,
		channelId,
		schedulingType: "automatic",
		mode: "addToQueue",
		metadata: {
			instagram: {
				type: "post",
				shouldShareToFeed: true,
			},
		},
		assets: {
			images: urls.map((url) => ({ url })),
		},
	};
}

function createLinkedInPostInput(channelId: string, text: string, documentUrl: string, title: string, thumbnailUrl: string) {
	return {
		text,
		channelId,
		schedulingType: "automatic",
		mode: "addToQueue",
		assets: {
			documents: [{ url: documentUrl, title, thumbnailUrl }],
		},
	};
}

async function assertApprovedReview(reviewPath: string): Promise<void> {
	let reviewText = "";
	try {
		reviewText = await readText(reviewPath);
	} catch {
		throw new Error(`Missing pre-publish review report: ${reviewPath}`);
	}

	const approved = /^\s*-?\s*Approval\s*:\s*Approved\s*$/im.test(reviewText);
	const noBlockingIssues = /^\s*-?\s*Blocking issues\s*:\s*None\s*$/im.test(reviewText);

	if (!approved || !noBlockingIssues) {
		throw new Error(`Pre-publish review is not approved. Set "Approval: Approved" and "Blocking issues: None" in ${reviewPath} after visual review.`);
	}
}

async function bufferRequest(token: string, input: unknown) {
	const query = `
mutation CreateQueuedPost($input: CreatePostInput!) {
  createPost(input: $input) {
    ... on PostActionSuccess {
      post {
        id
        text
        dueAt
        assets {
          id
          mimeType
        }
      }
    }
    ... on MutationError {
      message
    }
  }
}`;

	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0 (compatible; anthony-social-carousel/1.0)",
		},
		body: JSON.stringify({ query, variables: { input } }),
	});

	const body = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(`Buffer API returned ${response.status}: ${JSON.stringify(body)}`);
	}
	if (body.errors?.length) {
		throw new Error(`Buffer GraphQL error: ${JSON.stringify(body.errors)}`);
	}
	const mutationError = body.data?.createPost?.message;
	if (mutationError) {
		throw new Error(`Buffer mutation error: ${mutationError}`);
	}
	return body;
}

function postId(response: unknown): string | undefined {
	if (!response || typeof response !== "object") return undefined;
	const maybe = response as { data?: { createPost?: { post?: { id?: string } } } };
	return maybe.data?.createPost?.post?.id;
}

async function main() {
	const manifestPath = readArg("--manifest") ?? usage();
	const linkedInCaptionPath = readArg("--linkedin-caption") ?? usage();
	const instagramCaptionPath = readArg("--instagram-caption") ?? usage();
	const outputDir = readArg("--output-dir") ?? path.dirname(manifestPath);
	const reviewPath = readArg("--review") ?? path.join(path.dirname(path.dirname(manifestPath)), "source", "pre-publish-review.md");
	const explicitLinkedInTitle = readArg("--linkedin-title");
	const platforms = selectedPlatforms(readArg("--platform"));
	const live = process.argv.includes("--live");

	const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as UploadAsset[];
	const imageAssets = manifest.filter(isImage);
	const documentAssets = manifest.filter(isDocument);
	const imageUrls = imageAssets.map(assetUrl).filter(Boolean) as string[];
	const documentAsset = documentAssets[0];
	const documentUrl = documentAsset ? assetUrl(documentAsset) : undefined;
	const linkedInTitle = explicitLinkedInTitle || (documentAsset ? titleFromAsset(documentAsset) : "Carousel");

	if (platforms.includes("instagram") && !imageUrls.length) {
		throw new Error("Instagram requires one or more image URLs in the tmpfiles manifest");
	}
	if (platforms.includes("linkedin") && !documentUrl) {
		throw new Error("LinkedIn requires one PDF/document URL in the tmpfiles manifest");
	}
	if (platforms.includes("linkedin") && !imageUrls.length) {
		throw new Error("LinkedIn document posts require an image URL to use as the document thumbnail");
	}

	const captions: Record<Platform, string> = {
		linkedin: await readText(linkedInCaptionPath),
		instagram: await readText(instagramCaptionPath),
	};

	const channels: Record<Platform, string | undefined> = {
		linkedin: envAny(["BUFFER_CHANNEL_LINKEDIN", "BUFFER_LINKEDIN_PROFILE_ID"]),
		instagram: envAny(["BUFFER_CHANNEL_IG", "BUFFER_CHANNEL_INSTAGRAM", "BUFFER_INSTAGRAM_PROFILE_ID"]),
	};

	const requests = platforms.map((platform) => {
		const channelId = channels[platform] ?? `MISSING_${platform.toUpperCase()}_CHANNEL`;
		return {
			platform,
			input:
				platform === "instagram"
					? createInstagramPostInput(channelId, captions.instagram, imageUrls)
					: createLinkedInPostInput(channelId, captions.linkedin, assertEnv(documentUrl, "LinkedIn document URL"), linkedInTitle, assertEnv(imageUrls[0], "LinkedIn document thumbnail URL")),
		};
	});

	if (!live) {
		console.log(JSON.stringify({ dryRun: true, endpoint, reviewPath, requests }, null, 2));
		return;
	}

	await assertApprovedReview(reviewPath);

	const token = assertEnv(envAny(["BUFFER_API_KEY_PRIMARY", "BUFFER_ACCESS_TOKEN"]), "Buffer API token");
	for (const platform of platforms) {
		assertEnv(channels[platform], `${platform} channel ID`);
	}

	const responses = [];
	for (const request of requests) {
		const response = await bufferRequest(token, request.input);
		responses.push({ platform: request.platform, response });
	}

	await mkdir(outputDir, { recursive: true });
	const responsePath = path.join(outputDir, "buffer-response.json");
	await writeFile(responsePath, `${JSON.stringify({ queuedAt: new Date().toISOString(), responses }, null, 2)}\n`);

	const logPath = path.join(contentRoot, "logs", "buffer-queue.log");
	await mkdir(path.dirname(logPath), { recursive: true });
	for (const item of responses) {
		await appendFile(logPath, `${new Date().toISOString()}\t${item.platform}\t${postId(item.response) ?? "unknown"}\t${manifestPath}\n`);
	}

	console.log(`Queued ${responses.length} Buffer post(s). Wrote ${responsePath}`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
