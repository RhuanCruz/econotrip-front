import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import { CreateRadarBody, GetRadarFlightsResponse, ListRadarResponse, Radar } from './types';

const createRadar = async (token: string, data: CreateRadarBody): Promise<Radar> => {
  return api.post<Radar>('/radars', data, { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const listRadar = async (token: string): Promise<ListRadarResponse> => {
  return api.post<ListRadarResponse>('/radars/list', {}, { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

export const getRadarFlights = async (token: string, radarId: number): Promise<GetRadarFlightsResponse> => {
  return api.get<GetRadarFlightsResponse>(`/radars/${radarId}/flights`, { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

export const RadarService = {
  create: createRadar,
  list: listRadar,
  getFlights: getRadarFlights,
}
