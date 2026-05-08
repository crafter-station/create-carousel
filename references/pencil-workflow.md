# Pencil Workflow

## Source Of Truth

The measured design rules in [carousel-design-system.md](carousel-design-system.md) are the source of truth. Use those rules for layout, typography, color, and component measurements unless the user asks for a new visual direction.

Canonical slide IDs in order: `aRhT9`, `GY76Z`, `R09Zvx`, `Iz3z8`, `BLrbz`, `N97NYD`, `M3NS5Q`, `i2B0G`.

## Build Steps

1. Create a new Pencil file at `/Users/cuevaio/projects/content/carousels/YYYY-MM-DD-slug/source/carousel.pen` for every carousel.
2. Run `/Users/cuevaio/projects/create-carousel/scripts/verify-fonts.sh` before detailed work or final export.
3. Define the `font-sans` document variable before adding text nodes.
4. Build or duplicate slides using the measured design rules.
5. Run the measurement pass below before detailed edits.
6. Import all assets into the content library before using them.
7. Reference assets from `/Users/cuevaio/projects/content/assets` using absolute paths in Pencil image fills.
8. Do not create a carousel-local `assets/` folder or duplicate shared assets into the carousel folder.
9. Replace only topic-specific copy, labels, diagrams, screenshots, examples, logos, and brand assets.
10. Keep the footer on every slide with `cueva.io` and the page index.
11. Use `/Users/cuevaio/projects/content/assets/profile/anthony-profile.jpg` for the final slide profile image.
12. Verify key slides with screenshots before export.
13. After final export, complete `source/pre-publish-review.md` before any upload or Buffer queueing.

Required font variable:

```json
"variables": {
  "font-sans": {
    "type": "string",
    "value": "Satoshi, 'Satoshi Variable', Inter, Arial, sans-serif"
  }
}
```

Use `fontFamily:"$font-sans"` on every text node. Pencil does not install or load fonts from `.pen`; Satoshi must be installed where Pencil renders.

## Asset Workflow

Use `/Users/cuevaio/projects/content/assets` as the only reusable asset library.

Expected reusable asset folders:

```text
/Users/cuevaio/projects/content/assets/profile/
/Users/cuevaio/projects/content/assets/logos/
/Users/cuevaio/projects/content/assets/images/
/Users/cuevaio/projects/content/assets/illustrations/
/Users/cuevaio/projects/content/assets/memes/
/Users/cuevaio/projects/content/assets/screenshots/
/Users/cuevaio/projects/content/assets/icons/
/Users/cuevaio/projects/content/assets/references/
```

Rules:

- Check the reusable asset library before searching for new assets.
- If the needed asset already exists in the reusable asset library, use that copy.
- If the needed public asset is missing, use the `images-search` skill to find it online.
- Prefer official brand/media kits, official domains, package docs, GitHub org assets, or reliable source pages for logos.
- Download new assets into the appropriate reusable asset folder before using them.
- Normalize assets for Pencil when needed: SVG/source files are okay to keep as references, but Pencil image fills should use PNG or JPG copies.
- When you find or receive a new asset, save a copy into the right reusable asset folder before using it.
- If a brand, product, platform, or company is mentioned in a visual, use the logo/icon when practical instead of a text-only label. Example: use the Google Cloud logo plus optional small label, not just `Google Cloud` text.
- Text-only brand pills are allowed only when no usable brand mark can be found or the slide would become visually cluttered.
- Record used assets in the carousel `source/asset-manifest.json` with reusable path, Pencil image URL, source URL or note, and license/usage note when known.
- Do not reference files outside `/Users/cuevaio/projects/content` in Pencil image fills.
- Do not reference remote image URLs directly from Pencil.
- Do not create per-carousel `assets/` folders. Assets are shared from `/Users/cuevaio/projects/content/assets` and referenced by absolute path.
- Do not use `../assets/...` paths in Pencil image fills. Use absolute content-library paths.

