import type { PlanFamily, PlanTier, PlanVariant } from '../domain/plans';

export const planFamilies = [
	{ id: 'day-to-day', name: 'Day-to-Day' },
	{ id: 'hospital', name: 'Hospital' },
	{ id: 'comprehensive', name: 'Comprehensive' },
	{ id: 'senior', name: 'Senior' },
] as const satisfies readonly PlanFamily[];

export const planTiers = [
	{ id: 'value-plus', name: 'Value Plus', order: 10 },
	{ id: 'platinum', name: 'Platinum', order: 20 },
	{ id: 'executive', name: 'Executive', order: 30 },
] as const satisfies readonly PlanTier[];

export const knownPlanVariants = [
	{ id: 'day-to-day', name: 'Day-to-Day', familyId: 'day-to-day', validation: 'known' },
	{ id: 'hospital-value-plus', name: 'Value Plus', familyId: 'hospital', tierId: 'value-plus', validation: 'known' },
	{ id: 'hospital-platinum', name: 'Platinum', familyId: 'hospital', tierId: 'platinum', validation: 'known' },
	{ id: 'hospital-executive', name: 'Executive', familyId: 'hospital', tierId: 'executive', validation: 'known' },
	{
		id: 'comprehensive-value-plus',
		name: 'Value Plus',
		familyId: 'comprehensive',
		tierId: 'value-plus',
		validation: 'known',
	},
	{
		id: 'comprehensive-platinum',
		name: 'Platinum',
		familyId: 'comprehensive',
		tierId: 'platinum',
		validation: 'known',
	},
	{
		id: 'comprehensive-executive',
		name: 'Executive',
		familyId: 'comprehensive',
		tierId: 'executive',
		validation: 'known',
	},
	{ id: 'senior-day-to-day', name: 'Day-to-Day', familyId: 'senior', validation: 'known' },
	{ id: 'senior-hospital', name: 'Hospital', familyId: 'senior', validation: 'known' },
	{ id: 'senior-comprehensive', name: 'Comprehensive', familyId: 'senior', validation: 'known' },
] as const satisfies readonly PlanVariant[];

export const unvalidatedPlanReferences = [
	{
		name: 'Junior Executive 2026',
		evidence: 'Legacy repository PDF',
		todo: 'Validate its product family and relationship before modelling it as a plan variant.',
	},
] as const;
