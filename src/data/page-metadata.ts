import type { RouteKey } from '../domain/navigation';

export type PageStatus = 'published-foundation' | 'structural' | 'conditional';
export type IndexingDecision = 'index' | 'noindex' | 'conditional';

export interface PageMetadata {
	title: string;
	description: string;
	heading: string;
	status: PageStatus;
	indexing: IndexingDecision;
}

export const pageMetadata = {
	home: {
		title: 'Day1 Health',
		description: 'Day1 Health medical insurance product information for individuals and employers.',
		heading: 'Day1 Health',
		status: 'published-foundation',
		indexing: 'index',
	},
	about: {
		title: 'About Day1 Health',
		description: 'Company, underwriter and regulatory information for Day1 Health.',
		heading: 'About Day1 Health',
		status: 'structural',
		indexing: 'index',
	},
	plans: {
		title: 'Day1 Health Packages',
		description: 'An overview of the approved Day1 Health plan families.',
		heading: 'Our Packages',
		status: 'published-foundation',
		indexing: 'index',
	},
	cover: {
		title: 'What Day1 Health Covers',
		description: 'Information about cover, limits, waiting periods, exclusions and medical insurance.',
		heading: 'What We Cover',
		status: 'structural',
		indexing: 'index',
	},
	questions: {
		title: 'Day1 Health Questions',
		description: 'Questions about claims, limits, billing, eligibility and human assistance.',
		heading: 'Ask Us a Question',
		status: 'conditional',
		indexing: 'conditional',
	},
	contact: {
		title: 'Contact Day1 Health',
		description: 'Contact, location and human-assistance information for Day1 Health.',
		heading: 'Find Us',
		status: 'conditional',
		indexing: 'conditional',
	},
	reviews: {
		title: 'Day1 Health Reviews',
		description: 'A future home for approved Day1 Health reviews and testimonials.',
		heading: 'Our Reviews',
		status: 'conditional',
		indexing: 'conditional',
	},
	legal: {
		title: 'Day1 Health Legal and Regulatory Information',
		description: 'Known regulatory, product-classification and underwriter information for Day1 Health.',
		heading: 'Legalities & Other Stuff',
		status: 'published-foundation',
		indexing: 'index',
	},
	directory: {
		title: 'Day1 Health Provider Directory',
		description: 'The future directory for approved Day1 Health provider information.',
		heading: 'Provider Directory',
		status: 'conditional',
		indexing: 'conditional',
	},
	quote: {
		title: 'Day1 Health Quote',
		description: 'The future entry point for a Day1 Health quote.',
		heading: 'Quote',
		status: 'structural',
		indexing: 'noindex',
	},
	apply: {
		title: 'Day1 Health Application',
		description: 'The future entry point for a Day1 Health application.',
		heading: 'Application',
		status: 'structural',
		indexing: 'noindex',
	},
	signIn: {
		title: 'Sign In to Day1 Health',
		description: 'The future access gateway for Day1 Health members and employers.',
		heading: 'Sign In',
		status: 'structural',
		indexing: 'noindex',
	},
	kzn: {
		title: 'Day1 Health KZN',
		description: 'The future regional information route for Day1 Health in KwaZulu-Natal.',
		heading: 'Day1 Health KZN',
		status: 'conditional',
		indexing: 'conditional',
	},
} as const satisfies Record<RouteKey, PageMetadata>;

export function robotsFor(decision: IndexingDecision): string {
	return decision === 'index' ? 'index, follow' : 'noindex, follow';
}
