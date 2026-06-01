import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    principle: z.number().optional(),       // which of the 10 principles this maps to
    category: z.string().default('Practice'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
