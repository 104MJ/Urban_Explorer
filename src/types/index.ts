export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ParisLocation {
  address_street: string;
  address_zipCode: string;
  address_name: string;
  address_lat_lon: string;
  location_type: string;
  address_city: string;
}

export interface UrbanEvent {
  id: string;
  title: string;
  lead_text: string;
  description: string;
  date_start: string;
  date_end: string;
  occurrences: string;
  date_description: string;
  cover_url: string;
  cover_alt: string;
  cover_credit: string;
  locations: ParisLocation[];
  address_name: string;
  address_street: string;
  address_zipcode: string;
  address_city: string;
  lat_lon: {
    lon: number;
    lat: number;
  };
  contact_url?: string;
  contact_phone?: string;
  contact_mail?: string;
  price_type: "gratuit" | "payant" | string;
  access_type: string;
  audience: string;
  qfap_tags: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  type: "museum" | "monument" | "park" | "other";
  coordinates: Coordinates;
  address: string;
  description?: string;
  image_url?: string;
  events?: UrbanEvent[];
}

export interface UserVisit {
  id: string;
  poiId: string;
  visitDate: string;
  photoUri: string;
  comment?: string;
}

export type Category =
  | "BD"
  | "Conférence"
  | "Histoire"
  | "Exposition"
  | "Musique"
  | "Sport";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
