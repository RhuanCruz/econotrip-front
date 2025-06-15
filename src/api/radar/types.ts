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
  origin: string;
  destination: string;
  records: {
    date: string;
    price: number;
  }[];
};