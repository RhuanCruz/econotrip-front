export type Radar = {
  id: number;
  userId: number;
  start: string;
  end: string;
  origin: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateRadarBody = {
  start: string;
  end: string;
  origin: string;
  destination: string;
  value: number;
  type: 'AIRMILES' | 'MONEY';
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