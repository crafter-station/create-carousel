# Carousel Design System

Use the existing Pencil deck only as a measured style reference. The topic can be anything: news, tutorials, concepts, comparisons, product lessons, events, opinion, or build-in-public stories.

## Source Reference

- Slide size: `1080x1350`
- Main font token: `$font-sans`, resolving first to `Satoshi`
- Visual style: high-contrast SaaS minimalism, black/white rhythm, sharp hierarchy, sparse copy.

The measurements below are the canonical reference. Do not rely on external folders or one-off source files when building future carousels.

Canonical slide IDs are a measurement reference only. Do not reuse their old topic copy or source asset paths.

| Slide | ID | Generic role |
| --- | --- | --- |
| 01 | `aRhT9` | Hook |
| 02 | `GY76Z` | Context or problem |
| 03 | `R09Zvx` | Mental model or concept |
| 04 | `Iz3z8` | Concrete example or detail |
| 05 | `BLrbz` | Steps, demo, or workflow |
| 06 | `N97NYD` | Comparison or tradeoff |
| 07 | `M3NS5Q` | Takeaway or CTA |
| 08 | `i2B0G` | Follow or profile |

## Canvas And Frame Placement

Create top-level slide frames with these base dimensions and spacing.

| Property | Value |
| --- | --- |
| Width | `1080` |
| Height | `1350` |
| Source deck y | `2846` |
| Horizontal step | `1180` |
| Visible gap | `100` |
| Common padding | `[70,80]` |
| Common vertical gap | `28` |
| Slide 8 vertical gap | `34` |
| Main content width | `920` |
| Narrow visual width | `880` |

Source deck x positions:

```text
Slide 01: x=-50
Slide 02: x=1130
Slide 03: x=2310
Slide 04: x=3490
Slide 05: x=4670
Slide 06: x=5850
Slide 07: x=7030
Slide 08: x=8210
```

For new decks, place slides in empty canvas space with the same `1180px` step and `100px` visible gap.

## Color System

| Token | Value | Use |
| --- | --- | --- |
| Light background | `#FAFAFA` | Slides 01, 03, 05, 07 |
| Dark background | `#171717` | Slides 02, 04, 06, 08 |
| Light card | `#FFFFFF` | Body/visual cards on light slides |
| Dark body card | `#262626` | Body cards on dark slides |
| Deep visual | `#0A0A0A` | Dark visual cards |
| Black | `#000000` | Badges, demo panels, dark emphasis |
| Light stroke | `#D4D4D4` | Cards on light slides |
| Dark stroke | `#404040` | Cards on dark slides |
| Light title | `#171717` | Titles on light slides |
| Light body | `#262626` | Body text on light slides |
| Dark text | `#FFFFFF` | Text on dark slides |
| Light footer | `#404040` | Footer on light slides |
| Dark footer | `#FFFFFF` | Footer on dark slides |
| Warm accent | `#EA580C` | Warnings, examples, notable values |
| Warning fill | `#FFF7ED` | Error, caution, or anti-pattern card |
| Warning stroke | `#FB923C` | Error, caution, or anti-pattern card |

## Typography

Pencil text nodes accept a `fontFamily` string, but `.pen` files do not embed or load font files. Satoshi must be installed in the environment where Pencil renders screenshots, PNGs, and PDFs.

Define this document variable before adding text nodes:

```json
"variables": {
  "font-sans": {
    "type": "string",
    "value": "Satoshi, 'Satoshi Variable', Inter, Arial, sans-serif"
  }
}
```

Use `fontFamily:"$font-sans"` on every text node. Do not hardcode raw `fontFamily:"Satoshi"` in new decks.

Do not intentionally switch this design to Inter. Inter is only a fallback for draft readability when Satoshi is not available; final exports should be reviewed with Satoshi loaded.

| Element | Font | Size | Weight | Line height | Notes |
| --- | --- | --- | --- | --- | --- |
| Badge | `$font-sans` | `18` | `900` | default | `letterSpacing: 2`, slide 8 uses `1.5` |
| Title | `$font-sans` | `58-70` | `900` | `1.02-1.06` | centered, fixed width `920` |
| Body copy | `$font-sans` | `28-29` | `500` | `1.32-1.35` | centered, fixed width |
| Visual label | `$font-sans` | `24-38` | `700-900` | default to `1.3` | use only a few labels |
| Footer | `$font-sans` | `20` | `500` | default | left `cueva.io`, right `NN / 08` |
| CTA/button | `$font-sans` | `28` | `700-900` | default | short text only |
| Demo/step text | `$font-sans` | `29` | `700` | default | white on black when in a dark panel |

