import { api } from '../client';
import IListLocationResponse, { ISearchCitiesResponse } from './types';

const listLocations = async (keyword: string, signal?: AbortSignal): Promise<IListLocationResponse> => {
  return api.post<IListLocationResponse>('/locations/list', { keyword }, { signal })
    .then((res) => res.data)
}

const searchCities = async (cityName: string, signal?: AbortSignal): Promise<ISearchCitiesResponse> => {
  return api.get<ISearchCitiesResponse>('/locations/cities/search', { params: { cityName }, signal })
    .then((res) => res.data)
}

export const LocationApi = {
  listLocations,
  searchCities,
}
