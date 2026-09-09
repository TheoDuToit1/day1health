export interface RegulatoryStatement {
	id: 'fsp' | 'cms-reference' | 'underwriter' | 'product-classification';
	text: string;
}

export interface ContactReferences {
	phone: string | null;
	email: string | null;
	physicalAddress: string | null;
}

export interface SocialLink {
	platform: string;
	url: string;
}

export interface LegalDocumentReference {
	id: string;
	title: string;
	url: string;
}

export interface CompanyInformation {
	companyName: string;
	brandName: string;
	canonicalDomain: string | null;
	fspNumber: string;
	cmsReference: string;
	productClassification: string;
	underwriter: string;
	contacts: ContactReferences;
	socialLinks: readonly SocialLink[];
	legalDocuments: readonly LegalDocumentReference[];
	regulatoryStatements: readonly RegulatoryStatement[];
}
