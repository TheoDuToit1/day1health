import type { NavigationItem } from '../domain/navigation';

export const navigation = [
	{ routeKey: 'home', label: 'Home', href: '/', order: 0, public: true, primary: true },
	{ routeKey: 'about', label: 'About Us', href: '/about', order: 10, public: true, primary: true },
	{ routeKey: 'plans', label: 'Our Packages', href: '/plans', order: 20, public: true, primary: true },
	{ routeKey: 'cover', label: 'What We Cover', href: '/cover', order: 30, public: true, primary: true },
	{
		routeKey: 'questions',
		label: 'Ask Us a Question',
		href: '/questions',
		order: 40,
		public: true,
		primary: true,
	},
	{ routeKey: 'contact', label: 'Find Us', href: '/contact', order: 50, public: true, primary: true },
	{ routeKey: 'reviews', label: 'Our Reviews', href: '/reviews', order: 60, public: true, primary: true },
	{
		routeKey: 'legal',
		label: 'Legalities & Other Stuff',
		href: '/legal',
		order: 70,
		public: true,
		primary: true,
	},
	{ routeKey: 'directory', label: 'Directory', href: '/directory', order: 80, public: true, primary: false },
	{ routeKey: 'quote', label: 'Quote', href: '/quote', order: 90, public: true, primary: false },
	{ routeKey: 'apply', label: 'Application', href: '/apply', order: 100, public: true, primary: false },
	{ routeKey: 'signIn', label: 'Sign In', href: '/sign-in', order: 110, public: true, primary: false },
	{
		routeKey: 'kzn',
		label: 'KZN',
		href: '/kzn',
		order: 120,
		public: true,
		primary: false,
		regions: ['kzn'],
	},
] as const satisfies readonly NavigationItem[];

export const routes = Object.fromEntries(navigation.map((item) => [item.routeKey, item])) as {
	[K in (typeof navigation)[number]['routeKey']]: Extract<(typeof navigation)[number], { routeKey: K }>;
};
