export type SearchFlightOffersBody = {
  origin: string;
  destination: string;
  departure: string;
  return?: string;
  // departureToken?: string;
};

export type GetFlightDetailBody = {
  token: string;
  itineraryId: string;
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
  data: {
    itinerary: {
      id: string;
      legs: {
        id: string;
        origin: {
          id: string;
          name: string;
          displayCode: string;
          city: string;
        };
        destination: {
          id: string;
          name: string;
          displayCode: string;
          city: string;
        };
        segments: {
          id: string;
          origin: {
            id: string;
            name: string;
            displayCode: string;
            city: string;
          };
          destination: {
            id: string;
            name: string;
            displayCode: string;
            city: string;
          };
          duration: number;
          dayChange: number;
          flightNumber: string;
          departure: string;
          arrival: string;
          marketingCarrier: {
            id: string;
            name: string;
            displayCode: string;
            displayCodeType: string;
            logo: string;
            altId: string;
            brandColor?: string;
          };
          operatingCarrier: {
            id: string;
            name: string;
            displayCode: string;
            displayCodeType: string;
            logo: string;
            altId: string;
            brandColor?: string;
          };
          goodToKnowItems: {
            icon: string;
            body: {
              value: string;
              isHighlighted: boolean;
              position: number;
            };
            badge?: {
              value: string;
              isHighlighted: boolean;
              position: number;
            };
            date?: {
              value: string;
              isHighlighted: boolean;
              position: number;
            };
          }[];
        }[];
        layovers: {
          segmentId: string;
          origin: {
            id: string;
            name: string;
            displayCode: string;
            city: string;
          };
          destination: {
            id: string;
            name: string;
            displayCode: string;
            city: string;
          };
          duration: number;
        }[];
        duration: number;
        stopCount: number;
        departure: string;
        arrival: string;
        dayChange: number;
      }[];
      pricingOptions: {
        agents: {
          id: string;
          name: string;
          isCarrier: boolean;
          bookingProposition: string;
          url: string;
          price: number;
          rating: {
            value: number;
            count: number;
          };
          updateStatus: string;
          segments: {
            id: string;
            origin: {
              id: string;
              name: string;
              displayCode: string;
              city: string;
            };
            destination: {
              id: string;
              name: string;
              displayCode: string;
              city: string;
            };
            duration: number;
            dayChange: number;
            flightNumber: string;
            departure: string;
            arrival: string;
            marketingCarrier: {
              id: string;
              name: string;
              displayCode: string;
              displayCodeType: string;
              logo: string;
              altId: string;
              brandColor?: string;
            };
            operatingCarrier: {
              id: string;
              name: string;
              displayCode: string;
              displayCodeType: string;
              logo: string;
              altId: string;
              brandColor?: string;
            };
            goodToKnowItems: {
              icon: string;
              body: {
                value: string;
                isHighlighted: boolean;
                position: number;
              };
              badge?: {
                value: string;
                isHighlighted: boolean;
                position: number;
              };
              date?: {
                value: string;
                isHighlighted: boolean;
                position: number;
              };
            }[];
          }[];
          transferProtection: string;
          isDirectDBookUrl: boolean;
          quoteAge: number;
        }[];
        totalPrice: number;
        fare: {
          leg_details: any[];
        };
        id: string;
      }[];
      isTransferRequired: boolean;
      destinationImage: string;
      operatingCarrierSafetyAttributes: {
        carrierID: string;
        carrierName: string;
        faceMasksCompulsory: null | boolean;
        aircraftDeepCleanedDaily: null | boolean;
        attendantsWearPPE: null | boolean;
        cleaningPacksProvided: null | boolean;
        foodServiceChanges: null | boolean;
        safetyUrl: null | string;
      }[];
      flexibleTicketPolicies: any[];
      transferProtectionDetails: {
        title: string;
        body: string;
        url: string;
        urlTitle: string;
      };
    };
    pollingCompleted: boolean;
    bookingSessionId: string;
  };
  status: boolean;
  message: string;
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

export type ISearchFlightResponse = {
    data: {
    context: {
      status: string;
      sessionId: string;
      totalResults: number;
    };
    itineraries: Array<{
      id: string;
      price: {
        raw: number;
        formatted: string;
        pricingOptionId: string;
      };
      legs: {
        id: string;
        origin: {
          id: string;
          name: string;
          displayCode: string;
          city: string;
          country: string;
          isHighlighted: boolean;
        };
        destination: {
          id: string;
          name: string;
          displayCode: string;
          city: string;
          country: string;
          isHighlighted: boolean;
        };
        durationInMinutes: number;
        stopCount: number;
        isSmallestStops: boolean;
        departure: string;
        arrival: string;
        timeDeltaInDays: number;
        carriers: {
          marketing: {
            id: number;
            logoUrl: string;
            name: string;
          }[];
          operationType: string;
        };
        segments: {
          id: string;
          origin: {
            flightPlaceId: string;
            displayCode: string;
            parent?: {
              flightPlaceId: string;
              displayCode: string;
              name: string;
              type: string;
            };
            name: string;
            type: string;
          };
          destination: {
            flightPlaceId: string;
            displayCode: string;
            parent?: {
              flightPlaceId: string;
              displayCode: string;
              name: string;
              type: string;
            };
            name: string;
            type: string;
          };
          departure: string;
          arrival: string;
          durationInMinutes: number;
          flightNumber: string;
          marketingCarrier: {
            id: number;
            name: string;
            alternateId: string;
            allianceId: number;
            displayCode: string;
          };
          operatingCarrier: {
            id: number;
            name: string;
            alternateId: string;
            allianceId: number;
            displayCode: string;
          };
        }[];
      }[];
      isSelfTransfer: boolean;
      isProtectedSelfTransfer: boolean;
      farePolicy: {
        isChangeAllowed: boolean;
        isPartiallyChangeable: boolean;
        isCancellationAllowed: boolean;
        isPartiallyRefundable: boolean;
      };
      fareAttributes: Record<string, any>;
      tags: string[];
      isMashUp: boolean;
      hasFlexibleOptions: boolean;
      score: number;
    }>;
    messages: any[];
    filterStats: {
      duration: {
        min: number;
        max: number;
        multiCityMin: number;
        multiCityMax: number;
      };
      airports: {
        city: string;
        airports: {
          id: string;
          name: string;
        }[];
      }[];
      carriers: {
        id: number;
        logoUrl: string;
        name: string;
      }[];
      stopPrices: {
        direct: {
          isPresent: boolean;
        };
        one: {
          isPresent: boolean;
          formattedPrice?: string;
        };
        twoOrMore: {
          isPresent: boolean;
          formattedPrice?: string;
        };
      };
    };
    flightsSessionId: string;
    destinationImageUrl: string;
    token: string;
  };
  status: boolean;
  message: string;
}

export type SearchMileageProgramsBody = {
  origin: string;
  destination: string;
  departure: string;
}

export type SearchMileageProgramsResponse = Array<{
  id: string;
  originIata: string;
  destiantionIata: string;
  source: string;
  currency: string;
  economy: {
    price: number;
    taxes: number;
  };
  premium: {
    price: number;
    taxes: number;
  };
  business: {
    price: number;
    taxes: number;
  };
  first: {
    price: number;
    taxes: number;
  };
}>;

export default ISearchFlightResponse;
