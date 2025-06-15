export type SearchFlightOffersBody = {
  origin: string;
  destination: string;
  departure: string;
  return?: string;
  departureToken?: string;
};

export type GetFlightDetailBody = {
  origin: string;
  destination: string;
  departure: string;
  return?: string;
  bookingToken: string;
};

export type SearchFlightByMileageResponse = {
  data: {
    ID: string;
    RouteID: string;
    Route: {
      ID: string;
      OriginAirport: string;
      OriginRegion: string;
      DestinationAirport: string;
      DestinationRegion: string;
      NumDaysOut: number;
      Distance: number;
      Source: string;
    },
    Date: string;
    ParsedDate: string;
    YAvailable: boolean;
    WAvailable: boolean;
    JAvailable: boolean;
    FAvailable: boolean;
    YAvailableRaw: boolean;
    WAvailableRaw: boolean;
    JAvailableRaw: boolean;
    FAvailableRaw: boolean;
    YMileageCost: number;
    WMileageCost: number;
    JMileageCost: number;
    FMileageCost: number;
    YMileageCostRaw: number;
    WMileageCostRaw: number;
    JMileageCostRaw: number;
    FMileageCostRaw: number;
    YDirectMileageCost: number;
    WDirectMileageCost: number;
    JDirectMileageCost: number;
    FDirectMileageCost: number;
    YDirectMileageCostRaw: number;
    WDirectMileageCostRaw: number;
    JDirectMileageCostRaw: number;
    FDirectMileageCostRaw: number;
    TaxesCurrency: string;
    YTotalTaxes: number;
    WTotalTaxes: number;
    JTotalTaxes: number;
    FTotalTaxes: number;
    YTotalTaxesRaw: number;
    WTotalTaxesRaw: number;
    JTotalTaxesRaw: number;
    FTotalTaxesRaw: number;
    YDirectTotalTaxes: number;
    WDirectTotalTaxes: number;
    JDirectTotalTaxes: number;
    FDirectTotalTaxes: number;
    YDirectTotalTaxesRaw: number;
    WDirectTotalTaxesRaw: number;
    JDirectTotalTaxesRaw: number;
    FDirectTotalTaxesRaw: number;
    YRemainingSeats: number;
    WRemainingSeats: number;
    JRemainingSeats: number;
    FRemainingSeats: number;
    YRemainingSeatsRaw: number;
    WRemainingSeatsRaw: number;
    JRemainingSeatsRaw: number;
    FRemainingSeatsRaw: number;
    YDirectRemainingSeats: number;
    WDirectRemainingSeats: number;
    JDirectRemainingSeats: number;
    FDirectRemainingSeats: number;
    YDirectRemainingSeatsRaw: number;
    WDirectRemainingSeatsRaw: number;
    JDirectRemainingSeatsRaw: number;
    FDirectRemainingSeatsRaw: number;
    YAirlines: number;
    WAirlines: string;
    JAirlines: string;
    FAirlines: string;
    YAirlinesRaw: number;
    WAirlinesRaw: string;
    JAirlinesRaw: string;
    FAirlinesRaw: string;
    YDirectAirlines: number;
    WDirectAirlines: string;
    JDirectAirlines: string;
    FDirectAirlines: string;
    YDirectAirlinesRaw: number;
    WDirectAirlinesRaw: string;
    JDirectAirlinesRaw: string;
    FDirectAirlinesRaw: string;
    YDirect: boolean;
    WDirect: boolean;
    JDirect: boolean;
    FDirect: boolean;
    YDirectRaw: boolean;
    WDirectRaw: boolean;
    JDirectRaw: boolean;
    FDirectRaw: boolean;
    Source: string;
    CreatedAt: string;
    UpdatedAt: string;
    AvailabilityTrips: string | number | null;
  }[];
}

