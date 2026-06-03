# Walkthrough: writing a Field Note

How one piece of prose becomes two outputs: a blog post on the site and a carousel PDF for LinkedIn.

This document is the contract for that process. Point me at it when starting a new piece and we both work from the same definition.

---

## The workflow at a glance

```
1.  You write prose                          ←  your work
2.  I draft slide text from the prose
3.  You revise the slide text
4.  I render the carousel PDF + the .mdx     ←  mechanical
5.  You revise specific slides / sections by naming them
```

The pivot is **step 2/3**. The prose is yours. The slide text is a separate artefact we agree on before any PDF is rendered. That puts you in control of what each slide actually says, before it's committed to a rendered slide.

---

## Step by step

### 1 · You write prose

A full draft, in your voice. No need to think in slides yet, write the argument as it wants to be written.

Save the draft anywhere; you'll paste it into our conversation. Don't worry about Astro frontmatter or component imports at this stage.

### 2 · I draft slide text

I extract the spine of your prose (the beats that carry the argument) and write the actual text for each carousel slide as a plain readable document. Not HTML. Not PDF. Just the words, slide by slide.

The output is a markdown block per slide, using the template at the end of this file. You can read it like a script.

Default deck length: **10–12 slides**, including cover and the standardised generic CTA. The argument's shape decides the exact number.

### 3 · You revise the slide text

This is the new step that didn't exist before. You read the slide text as a document and revise:

- Rewrite headlines.
- Cut a slide.
- Reorder.
- Change emphasis.
- Add a slide.

You give me the changes by quoting slide numbers ("Slide 04 headline → '…'", "drop slide 07", "add a slide between 03 and 04 saying X").

We iterate until the slide text is locked.

### 4 · I render

Once the slide text is approved, I do two things in one pass:

1. **Carousel.** Drop the locked text into `carousel-template.html`, generate the PDF, hand it back.
2. **Blog post.** Create the `.mdx` file in `src/content/blog/`, with your prose, the frontmatter filled in, and any interactive components wired up.

This step is mechanical. There's no creative work happening here, only assembly.

### 5 · You revise

Revisions name specific parts:

- "Slide 06 body: change to X"
- "The post's intro feels long; tighten it"
- "Use `<QuestionFlow>` instead of the static list on slide 05"

I touch only what you name. Templates and components don't get regenerated.

---

## Standard invocations

The shorter the better. Recommended phrases for each step:

| Step | What to say |
| --- | --- |
| Starting a new piece | **"New field note. Prose below. Draft the slide text."** |
| Approving the slide text | **"Lock the slide text. Render."** |
| Revising a slide | **"Slide N: [change]."** |
| Revising the post | **"Post: [change]."** |
| Quick fixes to the rendered carousel | **"Regenerate the carousel with [change]."** |

You don't need to use these verbatim; they're conventions to make it cheap.

---

## Conventions

### File locations

```
src/content/blog/[slug].mdx          ← blog posts
src/components/[Component].astro     ← reusable components (library)
src/components/Interactive.astro     ← the wrapper for any interactive element
src/layouts/PostLayout.astro         ← post header/footer
src/styles/tokens.css                ← single source of truth for design tokens
walkthrough.md                       ← this file
```

Carousels are not in the repo. They live in `outputs/` as one HTML + PDF per deck.

### Frontmatter: required fields

```yaml
title:        string          # Required
description:  string          # Required, SEO + OG description
pubDate:      YYYY-MM-DD      # Required
category:     string          # Required. e.g. Strategy, Practice, Method
note_number:  integer         # Required. Field Note No. XX (unique, manual)
draft:        boolean         # Defaults to false
```

### Frontmatter: optional

```yaml
principle:    integer (1-10) # Links the post to a principle on the homepage
updatedDate:  YYYY-MM-DD
```

### Numbering

`note_number` is **manual**: you choose it. It surfaces in the post header, the blog index, the carousel's generic CTA, and eventually the OG image. The schema requires it; missing it will fail the build.

Current numbers in use:
- No. 01 · Eight questions to position your L&D team
- No. 02 · Reacting, Predicting, Anticipating

Next available: **No. 03**.

### Voice and tone

