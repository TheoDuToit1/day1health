export const brand = {
	blue: { cssVariable: '--day1-blue', value: '#19568C' },
	green: { cssVariable: '--day1-green', value: '#16A34A' },
	white: { cssVariable: '--day1-white', value: '#FFFFFF' },
	ink: { cssVariable: '--day1-ink', value: '#111827' },
	muted: { cssVariable: '--day1-muted', value: '#64748B' },
	surface: { cssVariable: '--day1-surface', value: '#F5F7F9' },
	border: { cssVariable: '--day1-border', value: '#E2E8F0' },
} as const;

export type BrandToken = keyof typeof brand;
