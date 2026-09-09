import { audienceLabels } from '../domain/audience';
import type { HomepageContent } from '../domain/content';
import { company } from './company';

export const homepageContent = {
	shared: {
		hero: {
			source: 'approved',
			content: {
				shared: { title: company.brandName },
				overrides: {
					individual: { eyebrow: audienceLabels.individual },
					employer: { eyebrow: audienceLabels.employer },
				},
			},
		},
		trust: { source: 'approved', content: company.regulatoryStatements },
		planDiscovery: {
			source: 'database',
			note: 'Plan discovery content must be mapped from the future plan data source.',
		},
		coverIntroduction: {
			source: 'todo',
			note: 'Approved cover introduction copy is required.',
		},
		audienceMessaging: {
			source: 'todo',
			note: 'Approved individual and employer positioning is required.',
		},
		reviewsEntry: {
			source: 'todo',
			note: 'Approved review content and sourcing rules are required.',
		},
		contactQuoteCta: {
			source: 'todo',
			note: 'Approved contact and quote CTA copy is required.',
		},
	},
} as const satisfies HomepageContent;
