
export interface FlightDetails {
  id: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  date: string;
  duration: string;
  stops: string;
  baggage: string;
  price: number;
  isLowEmission: boolean;
  isAccessible: boolean;
  cancellationPolicy: string;
}
