export interface Provider {
  id?: string;
  REGION?: string;
  SUBURB?: string;
  ADDRESS?: string;
  'DOCTOR SURNAME'?: string;
  PRNO?: string;
  TEL?: string;
  FAX?: string;
  'DISPENSE/SCRIPT'?: string;
  PROVINCE?: string;
  profession?: string;
  profile_picture?: string;
}

export interface FormData extends Provider {
  id?: string;
}

export interface ProviderTableRow {
  'DOCTOR SURNAME'?: string;
  SUBURB?: string;
  PROVINCE?: string;
  TEL?: string;
  PRNO?: string;
}
