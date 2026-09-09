import type { AudienceVariant } from './audience';
import type { RouteHref } from './navigation';
import type { RegionalVariant } from './region';
import type { RegulatoryStatement } from './company';

export interface CTA {
	label: string;
	href: RouteHref;
}

export interface SectionIntro {
	eyebrow?: string;
	title: string;
	description?: string;
}

export interface HeroContent extends SectionIntro {
	primaryCta?: CTA;
	secondaryCta?: CTA;
}

export type ContentSlot<T> =
	| { source: 'approved'; content: T }
	| { source: 'database'; note: string }
	| { source: 'todo'; note: string };

export interface HomepageSections {
	hero: ContentSlot<AudienceVariant<HeroContent>>;
	trust: ContentSlot<readonly RegulatoryStatement[]>;
	planDiscovery: ContentSlot<SectionIntro>;
	coverIntroduction: ContentSlot<SectionIntro>;
	audienceMessaging: ContentSlot<AudienceVariant<SectionIntro>>;
	reviewsEntry: ContentSlot<SectionIntro>;
	contactQuoteCta: ContentSlot<readonly CTA[]>;
}

export type HomepageContent = RegionalVariant<HomepageSections>;
