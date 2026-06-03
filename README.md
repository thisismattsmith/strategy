# Strategic L&D — website

Astro site for Strategic L&D. Static-first, MDX blog, interactive islands.

## Run

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

Requires Node 18.20+, 20.3+, or 22+.

## Structure

```
src/
  styles/tokens.css          # design tokens — single source of truth
  layouts/
    BaseLayout.astro         # header + footer + meta, used by every page
    PostLayout.astro         # blog post wrapper (editorial typography)
  components/
    Header.astro             # black utility strip + nav
    Footer.astro
    QuestionFlow.astro       # INTERACTIVE island — click-to-expand flow
  pages/
    index.astro              # homepage
    blog/index.astro         # notes listing
    blog/[slug].astro        # post route (renders MDX)
  content/
    blog/*.mdx               # posts
  content.config.ts          # blog collection schema
```

## Writing a post

Create `src/content/blog/your-slug.mdx`:

```mdx
---
title: "..."
description: "..."
pubDate: 2026-05-28
category: Strategy
principle: 3          # optional — links this post to principle N on the homepage
---

import QuestionFlow from '../../components/QuestionFlow.astro';

Your prose...

<QuestionFlow />

More prose...
```

- `.md` for plain posts, `.mdx` when you need a component.
- The `principle` field wires the post into the homepage Principles list automatically.
- Components are imported per-post at the top of the MDX. The library lives in `src/components/`.

## Interactive components (islands)

`QuestionFlow.astro` is dependency-free: it ships a small inline `<script>` that Astro
bundles automatically. No `client:*` directive is needed for a plain Astro component
with an inline script. If you later add React/Svelte components, install the matching
`@astrojs/*` integration and use `client:load` / `client:visible` on those.

## Before deploying

- Set the real production URL in `astro.config.mjs` (`site:`).
- Replace the draft post prose with final copy.
- Confirm the 8th question wording in `QuestionFlow.astro` (currently a placeholder).