Satoshi static files commonly provide `500` Medium, `700` Bold, and `900` Black. Prefer those weights over `800`; `800` may trigger synthetic weight matching or fallback rendering in Pencil exports.

Title sizing rules:

- Use `68-70` for short hooks and final profile titles.
- Use `66` for normal one-line titles.
- Use `58` for long comparison or analysis titles.
- Always use `textGrowth: "fixed-width"`, `width: 920`, and `textAlign: "center"`.

## Shared Slide Skeleton

Most slides follow this vertical stack inside the 1080x1350 frame:

```text
[Badge]      y 70, height 44
[Title]      y ~142, width 920
[Body card]  y ~239 or ~253, width 920
[Visual]     y ~385-605 depending slide, width 880 or 920
[CTA]        optional, after visual
[Footer]     absolute x 80, y 1258, width 920
```

Common frame properties:

```javascript
slide=I(document,{type:"frame",width:1080,height:1350,layout:"vertical",alignItems:"center",padding:[70,80],gap:28,fill:"#FAFAFA"})
```

Use `fill:"#171717"` for dark slides.

## Component Recipes

### Badge

Light slides use a black badge with white text. Dark slides use a white badge with dark text.

```javascript
badge=I(slide,{type:"frame",cornerRadius:100,fill:"#000000",padding:[10,20],height:44,alignItems:"center",justifyContent:"center",stroke:{fill:"#000000",thickness:1}})
I(badge,{type:"text",content:"{BADGE_LABEL}",fontFamily:"$font-sans",fontSize:18,fontWeight:"900",letterSpacing:2,fill:"#FFFFFF"})
```

Dark slide badge:

```javascript
badge=I(slide,{type:"frame",cornerRadius:100,fill:"#FFFFFF",padding:[10,20],height:44,alignItems:"center",justifyContent:"center",stroke:{fill:"#FFFFFF",thickness:1}})
I(badge,{type:"text",content:"{BADGE_LABEL}",fontFamily:"$font-sans",fontSize:18,fontWeight:"900",letterSpacing:2,fill:"#171717"})
```

### Title

```javascript
I(slide,{type:"text",content:"{HOOK_HEADLINE}",fontFamily:"$font-sans",fontSize:68,fontWeight:"900",lineHeight:1.02,fill:"#171717",textAlign:"center",textGrowth:"fixed-width",width:920})
```

### Body Card

Light slide:

```javascript
card=I(slide,{type:"frame",layout:"vertical",width:920,cornerRadius:24,fill:"#FFFFFF",padding:[32,40],gap:20,stroke:{fill:"#D4D4D4",thickness:1},alignItems:"center"})
I(card,{type:"text",content:"{PROBLEM_STATEMENT}",fontFamily:"$font-sans",fontSize:28,fontWeight:"500",lineHeight:1.35,fill:"#262626",textAlign:"center",textGrowth:"fixed-width",width:"fill_container"})
```

Dark slide:

```javascript
card=I(slide,{type:"frame",layout:"vertical",width:920,cornerRadius:24,fill:"#262626",padding:[32,40],gap:20,stroke:{fill:"#404040",thickness:1},alignItems:"center"})
I(card,{type:"text",content:"{CONTEXT_STATEMENT}",fontFamily:"$font-sans",fontSize:28,fontWeight:"500",lineHeight:1.35,fill:"#FFFFFF",textAlign:"center",textGrowth:"fixed-width",width:"fill_container"})
```

### Main Visual Card

Light visual card:

```javascript
visual=I(slide,{type:"frame",layout:"vertical",width:920,height:500,cornerRadius:28,fill:"#FFFFFF",padding:36,gap:24,stroke:{fill:"#D4D4D4",thickness:1},alignItems:"center",justifyContent:"center"})
```

Dark visual card:

```javascript
visual=I(slide,{type:"frame",layout:"vertical",width:920,height:500,cornerRadius:28,fill:"#0A0A0A",padding:[36,44],gap:28,stroke:{fill:"#404040",thickness:1},alignItems:"center",justifyContent:"center"})
```

### Footer

Footer is not pagination dots. Do not add dots.

