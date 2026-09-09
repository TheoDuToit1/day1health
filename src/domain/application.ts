import type { Audience } from './audience';
import type { Attribution } from './attribution';
import type { RouteKey } from './navigation';
import type { PlanId } from './plans';
import type { Region } from './region';

export interface QuoteSelection {
	quoteReference?: string;
	selectedPlanId: PlanId;
	audience: Audience;
	region: Region;
	attribution?: Attribution;
}

export interface ApplicationHandoff {
	version: 1;
	selection: QuoteSelection;
	sourcePage: RouteKey;
}