Use absolute URLs in Pencil image fills:

```json
{
  "type": "image",
  "enabled": true,
  "url": "/Users/cuevaio/projects/content/assets/profile/anthony-profile.jpg",
  "mode": "fill"
}
```

Example: if a post needs a product logo, first check `/Users/cuevaio/projects/content/assets/logos`. If it is missing, search for the logo, download a usable asset, store it in `assets/logos`, and reference that shared content asset from the `.pen` file with its absolute path.

## Topic Adaptation

Use the measured slide archetypes as a starting structure, not as a fixed story. Adapt the roles based on the brief:

- News: hook, what changed, why it matters, who it affects, what to watch, implications, takeaway.
- Tutorial: pain, setup, mental model, steps, demo, common mistake, checklist.
- Concept: misconception, definition, mechanism, example, real use, tradeoff, takeaway.
- Comparison: tension, old way, new way, where each option wins, decision rule, recommendation.
- Build-in-public: what shipped, what broke, what changed, what worked, what failed, lesson, next move.
- Community/event: what happened, why it mattered, strongest moment, pattern noticed, people/proof, lesson, next invite.

## Measurement Pass

Before building or revising a deck, confirm these details against [carousel-design-system.md](carousel-design-system.md):

- Every slide is `1080x1350`.
- Source slide order matches `aRhT9`, `GY76Z`, `R09Zvx`, `Iz3z8`, `BLrbz`, `N97NYD`, `M3NS5Q`, `i2B0G`.
- Copied or new slides preserve the `1180px` horizontal step and `100px` visible gaps.
- Visible text uses `fontFamily:"$font-sans"`, resolving to Satoshi for final exports.
- Common slide padding is `[70,80]`.
- Common content width is `920`.
- Light slides use `#FAFAFA`; dark slides use `#171717`.
- Footer is absolute at `x:80`, `y:1258`, `width:920`.
- Footer text is `#404040` on light slides and `#FFFFFF` on dark slides.
- Visual cards preserve the radius, stroke, padding, and height ranges from the matching slide archetype.
- Final slide profile image uses `/Users/cuevaio/projects/content/assets/profile/anthony-profile.jpg` for future decks.

## Export Rules

- Export only x3 slide PNGs for the standard workflow.
- Instagram uses ordered x3 slide images.
- LinkedIn uses one PDF document assembled from those same x3 slide images.
- Do not queue LinkedIn from individual slide images unless the user explicitly asks for a non-document image post.
- Store exports under `/Users/cuevaio/projects/content/carousels/YYYY-MM-DD-slug/exports`.
- Do not export until the user requests publishing/exporting or the workflow explicitly needs queued posts.
- Do not upload or queue until `source/pre-publish-review.md` is approved with no blocking issues.

Standard export layout:

```text
exports/
  x3/
    slide-01.png
    ...
    slide-08.png
  carousel.pdf
```

Do not create `exports/x1/` in the standard workflow.

## Visual Verification

Check before export:

- Text is readable at mobile feed size.
- Satoshi is installed and rendered; fallback fonts are not used in final exports.
- White slides and black slides maintain strong contrast.
- Footer index matches slide order.
- No text overflows or gets clipped.
- Topic-specific visuals do not break the existing style.
- The deck still matches the measured layout in `carousel-design-system.md`.

## Pre-Publish Review Gate

After exporting `exports/x3/*.png` and generating `exports/carousel.pdf`, inspect the rendered media directly and write `source/pre-publish-review.md` from the template.

The review must reject the deck if any rendered slide has overflow, clipping, poor contrast, unreadable text, distorted logos, missing required brand/product/technology marks, wrong slide order, wrong footer index, or platform export mismatch.

If the review finds blockers, fix `source/carousel.pen`, re-export x3 PNGs, regenerate `exports/carousel.pdf`, and review again. Only upload or queue when the report says `Approval: Approved` and `Blocking issues: None`.
