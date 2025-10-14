// Tipos para API de Hospedagem (integração Booking.com ou similar)

export type AccommodationType = 'HOTEL' | 'APARTMENT' | 'HOSTEL' | 'GUESTHOUSE' | 'RESORT';

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  city: string;
  country: string;
  address: string;
  rating: number; // 0-10
  reviewScore?: number;
  reviewCount?: number;
  price: {
    currency: string;
    amount: number;
    perNight: boolean;
  };
  images: string[];
  amenities: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  cancellationPolicy?: string;
  bookingUrl?: string;
}

export interface AccommodationSearchParams {
  city: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  type?: AccommodationType;
  minRating?: number;
}

export interface AccommodationSearchResponse {
  results: Accommodation[];
  metadata: {
    total: number;
    offset: number;
    limit: number;
  };
}

// Radar de Hospedagem
export interface AccommodationRadar {
  id: number;
  userId: number;
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
  maxPrice?: number;
  type?: AccommodationType;
  minRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccommodationRadarBody {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
  maxPrice?: number;
  type?: AccommodationType;
  minRating?: number;
}

export interface AccommodationRadarResult {
  _id: string;
  radarId: number;
  accommodationId: string;
  name: string;
  city: string;
  price: number;
  currency: string;
  rating: number;
  checkIn: string;
  checkOut: string;
  foundAt: string;
}

export interface ListAccommodationRadarResponse {
  records: AccommodationRadar[];
  metadata: {
    total: number;
    items: number;
    offset: number;
  };
}

export interface GetAccommodationRadarResultsResponse {
  results: AccommodationRadarResult[];
}
