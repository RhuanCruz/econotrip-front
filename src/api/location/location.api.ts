import { api } from '../client';
import IListLocationResponse from './types';

const listLocations = async (keyword: string, signal?: AbortSignal): Promise<IListLocationResponse> => {
  return api.post<IListLocationResponse>('/locations/list', { keyword }, { signal })
    .then((res) => res.data)
}

export const LocationApi = {
  listLocations,
}
