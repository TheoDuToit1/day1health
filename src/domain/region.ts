export const regions = ['national', 'kzn'] as const;

export type Region = (typeof regions)[number];

export interface RegionalVariant<T extends object> {
	shared: T;
	overrides?: Partial<Record<Region, Partial<T>>>;
}
