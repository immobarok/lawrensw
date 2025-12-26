export interface tripGalleryItem {
  id: number;
  trip_id: number;
  image: string;
}

export interface shipGalleryItem {
  id: number;
  ship_id: number;
  image: string;
}

export interface tripItineraries {
  id: number;
  trip_id: number;
  day: string;
  label: string;
  body: string;
}

export interface ShipSpec {
  id: number;
  ship_id: number;
  name: string;
  value: string;
}

export interface CabinPrice {
  id: number;
  cabin_id: number;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Cabin {
  id: number;
  trip_id: number;
  name: string;
  description: string;
  amount: string;
  currency: string;
  deck_level: string;
  image: string;
  inclusions: string;
  exclusions: string;
  availability: string;
  prices: CabinPrice[];
}

export interface Ship {
  id: number;
  trip_id: number;
  ship_name:string|undefined;
  name: string;
  description: string;
  feature_image: string;
  cabin_layout_image: string;
  last_known_long: string;
  last_known_lat: string;
  last_updated: string;
  specs: ShipSpec[];
  gallery: shipGalleryItem[];
}

export interface Trip {
  trip_type: string; // "trip_two", "trip_one", etc.
  id: number;
  region: string;
  destination: string;
  destinations: {
    id: number;
    trip_id: number;
    name: string;
  }[];
  includes: string;
  gallery: tripGalleryItem[];
  shipGallery: shipGalleryItem[];
  itineraries: tripItineraries[];
  participants: string | number;
  url: string;
  external_id: number;
  code: string;
  combination: number;
  only_in_combination: number;
  translated: number;
  departure_date: string;
  return_date: string;
  name: string;
  summary: string;
  embark: string;
  disembark: string;
  finishing_city: string;
  starting_point: string;
  finishing_point: string;
  dr_usp: string;
  trip_included: string;
  trip_excluded: string;
  days: number;
  nights: number;
  ship_id: number;
  highlights: string;
  duration: number;
  ship_name: string;
  ship: Ship;
  map: string;
  photos: { id: number; trips_two_id: number; url: string }[];
  feature_image: string;
  cabins_twos: {
    id: number; 
    trips_two_id: number;
    title: string;
    cabin_id: string;
    price: string;
    old_price: string | null;
    discount: string | null;
    cab_units: number;
    ber_units: number;
    male_units: number;
    female_units: number;
  }[];
  cabins: Cabin[]; // Added cabins property to match ExpeditionData
  extras: {
    id: number;
    trips_two_id: number;
    name: string;
    availability: number;
    price: string;
  }[];
  destinations_twos: { id: number; trips_two_id: number; name: string }[];
  itineraries_twos: {
    id: number;
    trips_two_id: number;
    day: string;
    title: string;
    port: string | null;
    location: string;
    summary: string;
  }[];
}

export interface TripsResponse {
  status: boolean;
  message: string;
  data: {
    trips?: Trip[];
    trip?: Trip;
  };
  code: number;
}

export interface PaginatedTripsResponse {
  status: boolean;
  message: string;
  data: {
    trips: {
      current_page: number;
      data: Trip[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: {
        url: string | null;
        label: string;
        active: boolean;
      }[];
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  };
  code: number;
}