- Plain, direct, no jargon-as-drama.
- Short sentences when delivering a punch; longer when explaining.
- Lower-case headlines, no title case.
- The reader is an L&D leader, not a beginner.
- **No em dashes.** Do not use em dashes (—) in any drafted text (carousel slides, blog prose, OG copy) unless they appear verbatim in source text the user has provided. Em dashes are a strong AI tell and make written content look generated even when it isn't. Use commas, periods, colons, semicolons, or parentheses instead.
- **Asterisks denote accent.** Wrap word(s) in `*asterisks*` to mark emphasis. The rendered treatment depends on context:
  - In **headlines** (cover h1, statement h2, emphasis h2, numbered h2): renders as the orange accent bar behind the text.
  - In **body text** (statement body, numbered note, emphasis sub, list items): renders as *italic*.
  - The two treatments don't mix on the same slide; the rule is automatic by element type.

### Length

- Posts: **800–1,800 words**. The eight-questions post is ~600 words and the three-postures is ~1,500.
- Carousels: **10–12 slides** including cover + generic CTA.

---

## Component library

Components live in `src/components/` and are imported per-post in MDX.

| Component | Purpose | Used in |
| --- | --- | --- |
| `Interactive.astro` | The frame around any interactive element. Provides the panel, soft shadow, mono metadata line (label + instruction), and optional figure serial. **Always wrap interactive components in this.** | All posts with interactivity |
| `QuestionFlow.astro` | Vertical click-to-expand sequence. Single-open accordion. Use when the items form a sequence and detail can be hidden until the reader is curious. | Field Note No. 01 |
| `PostureSelect.astro` | 3-column parallel boxes. Descriptions visible by default; clicking a box reveals its title above the description. Single-open. Use for "pick which of these you are" interactions. | Field Note No. 02 |

When a post needs a graphic that doesn't exist as a component, we add one to the library. Static graphics (CSS-only, no JS) are cheap to add; interactive ones are a small build each time.

### Always wrap interactive content

```mdx
<Interactive label="Topic · type" instruction="What to do" serial="FIG. 01">
  <SomeComponent />
</Interactive>
```

The wrapper signals "this is interactive" with its frame, instruction line, and shadow.

---

## Carousel anatomy

### Page geometry

- **1080 × 1350 px** (4:5 portrait). Best for LinkedIn document posts; works natively on Instagram.
- One slide per PDF page.
- Safe-zone padding: 96 px from each edge.

### Slide types

| Type | Use |
| --- | --- |
| `.slide.cover` | First slide. Hook + signal accent. Usually `.dark`. **No kicker** — the headline carries the deck alone. Use `&nbsp;` between words that should stay on the same line (e.g. "L&D&nbsp;team"). |
| `.slide.statement` | One big idea + body. Most flexible slide. |
| `.slide.numbered` | Big index (e.g. 01/03) + headline. Use for series within the deck. |
| `.slide.list` | Titled list of points. |
| `.slide.emphasis` | LIGHT "big point" moment mid-deck. Cover-style typography (large display headline + sub) on light background. Use for the peak point of the argument. Footer-left carries the CATEGORY label (e.g. "Strategy"), not the section tag. Matches the cover slide. |
| `.slide.quote` | Large quote with orange left-bar and optional attribution. Light by default; `.slide.dark.quote` for the dark variant. Use when a quote deserves its own slide. |
| `.slide.gen-cta` | **Standardised final slide.** Always last. Dark. Locked design. |

### The dark/light rhythm

- **Slide 1 (cover):** dark.
- **Slides 2 … N-1:** light.
- **Slide N (gen-cta):** dark.

Two dark bookends, light argument between. Cover and gen-CTA are visually distinct (cover is left-aligned with a swipe affordance; gen-CTA has the inset stripe and the brand mark in the footer).

### The generic CTA: locked

The final slide of every carousel is fixed:

- Top stripe: `END · Field Notes · No. XX` between two inset hairlines.
- Headline: `More **like this**.` (accent on "like this").
- Body: standard follow copy.
- Footer left: `● Strategic L&D`.
- Footer right: `XX / TOTAL`.

The only per-deck variable is the `No. XX`, pulled from the post's `note_number`. Everything else stays.

### Always close on a post-specific punch *before* the generic CTA

The generic CTA is housekeeping. The argument's landing, the punchy close, needs to live on the slide before it. So:

