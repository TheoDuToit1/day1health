import type { Audience } from './audience';
import type { Attribution } from './attribution';
import type { RouteKey } from './navigation';
import type { PlanId } from './plans';
import type { Region } from './region';

export type ContactIntent =
	| 'plan-enquiry'
	| 'quote'
	| 'application'
	| 'employer-enquiry'
	| 'general-question';

export interface WebsiteLeadIntent {
	audience: Audience;
	region: Region;
	sourcePage: RouteKey;
	selectedPlanId?: PlanId;
	contactIntent: ContactIntent;
	attribution: Attribution;
}
