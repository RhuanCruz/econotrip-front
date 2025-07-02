import { api } from '../client';
import IListLocationResponse from './types';

const listLocations = async (keyword: string): Promise<IListLocationResponse> => {
  return api.post<IListLocationResponse>('/locations/list', { keyword })
    .then((res) => res.data)
}

export const LocationApi = {
  listLocations,
}
