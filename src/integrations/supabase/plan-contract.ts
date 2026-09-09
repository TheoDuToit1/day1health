import type { Plan } from '../../domain/plans';

export const planCmsTables = {
	pages: 'cms_plan_pages',
	benefits: 'cms_plan_benefits',
	highlights: 'cms_plan_cover_highlights',
	prices: 'cms_plan_price_rows',
	assets: 'cms_plan_assets',
} as const;

type UnmappedCmsRow = Readonly<Record<string, unknown>>;

export interface PlanCmsDataset {
	page: UnmappedCmsRow;
	benefits: readonly UnmappedCmsRow[];
	highlights: readonly UnmappedCmsRow[];
	prices: readonly UnmappedCmsRow[];
	assets: readonly UnmappedCmsRow[];
}

export interface PlanCmsAdapter {
	toDomain(source: PlanCmsDataset): Plan;
}
