import { api } from '../client';
import IListLocationResponse, { ISearchCitiesResponse, StandardLocationResponse } from './types';
import { USE_MOCK_LOCATIONS, filterMockLocations } from '@/mocks/locations.mock';

const listLocations = async (keyword: string, signal?: AbortSignal): Promise<StandardLocationResponse> => {
  // Se mock está habilitado, retorna dados mockados
  if (USE_MOCK_LOCATIONS) {
    console.log('🔧 [MOCK] Usando dados mockados para locations:', keyword);

    // Simula delay de rede (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simula cancelamento se signal foi abortado
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const locations = filterMockLocations(keyword);
    console.log('🔧 [MOCK] Retornando', locations.length, 'resultados');

    return {
      locations,
      status: true
    };
  }

  // Se mock desabilitado, usa API real
  return api.post<StandardLocationResponse>('/locations/list', { keyword }, { signal })
    .then((res) => res.data)
}

const listLocationsGoogle = async (keyword: string, signal?: AbortSignal): Promise<StandardLocationResponse> => {
  // Mock também para Google endpoint
  if (USE_MOCK_LOCATIONS) {
    return listLocations(keyword, signal);
  }

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
