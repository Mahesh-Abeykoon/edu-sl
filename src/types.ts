export type Language = 'en' | 'si' | 'ta';

export type InstitutionType =
  | 'state'
  | 'private'
  | 'defense'
  | 'semi-government'
  | 'postgraduate'
  | 'vocational';

export interface LocationInfo {
  district: string;
  city: string;
  postal_code: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Faculty {
  id: string;
  name: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  website?: string;
}

export interface University {
  id: string;
  code: string;
  name: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  abbreviation: string;
  type: InstitutionType;
  ugc_recognized: boolean;
  established_year: number;
  website: string;
  contact: {
    phone?: string;
    email?: string;
  };
  location: LocationInfo;
  faculties: Faculty[];
}

export interface QueryOptions {
  lang?: Language;
}

export interface SearchOptions extends QueryOptions {
  limit?: number;
  type?: InstitutionType;
  district?: string;
  ugc_only?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}
