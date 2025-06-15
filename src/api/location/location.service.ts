import { handleApiError } from '@/utils/ErrorHandler';

import { LocationApi } from './location.api';
import { Location } from './types';

export const list = async (keyword: string): Promise<Location[]> => {
  return await LocationApi.listLocations(keyword).catch((err) => {
    throw new Error(handleApiError(err));
  });
};

export const LocationService = {
  list,
}