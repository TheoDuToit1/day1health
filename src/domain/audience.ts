export const audiences = ['individual', 'employer'] as const;

export type Audience = (typeof audiences)[number];

export const audienceLabels = {
	individual: 'I’m Covering Myself',
	employer: 'I’m an Employer',
} as const satisfies Record<Audience, string>;

export interface AudienceVariant<T extends object> {
	shared: T;
	overrides?: Partial<Record<Audience, Partial<T>>>;
}
