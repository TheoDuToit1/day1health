import type { Audience } from './audience';
import type { Region } from './region';

export interface Attribution {
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_term?: string;
	utm_content?: string;
	landing_page: string;
	referrer?: string;
	audience: Audience;
	region: Region;
	selected_plan?: string;
}
