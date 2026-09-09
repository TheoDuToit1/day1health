import type { Audience } from './audience';
import type { Region } from './region';

export const routeKeys = [
	'home',
	'about',
	'plans',
	'cover',
	'questions',
	'contact',
	'reviews',
	'legal',
	'directory',
	'quote',
	'apply',
	'signIn',
	'kzn',
] as const;

export type RouteKey = (typeof routeKeys)[number];

export type RouteHref =
	| '/'
	| '/about'
	| '/plans'
	| '/cover'
	| '/questions'
	| '/contact'
	| '/reviews'
	| '/legal'
	| '/directory'
	| '/quote'
	| '/apply'
	| '/sign-in'
	| '/kzn';

export interface NavigationItem {
	routeKey: RouteKey;
	label: string;
	href: RouteHref;
	order: number;
	public: boolean;
	primary: boolean;
	audiences?: readonly Audience[];
	regions?: readonly Region[];
}
