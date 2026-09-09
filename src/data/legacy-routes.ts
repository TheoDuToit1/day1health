export type LegacyRouteStatus = 'preserve' | 'redirect' | 'pending';

export interface LegacyRouteDecision {
	legacyPath: string;
	status: LegacyRouteStatus;
	destination?: string;
	note: string;
}

export const legacyRouteMigrationMap = [
	{ legacyPath: '/home', status: 'redirect', destination: '/', note: 'Consolidate the homepage URL.' },
	{
		legacyPath: '/medical-directory',
		status: 'redirect',
		destination: '/directory',
		note: 'Preserve directory inbound links at the new hub.',
	},
	{
		legacyPath: '/medical-directory/:slug',
		status: 'pending',
		destination: '/directory/[slug]',
		note: 'Validate provider slug mapping before implementing redirects.',
	},
	{
		legacyPath: '/plans/day-to-day',
		status: 'preserve',
		destination: '/plans/day-to-day',
		note: 'Reserve the existing canonical family path for validated plan data.',
	},
	{
		legacyPath: '/plans/hospital',
		status: 'preserve',
		destination: '/plans/hospital',
		note: 'Reserve the existing canonical family path for validated plan data.',
	},
	{
		legacyPath: '/plans/comprehensive',
		status: 'preserve',
		destination: '/plans/comprehensive',
		note: 'Reserve the existing canonical family path for validated plan data.',
	},
	{
		legacyPath: '/plans/senior-plan',
		status: 'pending',
		note: 'Approve the future Senior canonical slug before redirecting.',
	},
	{
		legacyPath: '/procedures',
		status: 'pending',
		note: 'Confirm whether this content belongs under cover or a dedicated route.',
	},
	{
		legacyPath: '/regulatory-information',
		status: 'redirect',
		destination: '/legal',
		note: 'Consolidate known regulatory information under the legal route.',
	},
	{
		legacyPath: '/plans/junior-executive',
		status: 'pending',
		note: 'The legacy route does not exist; validate the product relationship before creating it.',
	},
] as const satisfies readonly LegacyRouteDecision[];
