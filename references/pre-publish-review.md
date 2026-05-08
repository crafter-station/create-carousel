# Pre-Publish Review

Run this review after final x3 PNG export and PDF generation, before tmpfiles upload or live Buffer queueing.

The reviewing agent must inspect the rendered output images directly. Do not approve based only on Pencil source, layer names, outline text, or assumptions.

## Required Inputs

- `source/carousel.pen`
- `source/outline.md`
- `source/asset-manifest.json`
- `exports/x3/slide-01.png` through the final ordered slide
- `exports/carousel.pdf` when LinkedIn is included
- `source/copy-linkedin.md` and `source/copy-instagram.md` when queueing both platforms

## Review Method

1. Open or read every exported x3 PNG in order.
2. Compare the exports to `source/outline.md` and `source/asset-manifest.json`.
3. Check the PDF exists and was generated from the same x3 image set.
4. Check the visual system against `carousel-design-system.md` and `pencil-workflow.md`.
5. Write the result to `source/pre-publish-review.md` using the template.
6. If any blocker exists, fix the Pencil file, re-export, regenerate the PDF, and run the review again.

## Blocking Checks

The review is rejected if any item below fails:

- Slide count and order match the outline and footer indexes.
- Every exported PNG is `3240x4050` for x3 output.
- No text, icons, logos, screenshots, cards, terminal content, or footer elements overflow their containers.
- Nothing important is clipped by slide bounds, card masks, image masks, or decorative overlays.
- Text is readable at mobile feed size; dense copy is shortened instead of shrunk below the style guide.
- Contrast is strong on both light and dark slides, including captions, labels, footer text, code text, and badges.
- Dark slides use the correct dark visual language; light slides use the correct light visual language.
- The deck keeps Satoshi typography, measured padding, footer placement, visual card radii, strokes, and spacing.
- Terminal cards use top-left three dots and contain only plain code, commands, logs, or steps. No inner boxes, cards, callouts, or pills inside terminal content.
- Any brand, product, platform, company, framework, package, or technology that is central to a slide visual uses its logo/icon when practical.
- Brand/product/technology marks come from `/Users/cuevaio/projects/content/assets` and are recorded in `source/asset-manifest.json`.
- Text-only brand labels have an explicit reason, such as no usable official mark or the mark would create clutter.
- Logos are not distorted, pixelated, cropped awkwardly, or placed with poor contrast.
- Screenshots, memes, photos, and diagrams are sharp enough for mobile viewing and match the deck style.
- The Anthony profile image on the final slide uses `/Users/cuevaio/projects/content/assets/profile/anthony-profile.jpg`.
- Instagram assets are the ordered x3 PNGs from `exports/x3/`.
- LinkedIn asset is `exports/carousel.pdf`, generated from the same x3 PNGs.
- Captions do not promise content missing from the carousel.
- There are no obvious typos, duplicated slide numbers, broken URLs, placeholder labels, or leftover source-topic text.

## Approval Standard

Use `Approval: Approved` only when all blocking checks pass.

Use `Blocking issues: None` only when there are no required fixes.

If the review fails, list each issue with the slide number, problem, and exact required fix. Do not upload to tmpfiles or run Buffer live queueing until the report is approved.
