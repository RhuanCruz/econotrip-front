import { api } from '../client';
import { Location } from './types';

const listLocations = async (keyword: string): Promise<Location[]> => {
  return api.post<Location[]>('/locations/list', { keyword })
    .then((res) => res.data)
}

export const LocationApi = {
  listLocations,
}
