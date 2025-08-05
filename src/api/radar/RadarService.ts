import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import { CreateRadarBody, GetRadarFlightsResponse, ListRadarResponse, ListResultsByContinentResponse, Radar } from './types';

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

export const deleteRadar = async (token: string, radarId: number): Promise<void> => {
  await api.delete(`/radars/${radarId}`, { headers: { Authorization: `Bearer ${token}`}})
    .catch((err) => { throw new Error(handleApiError(err)) });
}

export const listResultsByContinent = async (token: string, continent: string): Promise<ListResultsByContinentResponse> => {
  return api.get<ListResultsByContinentResponse>(`/radars/continents/${continent}`, { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

export const RadarService = {
  create: createRadar,
  list: listRadar,
  getFlights: getRadarFlights,
  delete: deleteRadar,
  listResultsByContinent: listResultsByContinent
}
