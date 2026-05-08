# Content Storage

All generated carousel work and reusable assets belong under `/Users/cuevaio/projects/content`.

Do not reference assets outside `/Users/cuevaio/projects/content` from skill docs, generated metadata, or Pencil image fills.

## Reusable Asset Library

Use this as the only shared asset source of truth:

```text
/Users/cuevaio/projects/content/assets/
  profile/
    anthony-profile.jpg
  logos/
  images/
  illustrations/
  memes/
  screenshots/
  icons/
  references/
```

Asset rules:

- Use `/Users/cuevaio/projects/content/assets/profile/anthony-profile.jpg` for Anthony's profile image.
- Store logos in `/Users/cuevaio/projects/content/assets/logos`.
- When a brand, product, platform, or company is used visually, store and use its logo/icon when practical instead of relying on text-only labels.
- Store photos and generic image assets in `/Users/cuevaio/projects/content/assets/images`.
- Store illustration assets in `/Users/cuevaio/projects/content/assets/illustrations`.
- Store memes in `/Users/cuevaio/projects/content/assets/memes`.
- Store screenshots in `/Users/cuevaio/projects/content/assets/screenshots`.
- Store reusable icons in `/Users/cuevaio/projects/content/assets/icons`.
- Store source/reference images that may inspire future carousels in `/Users/cuevaio/projects/content/assets/references`.

## Asset Discovery Order

1. Check `/Users/cuevaio/projects/content/assets` first.
2. If the asset exists, use the existing content-library copy.
3. If the asset is missing and can be publicly sourced, use the `images-search` skill to find it online.
4. Prefer official source pages for logos and product marks.
5. Download the new asset into the appropriate reusable asset folder.
6. Normalize the asset if Pencil needs a PNG/JPG image fill.
7. Reference the reusable asset from the carousel `.pen` file with an absolute path.
8. Record the reusable path, Pencil image URL, and source in `source/asset-manifest.json`.

When an agent finds a new logo, image, illustration, meme, screenshot, or other useful asset, save it into the reusable asset library before using it in a carousel. Future carousels should reuse that content-library copy.

## Carousel Folder Structure

Use a date plus slug folder for each post:

```text
/Users/cuevaio/projects/content/carousels/YYYY-MM-DD-slug/
  source/
    carousel.pen
    outline.md
    copy-linkedin.md
    copy-instagram.md
    pre-publish-review.md
    metadata.json
    asset-manifest.json
  exports/
    x3/                  # standard 3x image exports for Instagram and PDF generation
    carousel.pdf         # LinkedIn document carousel generated from x3 images
  uploads/
    tmpfiles.json
    buffer-response.json
/Users/cuevaio/projects/content/logs/buffer-queue.log
```

`source/carousel.pen` is required for every carousel. Do not create an `assets/` folder inside the carousel directory.

## Asset Manifest

`source/asset-manifest.json` should list every asset used in the carousel:

```json
[
  {
    "name": "example-logo",
    "type": "logo",
    "reusablePath": "/Users/cuevaio/projects/content/assets/logos/example-logo.png",
    "pencilImageUrl": "/Users/cuevaio/projects/content/assets/logos/example-logo.png",
    "source": "user-provided or source URL",
    "usageNote": "Used on slide 02"
  }
]
```

Pencil image fills should use `pencilImageUrl` as the absolute `fill.url`. Do not use carousel-local duplicate copies.

Example image fill:

```json
{
  "fill": {
    "type": "image",
    "enabled": true,
    "url": "/Users/cuevaio/projects/content/assets/logos/example-logo.png",
    "mode": "fit"
  }
}
```

## Metadata

`metadata.json` should include:

- `slug`
- `topic`
- `topicType`
- `angle`
- `sourceMaterial`
- `readerTakeaway`
- `platforms`
- `mediaPlan`
- `instagramExport`
- `linkedinExport`
- `slideCount`
- `createdAt`
- `pencilFile`
- `assetManifest`
- `status`
- `prePublishReview`

Use `platforms: ["linkedin", "instagram"]` unless the user explicitly narrows it to one of those.

## Export Usage

- Instagram uses images from `exports/x3/`.
- LinkedIn uses `exports/carousel.pdf`.
- Generate `exports/carousel.pdf` from the same `exports/x3/*.png` files.
- Do not create `exports/x1/` in the standard workflow.
- Upload manifests should include both image assets and the PDF when queueing both platforms.
- Do not upload assets or live queue posts until `source/pre-publish-review.md` says `Approval: Approved` and `Blocking issues: None`.
