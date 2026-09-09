export interface DynamicRouteStrategy {
	pattern: string;
	status: 'pending-data' | 'future-if-justified';
	indexing: 'conditional';
	note: string;
}

export const dynamicRouteStrategy = {
	planDetail: {
		pattern: '/plans/[slug]',
		status: 'pending-data',
		indexing: 'conditional',
		note: 'Generate only from validated plan-domain records after the CMS adapter exists.',
	},
	providerDetail: {
		pattern: '/directory/[slug]',
		status: 'pending-data',
		indexing: 'conditional',
		note: 'Generate only from migrated provider records with validated IDs and slugs.',
	},
	kznChild: {
		pattern: '/kzn/[slug]',
		status: 'future-if-justified',
		indexing: 'conditional',
		note: 'Create only for approved KZN-specific content; do not mirror the national route tree.',
	},
} as const satisfies Record<string, DynamicRouteStrategy>;
