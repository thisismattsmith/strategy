// book-structure.ts — single source of truth for The Second Advantage.
// Defines reading order, hierarchy (which chapters belong to which part),
// and display labels. Markdown files in src/content/book/ just carry title
// + body — this file decides what's a chapter vs part, what order they sit
// in, and how prev/next links resolve.

export type BookKind = 'intro' | 'part' | 'chapter';

export interface BookNode {
  slug: string;       // matches the filename in src/content/book/ and the URL slug
  title: string;      // canonical title (used on the page and in the TOC)
  kind: BookKind;     // controls layout (light vs dark) and label format
  label: string;      // e.g. "Part 1", "Chapter 1" — empty for the intro
  partSlug?: string;  // for chapters only: the slug of their parent part
}

// Reading order. Prev/next derive from the array index.
// Add a new entry, drop a markdown file with the matching slug, and it
// shows up in the TOC + reading flow with no other wiring.
export const BOOK: BookNode[] = [
  { slug: 'introduction', title: 'Introduction', kind: 'intro', label: '' },

  { slug: 'part-1-intake', title: 'Intake', kind: 'part', label: 'Part 1' },
  { slug: 'treating-intake-like-a-sales-pipeline', title: 'Treating intake like a sales pipeline', kind: 'chapter', label: 'Chapter 1', partSlug: 'part-1-intake' },
  { slug: 'qualifying-the-work',                   title: 'Qualifying the work',                  kind: 'chapter', label: 'Chapter 2', partSlug: 'part-1-intake' },
  { slug: 'discovery',                             title: 'Discovery',                            kind: 'chapter', label: 'Chapter 3', partSlug: 'part-1-intake' },
  { slug: 'initiating-not-just-intaking',          title: 'Initiating, not just intaking',        kind: 'chapter', label: 'Chapter 4', partSlug: 'part-1-intake' },

  { slug: 'part-2-running-the-work',          title: 'Running the work',          kind: 'part', label: 'Part 2' },
  { slug: 'part-3-running-the-team',          title: 'Running the team',          kind: 'part', label: 'Part 3' },
  { slug: 'part-4-bringing-it-all-together',  title: 'Bringing it all together',  kind: 'part', label: 'Part 4' },
];

// --- helpers --------------------------------------------------------

export function getNode(slug: string): BookNode | undefined {
  return BOOK.find((n) => n.slug === slug);
}

export function getPrev(slug: string): BookNode | undefined {
  const i = BOOK.findIndex((n) => n.slug === slug);
  return i > 0 ? BOOK[i - 1] : undefined;
}

export function getNext(slug: string): BookNode | undefined {
  const i = BOOK.findIndex((n) => n.slug === slug);
  return i >= 0 && i < BOOK.length - 1 ? BOOK[i + 1] : undefined;
}

// Group the book into a structure the sidebar can render directly:
//   [ { kind: 'intro', node }, { kind: 'part', node, chapters: [...] }, ... ]
export interface TocGroup {
  node: BookNode;
  chapters: BookNode[];
}

export function tocGroups(): TocGroup[] {
  const groups: TocGroup[] = [];
  for (const node of BOOK) {
    if (node.kind === 'intro' || node.kind === 'part') {
      groups.push({ node, chapters: [] });
    } else if (node.kind === 'chapter') {
      const last = groups[groups.length - 1];
      if (last) last.chapters.push(node);
    }
  }
  return groups;
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
