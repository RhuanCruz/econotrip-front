export interface Location {
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
    id: string;
  };
  navigation: {
    entityId: string;
    entityType: string;
    localizedName: string;
    relevantFlightParams: {
      skyId: string;
      entityId: string;
      flightPlaceType: string;
      localizedName: string;
    };
    relevantHotelParams: {
      entityId: string;
      entityType: string;
      localizedName: string;
    };
  };
}

export interface IListLocationResponse {
  data: Location[];
  status: boolean;
  message: string;
}

export default IListLocationResponse;
