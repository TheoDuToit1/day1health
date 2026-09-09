import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { audiences } from './domain/audience';
import { routeKeys } from './domain/navigation';
import { regions } from './domain/region';

const applicability = {
	audiences: z.array(z.enum(audiences)).optional(),
	regions: z.array(z.enum(regions)).optional(),
};

const site = defineCollection({
	loader: glob({ base: './src/content/site', pattern: '**/*.{md,mdx,json,yaml,yml}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		status: z.enum(['approved', 'todo']),
		...applicability,
	}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx,json,yaml,yml}' }),
	schema: z.object({
		routeKey: z.enum(routeKeys),
		title: z.string(),
		description: z.string().optional(),
		eyebrow: z.string().optional(),
		status: z.enum(['approved', 'todo']),
		...applicability,
	}),
});

const legal = defineCollection({
	loader: glob({ base: './src/content/legal', pattern: '**/*.{md,mdx,json,yaml,yml}' }),
	schema: z.object({
		title: z.string(),
		documentType: z.string(),
		reference: z.string().optional(),
		effectiveDate: z.coerce.date().optional(),
		status: z.enum(['approved', 'todo']),
	}),
});

export const collections = { site, pages, legal };
