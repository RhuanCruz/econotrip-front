import { api } from '../client';
import IListLocationResponse, { ISearchCitiesResponse, StandardLocationResponse } from './types';

const listLocations = async (keyword: string, signal?: AbortSignal): Promise<StandardLocationResponse> => {
  return api.post<StandardLocationResponse>('/locations/list', { keyword }, { signal })
    .then((res) => res.data)
}

const listLocationsGoogle = async (keyword: string, signal?: AbortSignal): Promise<StandardLocationResponse> => {
  return api.post<StandardLocationResponse>('/locations/list-google', { keyword }, { signal })
    .then((res) => res.data)
}

const searchCities = async (cityName: string, signal?: AbortSignal): Promise<ISearchCitiesResponse> => {
  return api.get<ISearchCitiesResponse>('/locations/cities/search', { params: { cityName }, signal })
    .then((res) => res.data)
}

export const LocationApi = {
  listLocations,
  listLocationsGoogle,
  searchCities,
}