export type GetTripByMileageResponse = {
  data: {
    ID: string;
    RouteID: string;
    AvailabilityID: string;
    AvailabilitySegments: {
      ID: string;
      RouteID: string;
      AvailabilityID: string;
      AvailabilityTripID: string;
      FlightNumber: string;
      Distance: number;
      FareClass: string;
      AircraftName: string;
      AircraftCode: string;
      OriginAirport: string;
      DestinationAirport: string;
      DepartsAt: string;
      ArrivesAt: string;
      CreatedAt: string;
      UpdatedAt: string;
      Source: string;
      Cabin: string;
      Order: number;
    }[];
    TotalDuration: number;
    Stops: number;
    Carriers: string;
    RemainingSeats: number;
    MileageCost: number;
    TotalTaxes: number;
    TaxesCurrency: string;
    TaxesCurrencySymbol: string;
    TotalSegmentDistance: number;
    OriginAirport: string;
    DestinationAirport: string;
    Aircraft: string[];
    FlightNumbers: string;
    DepartsAt: string;
    Cabin: string;
    ArrivesAt: string;
    CreatedAt: string;
    UpdatedAt: string;
    Source: string;
  }[];
  origin_coordinates: {
    Lat: number;
    Lon: number;
  };
  destination_coordinates: {
    Lat: number;
    Lon: number;
  },
  booking_links: {
    label: string;
    link: string;
    primary: boolean;
  }[]
  carriers: {
    G3: string;
  }
}

export type GetFlightDetailResponse = {
  selected_flights: {
    flights: Flight[];
    layovers: Layovers[];
    total_duration: number;
    carbon_emissions: {
      this_flight: number;
      typical_for_this_route: number;
      difference_percent: number;
    },
    price: number;
    type: string;
    airline_logo: string;
    extensions: string[];
    departure_token: string;
    booking_token: string;
  }[];
  baggage_prices: {
    together: string[];
    departing: string[];
    returning: string[];
  },
  booking_options: {
    separate_tickets: boolean;
    together: {
      book_with: string;
      airline_logos: string[];
      marketed_as: string[];
      price: number;
      local_prices: {
        currency: string;
        price: number;
      }
      option_title: string;
      extensions: string[];
      baggage_prices: string[];
      booking_request: {
        url: string;
        post_data: string;
      },
      booking_phone: string;
      estimated_phone_service_fee: number;
    },
  }[],
  price_insights: {
    lowest_price: number;
    price_level: string;
    typical_price_range: string[];
    price_history: string[];
  },
}

interface Flight {
  departure_airport: {
    name: string;
    id: string;
    time: string;
  },
  arrival_airport: {
    name: string;
    id: string;
    time: string;
  },
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  extensions: string[];
  ticket_also_sold_by: string[];
  legroom: string;
  overnight: boolean;
  often_delayed_by_over_30_min: boolean;
  plane_and_crew_by: string;
}

interface Layovers {
  duration: number;
  name: string;
  id: string;
  overnight: boolean;
}

export interface SearchFlightOffersResponse {
  best_flights: {
    flights: Flight[];
    layovers: Layovers[];
    total_duration: number;
    carbon_emissions: {
      this_flight: number;
      typical_for_this_route: number;
      difference_percent: number;
    },
    price: number;
    type: string;
    airline_logo: string;
    extensions: string[];
    departure_token: string;
    booking_token: string;
  }[];
  other_flights: {
    flights: Flight[];
    layovers: Layovers[];
    total_duration: number;
    carbon_emissions: {
      this_flight: number;
      typical_for_this_route: number;
      difference_percent: number;
    },
    price: number;
    type: string;
    airline_logo: string;
    extensions: string[];
    departure_token: string;
    booking_token: string;
  }[]
}

type ContinentOvreview = {
  origin: string;
  destination: string;
  date: string;
  price: number;
};

export type GetHomeOfferResponse = {
  general: Array<ContinentOvreview>;
  europe: Array<ContinentOvreview>;
  southAmerica: Array<ContinentOvreview>;
  middleAmerica: Array<ContinentOvreview>;
  northAmerica: Array<ContinentOvreview>;
  asia: Array<ContinentOvreview>;
  others: Array<ContinentOvreview>;
}
