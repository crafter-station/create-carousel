---
name: anthony-social-carousel
description: Creates Anthony Cueva-style LinkedIn and Instagram educational carousels in Pencil for news, tutorials, explainers, comparisons, lessons, recaps, and build-in-public posts. Use when creating Anthony social carousels, LinkedIn PDF/document carousels, Instagram image carousels, Pencil carousel posts, or Buffer queued social posts.
---

# Anthony Social Carousel

## Use This Skill For

- LinkedIn carousel posts in Anthony Cueva's style.
- Instagram carousel posts in Anthony Cueva's style.
- News breakdowns, tutorials, concept explainers, comparisons, lessons learned, product updates, event recaps, and opinion posts.
- Pencil carousel design updates that should preserve the existing deck style.
- Exporting carousel assets and queueing them through Buffer.

Do not use this for X/Twitter. This skill is LinkedIn and Instagram only.

## Workflow

1. Gather the topic, audience, core point, source notes, desired CTA, and exclusions.
2. Draft slide copy using [copywriting-style.md](references/copywriting-style.md).
3. Build or revise the carousel in Pencil using [pencil-workflow.md](references/pencil-workflow.md).
4. Preserve the visual system from [carousel-design-system.md](references/carousel-design-system.md).
5. Store generated source files and exports using [content-storage.md](references/content-storage.md).
6. Export ordered x3 slide images for Instagram and one PDF document for LinkedIn only after Pencil visual verification.
7. Complete the rendered export review using [pre-publish-review.md](references/pre-publish-review.md) and [pre-publish-review.md](templates/pre-publish-review.md).
8. Fix, re-export, and re-review until the review is approved with no blocking issues.
9. Upload exported assets to tmpfiles.org only after review approval.
10. Queue one LinkedIn PDF/document post and one Instagram image carousel through Buffer using [buffer-api.md](references/buffer-api.md).

## Hard Rules

- Reuse the existing finished Pencil carousel style exactly unless the user asks for a redesign.
- Before building or revising a deck, read `references/carousel-design-system.md` and preserve the extracted Pencil measurements exactly.
- Adapt the topic, copy, slide roles, labels, diagrams, screenshots, examples, and assets while preserving the measured style.
- Instagram uses exported slide images.
- LinkedIn uses an exported PDF/document asset, not individual slide images.
- Do not upload assets or queue Buffer posts until `source/pre-publish-review.md` is approved with no blocking issues.
- The pre-publish review must inspect the rendered exports, not only the Pencil layer tree or source copy.
- Treat any overflow, clipping, unreadable text, poor contrast, missing required brand/product/technology logo, wrong slide order, or broken platform export as a blocker.
- Store all generated content under `/Users/cuevaio/projects/content`.
- Every carousel must create its own Pencil file at `/Users/cuevaio/projects/content/carousels/YYYY-MM-DD-slug/source/carousel.pen`.
- Use `/Users/cuevaio/projects/content/assets/profile/anthony-profile.jpg` for Anthony's profile image.
- Use `/Users/cuevaio/projects/content/assets` as the only reusable asset library.
- Pencil image fills must use absolute `url` values pointing into `/Users/cuevaio/projects/content/assets`.
- Check the reusable asset library first. If the needed logo or visual already exists there, use it.
- If a needed public asset is missing, use the `images-search` skill to find it online, prefer official sources, download it, normalize it if needed, and store it under `/Users/cuevaio/projects/content/assets` before using it.
- When a brand, product, platform, or company is mentioned in a slide visual, use its logo/icon when practical. Prefer a stored or sourced brand mark over a text-only brand label.
- Store every logo, image, illustration, meme, screenshot, or other asset used in a carousel under the content library before using it.
- Do not create per-carousel `assets/` folders. Do not duplicate shared images into carousel folders.
- Do not reference assets outside `/Users/cuevaio/projects/content` in skill docs or Pencil files.
- Read Buffer credentials from zsh-loaded environment variables only. Never hardcode credentials in the skill or scripts.
- Queue with `mode: addToQueue`; never publish immediately.
- Let Buffer decide posting times; do not set scheduled timestamps.
- Do not print API keys or hardcode secrets.

## Setup Scripts

- `scripts/prepare-content-dir.sh`: create content folders and copy the profile image.
- `scripts/upload-tmpfiles.sh`: upload exports and write a public URL manifest.
- `scripts/queue-buffer-post.ts`: queue LinkedIn and Instagram posts from manifests after an approved review report.

## Templates

- Start from [topic-brief.md](templates/topic-brief.md) for the input brief.
- Write the generated outline with [carousel-outline.md](templates/carousel-outline.md).
- Write the mandatory pre-publish visual review with [pre-publish-review.md](templates/pre-publish-review.md).
