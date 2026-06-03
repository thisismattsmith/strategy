import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    note_number: z.number().int().positive(),  // required — surfaces in post header, blog index, carousel, OG
    linkedin_url: z.string().url().optional(),  // optional — if set, post footer shows "Comment on LinkedIn" link
    principle: z.number().optional(),          // optional — links post to a principle on the homepage
    category: z.string().default('Practice'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