```javascript
footer=I(slide,{type:"frame",layoutPosition:"absolute",x:80,y:1258,width:920,alignItems:"center",justifyContent:"space_between"})
I(footer,{type:"text",content:"cueva.io",fontFamily:"$font-sans",fontSize:20,fontWeight:"500",fill:"#404040"})
I(footer,{type:"text",content:"01 / 08",fontFamily:"$font-sans",fontSize:20,fontWeight:"500",fill:"#404040"})
```

Use `fill:"#FFFFFF"` for both footer text nodes on dark slides.

### Demo Or Step Card

Use this for commands, workflows, short checklists, step-by-step demos, or compact examples.

```javascript
panel=I(slide,{type:"frame",layout:"vertical",width:920,height:500,cornerRadius:28,fill:"#000000",padding:[44,42],gap:22,stroke:{fill:"#262626",thickness:2},alignItems:"start"})
header=I(panel,{type:"frame",gap:10,alignItems:"center",justifyContent:"start",width:"fit_content"})
I(header,{type:"ellipse",width:14,height:14,fill:"#FF5F57"})
I(header,{type:"ellipse",width:14,height:14,fill:"#FFBD2E"})
I(header,{type:"ellipse",width:14,height:14,fill:"#22C55E"})
I(panel,{type:"text",content:"{COMMAND_OR_STEP}",fontFamily:"$font-sans",fontSize:29,fontWeight:"700",fill:"#FFFFFF",textGrowth:"fixed-width",width:"fill_container"})
```

Terminal dots rule:

- The three dots must always sit at the terminal card's top-left.
- Do not center the dot row with the command text.
- The terminal panel should use `alignItems:"start"` so the dot row stays left-aligned.
- Terminal cards should contain the dot row and plain code/step text only.
- Do not place callout cards, rounded boxes, pills, badges, or secondary framed notes inside the terminal.
- If you need an explanatory note, place it outside the terminal card as a separate slide element.
- If the command block needs full-width layout, wrap only the command text in a transparent frame. Do not add visible fill, stroke, or corner radius inside the terminal.

## Topic Adaptation Matrix

| Topic type | Slide 01 | Slide 02 | Slide 03 | Slide 04 | Slide 05 | Slide 06 | Slide 07 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| News | Hook | What changed | Why it matters | Who it affects | What to watch | Implications | Takeaway |
| Tutorial | Pain | Setup | Mental model | Step 1 | Step 2 or demo | Common mistake | Checklist |
| Concept | Misconception | Definition | Mechanism | Example | Real use | Tradeoff | Takeaway |
| Comparison | Tension | Old way | New way | Where A wins | Where B wins | Decision rule | Recommendation |
| Build-in-public | What shipped | What broke | What changed | What worked | What failed | Lesson | Next move |
| Community/event | What happened | Why it mattered | Strongest moment | Pattern noticed | People or proof | Lesson | Next invite |

Slide 08 remains the follow/profile slide unless the user asks for a different ending.

## Slide Archetypes

### Slide 01 Hook

Purpose: strong opening claim, question, or tension.

Stack:

```text
Badge: y 70, h 44
Title: x 80, y 142, w 920, h ~69, font 68
Body card: x 80, y 239, w 920, h ~140
Optional comparison strip: x 100, y 407, w 880, h 170, gap 26
Proof card: x 100, y 605, w 880, h 500
Footer: x 80, y 1258, w 920
```

Use for:

- Before/after tension.
- A bold claim.
- A concrete example.
- A quick visual proof point.

### Slide 02 Context Or Problem

Purpose: show why the topic matters.

Stack:

```text
Badge y 70
Title y 142, font 66
Body card y 239
Context visual: absolute x 100, y 500, w 880, h 570
Footer y 1258
```

Context visual:

- Fill `#0A0A0A`, radius `28`, padding `[34,36]`, gap `28`, stroke `#404040`.
- Can contain source cards, logo grid, screenshot tiles, error/caution cards, or compact evidence.
- Use a warning card only for an actual problem, anti-pattern, or risk.

### Slide 03 Mental Model Or Concept

Purpose: explain the core idea in a simple diagram.

Diagram card:

- Fill `#FFFFFF`, radius `28`, padding `36`, gap `24`, stroke `#D4D4D4`.
- Three nodes with arrow icons between them work well.
- Node radius `24`, padding `[28,24]`, gap `14`.
- Use labels like `{INPUT}`, `{SYSTEM}`, `{OUTPUT}` or `{OLD}`, `{SHIFT}`, `{NEW}`.

### Slide 04 Concrete Example Or Detail

Purpose: make the abstract idea specific.

Visual card:

