# Create Carousel

OpenCode skill for creating Anthony Cueva-style LinkedIn and Instagram carousels in Pencil.

The canonical project lives here:

```text
/Users/cuevaio/projects/create-carousel
```

OpenCode loads it through this symlink:

```text
/Users/cuevaio/.agents/skills/anthony-social-carousel -> /Users/cuevaio/projects/create-carousel
```

## What It Does

- Creates `1080x1350` educational carousel decks in Pencil.
- Preserves Anthony's dark/light visual system, Satoshi typography, footer, terminal cards, and slide rhythm.
- Supports LinkedIn PDF/document carousels and Instagram image carousels.
- Stores reusable logos, images, screenshots, memes, and profile assets under `/Users/cuevaio/projects/content/assets`.
- Exports only x3 PNG slide images and generates the LinkedIn PDF from those same images.
- Requires a rendered pre-publish visual review before tmpfiles upload or live Buffer queueing.
- Queues posts through Buffer with `mode: addToQueue` and automatic scheduling.

## Structure

```text
SKILL.md
references/
  buffer-api.md
  carousel-design-system.md
  content-storage.md
  copywriting-style.md
  pencil-workflow.md
  pre-publish-review.md
scripts/
  prepare-content-dir.sh
  queue-buffer-post.ts
  upload-tmpfiles.sh
templates/
  carousel-outline.md
  pre-publish-review.md
  topic-brief.md
```

## Required Content Paths

Carousel work is stored under:

```text
/Users/cuevaio/projects/content/carousels/YYYY-MM-DD-slug/
```

Reusable assets are stored under:

```text
/Users/cuevaio/projects/content/assets
```

Do not create carousel-local `assets/` folders. Pencil image fills should use absolute paths into the reusable asset library.

## Publishing Flow

1. Create or revise the Pencil carousel.
2. Export ordered x3 PNGs to `exports/x3/`.
3. Generate `exports/carousel.pdf` from the same x3 PNGs.
4. Complete `source/pre-publish-review.md` by inspecting the rendered media.
5. Fix and re-export until the review says `Approval: Approved` and `Blocking issues: None`.
6. Upload media to tmpfiles.
7. Queue LinkedIn and Instagram through Buffer.

The Buffer queue script refuses `--live` unless the review report is approved.

## Buffer Credentials

Credentials are loaded from zsh environment variables, not stored in this project.

Supported variables:

- `BUFFER_API_KEY_PRIMARY` or `BUFFER_ACCESS_TOKEN`
- `BUFFER_CHANNEL_LINKEDIN` or `BUFFER_LINKEDIN_PROFILE_ID`
- `BUFFER_CHANNEL_IG`, `BUFFER_CHANNEL_INSTAGRAM`, or `BUFFER_INSTAGRAM_PROFILE_ID`

Never commit API keys or channel secrets.