- Slide N-1: post-specific punch (a punchy statement, a question, the argument's payoff).
- Slide N: generic CTA.

A carousel that ends on the generic CTA without a punch above it has wasted the most-remembered slide.

---

## Open items

Things flagged but not yet built:

- **OG images.** Per-post 1200 × 630 PNG using the brand template. Will be an Astro endpoint at `/og/[slug].png` pulling `note_number` + `title` from frontmatter. Marker in `BaseLayout.astro`.
- **Series-aware "next field note" link.** When there are more posts, the post footer could surface a link to the next/previous field note.
- **Component library: more graphics.** As posts need them. Current backlog ideas: static "the flatline" performance chart, static "the void" doc-vs-doc panel.

---

## Templates

Two templates for copy-paste. The blog post template is for your prose. The slide-text template is what I send you in step 2.

### Blog post template (`.mdx`)

Save as `src/content/blog/[slug].mdx`.

```mdx
---
title: "[Working title]"
description: "[1-2 sentence description. Used on the post page, in the blog index, and as the SEO/OG description.]"
pubDate: 2026-MM-DD
category: Strategy
note_number: [next integer]
# principle: 3        # optional. Link to a principle on the homepage
draft: true
---

// Import any components used in the post. Remove the ones you don't need.
import Interactive    from '../../components/Interactive.astro';
import QuestionFlow   from '../../components/QuestionFlow.astro';
import PostureSelect  from '../../components/PostureSelect.astro';

[Opening. Set up the question or problem. 1-3 short paragraphs.]

## [First section heading]

[Body...]

[If you need an interactive element, wrap it in Interactive:]

<Interactive label="Topic · type" instruction="Action verb" serial="FIG. 01">
  <QuestionFlow />
</Interactive>

## [Next section]

[Body...]

> [Optional pull quote for emphasis. Renders with the orange left bar.]

## [Closing section]

[The punchy close.]
```

### Carousel slide-text template (step 2 output)

This is the format I'll send you in step 2 for review before any rendering. Plain markdown, one block per slide.

```markdown
# Carousel: [Post title]
- Note number: 03
- Total slides: 11
- Mapping: based on [post slug]

---

## Slide 01 · Cover (dark)
- Header tag (right): Field note
- Headline: [The hook. Wrap word(s) in *asterisks* to mark the orange accent. Use `[[keep together]]` notation for word pairs that should not wrap apart, e.g. "L&D [[team]]".]
- Sub: [One short line under the headline]
- Footer (left): [Category name, e.g. Positioning, Strategy]

---

## Slide 02 · Statement
- Header tag (right): The problem
- Kicker: The problem
- Headline: [Statement headline. *Asterisks* for accent.]
- Body: [Supporting paragraph, 1-2 sentences max]
- Section tag (footer left): [Short topic name; repeats across the deck]

---

## Slide 03 · Numbered
- Header tag (right): Posture 01 / 03
- Bignum: 01 / 03
- Headline: [Short headline for this item]
- Body: [1-2 sentences]
- Section tag: [topic]

---

## Slide 04 · List
- Header tag (right): The payoff
- Headline: [The list's title. *Asterisks* for accent on a word]
- Items:
  1. [First item]
  2. [Second item]
  3. [Third item]
  4. [Fourth item]
  5. [Fifth item]
- Section tag: [topic]

---

## Slide N · Emphasis (LIGHT, mid-deck peak)
- Header tag (right): [tag, often "Field note" or the deck's tag]
- Kicker: [Topic; often the same as the cover's kicker]
- Headline: [The big point. *Asterisks* for accent.]
- Sub: [Supporting paragraph in full ink, fuller voice than a statement body.]
- Footer (left): [CATEGORY: e.g. Strategy. Not the section tag.]

---

## Slide N · Quote
- Header tag (right): [tag]
- Quote: [The quote text. Plain prose; the slide handles emphasis.]
- Attribution: [Source: name or role, will render in mono uppercase]
- Section tag: [topic]

---

[... more slides ...]

---

## Slide N-1 · Statement (the post-specific close)
- Kicker: The move that matters     # or whatever lands the argument
- Headline: [The argument's landing. *Asterisks* for accent.]
- Body: [The final sentence of the case.]
- Section tag: [topic]

---

## Slide N · Generic CTA (standard final slide)
*No content to write. Pulled from the standardised template using the note number above.*
```

When you revise this document, just edit it inline and send it back. I'll diff against my version and render only what changed.

---

## A note on what I can and can't verify

I can verify the build (`npm run build`), screenshot any page or component, and generate the PDF. I can confirm the components render and the schema validates.

I can't run your local dev server or test the interactive hydration in your actual browser. After every change, the final smoke-test is yours: `npm run dev`, click through the post, swipe through the PDF. If something looks wrong, name what and I'll fix it.
