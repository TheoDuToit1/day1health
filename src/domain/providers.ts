export interface ProviderSpeciality {
	id: string;
	name: string;
}

export interface ProviderContact {
	type: 'phone' | 'email' | 'website';
	value: string;
	label?: string;
}

export interface ProviderLocation {
	id: string;
	province: string;
	city?: string;
	suburb?: string;
	addressLines?: readonly string[];
	postalCode?: string;
	coordinates?: {
		latitude: number;
		longitude: number;
	};
}

export interface Provider {
	id: string;
	prno: string | null;
	slug: string;
	name: string;
	specialities: readonly ProviderSpeciality[];
	locations: readonly ProviderLocation[];
	contacts: readonly ProviderContact[];
	profileImage?: {
		url: string;
		alt?: string;
	};
}
