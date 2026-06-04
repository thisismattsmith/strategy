// book-structure.ts — the spine of The Second Advantage.
//
// This file defines reading order, hierarchy, and display labels.
// Titles live in the markdown frontmatter (src/content/book/<slug>.md) and
// are resolved at build time via getResolvedBook().
//
// Renaming a markdown file? Update the matching `slug` here too — they must
// stay in sync. getResolvedBook() throws a clear error at build time if they
// don't, so this fails loudly rather than silently producing 404s.

import { getCollection } from 'astro:content';

export type BookKind = 'intro' | 'part' | 'chapter';

export interface BookNode {
  slug: string;       // matches the filename in src/content/book/ AND the URL slug
  kind: BookKind;     // controls layout (light vs dark) and label format
  label: string;      // e.g. "Part 1", "Chapter 1" — empty for the intro
  partSlug?: string;  // for chapters only: the slug of their parent part
}

// A node with its title resolved from the markdown frontmatter.
export interface ResolvedNode extends BookNode {
  title: string;
}

// Reading order. Prev/next derive from the array index.
// To add a new page: add an entry here AND drop a matching `<slug>.md` in
// src/content/book/. The markdown's frontmatter supplies the title.
export const BOOK: BookNode[] = [
  { slug: 'introduction', kind: 'intro', label: '' },

  { slug: 'part-1-intake', kind: 'part', label: 'Part 1' },
  { slug: 'treating-intake-like-a-sales-pipeline', kind: 'chapter', label: 'Chapter 1', partSlug: 'part-1-intake' },
  { slug: 'qualifying-the-work',                   kind: 'chapter', label: 'Chapter 2', partSlug: 'part-1-intake' },
  { slug: 'discovery',                             kind: 'chapter', label: 'Chapter 3', partSlug: 'part-1-intake' },
  { slug: 'initiating-not-just-intaking',          kind: 'chapter', label: 'Chapter 4', partSlug: 'part-1-intake' },

  { slug: 'part-2-running-the-work',          kind: 'part', label: 'Part 2' },
  { slug: 'part-3-running-the-team',          kind: 'part', label: 'Part 3' },
  { slug: 'part-4-bringing-it-all-together',  kind: 'part', label: 'Part 4' },
];

// --- sync helpers (no titles) -----------------------------------------

export function getNode(slug: string): BookNode | undefined {
  return BOOK.find((n) => n.slug === slug);
}

// Given the current slug, return the slug of the part it belongs to (if any).
// Used by the sidebar to know which Part accordion to open by default.
export function activePartSlug(slug: string): string | undefined {
  const node = getNode(slug);
  if (!node) return undefined;
  if (node.kind === 'part') return node.slug;
  if (node.kind === 'chapter') return node.partSlug;
  return undefined;
}

// --- async helpers (titles resolved from markdown) --------------------

// Resolve the spine with titles pulled from each markdown's frontmatter.
// Throws if any BOOK slug has no matching markdown file (and vice versa
// warns) — this means renaming a file without updating BOOK fails the build
// loudly rather than silently 404ing.
export async function getResolvedBook(): Promise<ResolvedNode[]> {
  const entries = await getCollection('book');
  const byId = new Map(entries.map((e) => [e.id, e]));

  const missing = BOOK.filter((n) => !byId.has(n.slug));
  if (missing.length) {
    throw new Error(
      `[book-structure] These BOOK entries reference markdown files that don't exist: ` +
      missing.map((n) => `'${n.slug}.md'`).join(', ') +
      `. Either create the file, or update the slug in src/data/book-structure.ts.`
    );
  }

  const orphans = entries.filter((e) => !BOOK.some((n) => n.slug === e.id));
  if (orphans.length) {
    console.warn(
      `[book-structure] These markdown files aren't in the BOOK spine and won't appear in the book: ` +
      orphans.map((e) => `'${e.id}.md'`).join(', ')
    );
  }

  return BOOK.map((node) => ({
    ...node,
    title: byId.get(node.slug)!.data.title,
  }));
}

export async function getResolvedNode(slug: string): Promise<ResolvedNode | undefined> {
  const resolved = await getResolvedBook();
  return resolved.find((n) => n.slug === slug);
}

export async function getResolvedPrev(slug: string): Promise<ResolvedNode | undefined> {
  const resolved = await getResolvedBook();
  const i = resolved.findIndex((n) => n.slug === slug);
  return i > 0 ? resolved[i - 1] : undefined;
}

export async function getResolvedNext(slug: string): Promise<ResolvedNode | undefined> {
  const resolved = await getResolvedBook();
  const i = resolved.findIndex((n) => n.slug === slug);
  return i >= 0 && i < resolved.length - 1 ? resolved[i + 1] : undefined;
}

// Group the resolved book into a structure the sidebar can render directly:
//   [ { node: intro }, { node: part1, chapters: [...] }, ... ]
export interface ResolvedTocGroup {
  node: ResolvedNode;
  chapters: ResolvedNode[];
}

export async function getResolvedTocGroups(): Promise<ResolvedTocGroup[]> {
  const resolved = await getResolvedBook();
  const groups: ResolvedTocGroup[] = [];
  for (const node of resolved) {
    if (node.kind === 'intro' || node.kind === 'part') {
      groups.push({ node, chapters: [] });
    } else if (node.kind === 'chapter') {
      const last = groups[groups.length - 1];
      if (last) last.chapters.push(node);
    }
  }
  return groups;
}
