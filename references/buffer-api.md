# Buffer API

Queue LinkedIn and Instagram posts only.

## Environment Variables

Supported names:

- Token: `BUFFER_API_KEY_PRIMARY` or `BUFFER_ACCESS_TOKEN`.
- LinkedIn channel: `BUFFER_CHANNEL_LINKEDIN` or `BUFFER_LINKEDIN_PROFILE_ID`.
- Instagram channel: `BUFFER_CHANNEL_IG`, `BUFFER_CHANNEL_INSTAGRAM`, or `BUFFER_INSTAGRAM_PROFILE_ID`.

Never print token values. Never hardcode credentials.

## Zsh Loading

Buffer credentials should be loaded from zsh, not embedded in scripts or skill files.

- Store Buffer exports in `$HOME/.config/opencode/buffer.env`.
- Source that file from `$HOME/.zshenv` so non-interactive `zsh -lc` sessions can read it.
- `.zshrc` may also source the same file for interactive shells.
- The queue script checks `process.env` first, then falls back to `/bin/zsh -lc 'printenv VAR_NAME'` for missing Buffer vars.
- Verify presence without printing secrets:

```bash
zsh -lc 'for v in BUFFER_API_KEY_PRIMARY BUFFER_CHANNEL_IG BUFFER_CHANNEL_LINKEDIN; do [[ -n ${(P)v} ]] && print "$v=present" || print "$v=missing"; done'
```

## Endpoint

```text
https://api.buffer.com/graphql
```

Use a browser-like `User-Agent` header.

## Queueing Rules

- Use public media URLs only.
- Upload local exports to tmpfiles.org before queueing.
- Convert tmpfiles URLs to direct `/dl/` URLs.
- Use `mode: addToQueue`.
- Use `schedulingType: automatic`.
- Let Buffer decide posting times.
- Do not pass scheduled timestamps.
- Write Buffer response IDs to the carousel upload folder.
- Live queueing requires an approved `source/pre-publish-review.md` report with no blocking issues.

## Platform Media Contract

- Instagram uses slide image assets: `assets.images` with one or more uploaded image URLs.
- LinkedIn uses a PDF/document asset: `assets.documents` with one uploaded PDF URL.
- Do not queue LinkedIn with individual slide images by default.
- The LinkedIn document title should come from the carousel title, slug, or `--linkedin-title`.

Expected manifest assets:

| Platform | Required asset | MIME types |
| --- | --- | --- |
| Instagram | One or more images | `image/png`, `image/jpeg`, `image/webp` |
| LinkedIn | One PDF document | `application/pdf` |

Payload shape:

```graphql
assets: { images: [{ url: "https://tmpfiles.org/dl/.../slide-01.png" }] }
```

```graphql
assets: { documents: [{ url: "https://tmpfiles.org/dl/.../carousel.pdf", title: "Post title" }] }
```

## Safety

- Dry-run before live queueing when practical.
- Do not queue without exported media and final captions.
- Do not queue live without an approved pre-publish visual review.
- `scripts/queue-buffer-post.ts --live` refuses to continue unless the review report contains `Approval: Approved` and `Blocking issues: None`.
- Do not try to publish immediately.
- Do not include X/Twitter channels.
