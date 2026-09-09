import type { CompanyInformation } from '../domain/company';

export const company = {
	companyName: 'Day1 Health',
	brandName: 'Day1 Health',
	canonicalDomain: 'https://www.day1health.co.za',
	fspNumber: '11319',
	cmsReference: 'DM1074',
	productClassification: 'Medical Insurance Product — not Medical Aid',
	underwriter: 'African Unity Life Ltd',
	contacts: {
		phone: null,
		email: null,
		physicalAddress: null,
	},
	socialLinks: [],
	legalDocuments: [],
	regulatoryStatements: [
		{ id: 'fsp', text: 'FSP 11319' },
		{ id: 'cms-reference', text: 'CMS Ref DM1074' },
		{ id: 'underwriter', text: 'Underwritten by African Unity Life Ltd' },
		{ id: 'product-classification', text: 'Medical Insurance Product — not Medical Aid' },
	],
} as const satisfies CompanyInformation;