- Dark slide.
- Visual card `width: 920`, `height: 500`, radius `28`, fill `#0A0A0A`, padding `[36,44]`, gap `28`, stroke `#404040`.
- Use a pill for `{KEY_EXAMPLE}`.
- Use a row or two-column layout to show how the example maps to a result.

### Slide 05 Steps, Demo, Or Workflow

Purpose: show the practical sequence.

Demo card:

- Light slide.
- Card `width:920`, `height:500`, radius `28`, black fill, padding `[44,42]`, gap `22`, stroke `#262626` at `2px`.
- Header dots are `14x14`: `#FF5F57`, `#FFBD2E`, `#22C55E`.
- Header dots must be top-left aligned inside the terminal card, never centered.
- Step text uses `$font-sans`, `29px`, weight `700`, fill `#FFFFFF`, fixed-width.
- Terminal content must be plain code/step text. Do not add inner cards, boxes, callouts, or pills inside the terminal panel.
- Use this for commands, steps, checklist items, or short before/after snippets.

### Slide 06 Comparison Or Tradeoff

Purpose: help the reader decide.

Compare card:

- Dark slide.
- Title can shrink to `58px` for a longer headline.
- Card `width:920`, `height:500`, radius `28`, padding `34`, gap `26`, fill `#0A0A0A`, stroke `#404040`.
- Two columns, both `width: fill_container`, `height: fill_container`, radius `24`, padding `28`, gap `20`.
- Left column can be light for `{OPTION_A}`.
- Right column can be black for `{OPTION_B}` or the recommended option.
- Column title `35-38px`, weight `900`.
- Column bullets `25px`, weight `600-700`, centered.

### Slide 07 Takeaway Or CTA

Purpose: land the one thing to remember.

Final concept card:

- Light slide.
- Card `width:920`, `height:500`, radius `28`, padding `[42,44]`, gap `26`, stroke `#D4D4D4`.
- Icon circle `120x120`, radius `100`, fill `#000000`.
- Icon `64x64`, white.
- Main line `38px`, weight `900`, fill `#171717`.
- Secondary line `28px`, weight `700`, fill `#262626`.
- Optional CTA pill radius `100`, fill `#000000`, padding `[20,60]`.
- CTA text `28px`, weight `700`, white.

### Slide 08 Follow Or Profile

Purpose: human ending and follow CTA.

Stack:

```text
Badge: y 70, h 44
Title: x 80, y 148, w 920, h ~71, font 70
Body card: x 80, y 253, w 920, h 98
Profile card: x 80, y 385, w 920, h 560
Button: x 384, y 979, w 312, h 74
Footer: x 80, y 1258, w 920
```

Profile card:

- Fill `#FFFFFF`, radius `28`, padding `[40,48]`, gap `24`, stroke `#D4D4D4`.
- Profile image `180x180`, radius `90`, clip true, image fill mode `fill`.
- Future decks should use `/Users/cuevaio/projects/content/assets/profile/anthony-profile.jpg`.
- Name text `38px`, weight `900`, fill `#171717`.
- Subtext `25px`, weight `500`, lineHeight `1.3`, fill `#525252`.
- Button fill `#FFFFFF`, radius `12`, padding `[18,52]`.
- Button text `28px`, weight `900`, fill `#171717`.

## Design Rules

- Preserve the eight-slide role sequence unless the topic needs fewer slides or the user asks for a different structure.
- Preserve alternating light/dark backgrounds.
- Preserve `$font-sans` and verify final exports render with Satoshi, not the fallback font.
- Preserve footer placement and page-index format.
- Use the footer page index instead of pagination dots.
- Prefer duplicated source slides over rebuilding from scratch.
- Change only topic-specific copy, labels, logos, diagrams, screenshots, examples, and supporting assets by default.
- Brand mentions in visuals should use brand icons/logos when practical. A logo tile with a short label is better than a text-only brand pill.
- Keep text large enough for mobile feed viewing.
- Keep body cards short and centered.
- Use local PNG/JPG assets as image fills. Do not reference remote URLs from Pencil.
- Use assets only from `/Users/cuevaio/projects/content/assets`, referenced from `source/carousel.pen` with absolute image-fill URLs.

## Do Not

- Do not switch this carousel style to `Inter`.
- Do not introduce gradients, shadows, glassmorphism, 3D effects, or unrelated decoration.
- Do not use a generic Instagram carousel template.
- Do not add pagination dots.
- Do not move the footer.
- Do not overfill slides with copy.
- Do not redesign the deck unless the user explicitly asks.
