export type Radar = {
  id: number;
  userId: number;
  start: string;
  end: string;
  origin: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
  airline?: string;
  tripType?: 'ONE_WAY' | 'ROUND_TRIP';
  returnDateRange?: number;
}

export type CreateRadarBody = {
  origin: string;
  destination: string;
  start?: string;
  end?: string;
  value?: number;
  type: 'AIRMILES' | 'MONEY';
  airline?: string; // Filtro de companhia aérea
  tripType?: 'ONE_WAY' | 'ROUND_TRIP'; // Tipo de viagem
  returnDateRange?: number; // Intervalo em dias para buscar voos de retorno (padrão: 15)
};

export type ListRadarResponse = {
  records: Radar[];
  metadata: {
    total: number;
    items: number;
    offset: number;
  }
}

export type GetRadarFlightsResponse = {
  results: Array<{
      _id: string;
      origin: string;
      destination: string;
      type: 'MONEY' | 'AIRMILES';
      date: string;
      value: number;
      createdAt: string;
      __v: number;
  }>;
};

export interface RadarResult {
  _id: string;
  origin: string;
  destination: string;
  continent: string;
  type: string;
  date: string;
  value: number;
  createdAt: string;
  __v: number;
}

export interface ListResultsByContinentResponse {
  results: RadarResult[];
}