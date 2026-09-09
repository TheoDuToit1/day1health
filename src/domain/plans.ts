export type PlanId = string;

export interface PlanFamily {
	id: 'day-to-day' | 'hospital' | 'comprehensive' | 'senior';
	name: string;
}

export interface PlanTier {
	id: 'value-plus' | 'platinum' | 'executive';
	name: string;
	order: number;
}

export interface PlanVariant {
	id: string;
	name: string;
	familyId: PlanFamily['id'];
	tierId?: PlanTier['id'];
	validation: 'known' | 'requires-validation';
}

export interface PlanPrice {
	id: string;
	amountMinor: number;
	currency: string;
	billingPeriod: 'monthly' | 'once' | 'unknown';
	label?: string;
	effectiveFrom?: string;
	effectiveTo?: string;
}

export interface PlanBenefit {
	id: string;
	title: string;
	description?: string;
	category?: string;
	limit?: string;
	order: number;
}

export interface PlanHighlight {
	id: string;
	title: string;
	description?: string;
	order: number;
}

export interface PlanAsset {
	id: string;
	type: 'image' | 'document' | 'icon';
	url: string;
	title?: string;
	alt?: string;
}

export interface Plan {
	id: PlanId;
	slug: string;
	name: string;
	family: PlanFamily;
	tier?: PlanTier;
	variant?: PlanVariant;
	summary?: string;
	prices: readonly PlanPrice[];
	benefits: readonly PlanBenefit[];
	highlights: readonly PlanHighlight[];
	assets: readonly PlanAsset[];
}
