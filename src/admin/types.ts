export interface Provider {
  id: string;
  full_name: string;
  slug: string;
  profile_image_url?: string;
  profession: 'GP' | 'Dentist';
  network_type?: string;
  dispensing_status?: 'Dispensing' | 'Non-Dispensing';
  practice_name?: string;
  practice_code?: string;
  description?: string;
  phone: string;
  email?: string;
  address_line_1?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FormData extends Omit<Provider, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export interface ProviderTableRow {
  id: string;
  full_name: string;
  profession: string;
  city: string;
  province: string;
  phone: string;
  is_active: boolean;
  verified: boolean;
}
