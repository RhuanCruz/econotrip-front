import { handleApiError } from '@/utils/ErrorHandler';
import { api } from '../client';
import type {
  AccommodationSearchParams,
  AccommodationSearchResponse,
  AccommodationRadar,
  CreateAccommodationRadarBody,
  ListAccommodationRadarResponse,
  GetAccommodationRadarResultsResponse,
} from './types';

/**
 * Buscar hospedagens disponíveis
 */
const searchAccommodations = async (
  token: string,
  params: AccommodationSearchParams
): Promise<AccommodationSearchResponse> => {
  return api
    .post<AccommodationSearchResponse>('/accommodations/search', params, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(handleApiError(err));
    });
};

/**
 * Criar radar de hospedagem
 */
const createRadar = async (
  token: string,
  data: CreateAccommodationRadarBody
): Promise<AccommodationRadar> => {
  return api
    .post<AccommodationRadar>('/radars/accommodation', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(handleApiError(err));
    });
};

/**
 * Listar radares de hospedagem do usuário
 */
const listRadars = async (token: string): Promise<ListAccommodationRadarResponse> => {
  return api
    .post<ListAccommodationRadarResponse>(
      '/radars/accommodation/list',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(handleApiError(err));
    });
};

/**
 * Obter resultados de um radar de hospedagem específico
 */
const getRadarResults = async (
  token: string,
  radarId: number
): Promise<GetAccommodationRadarResultsResponse> => {
  return api
    .get<GetAccommodationRadarResultsResponse>(`/radars/accommodation/${radarId}/results`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(handleApiError(err));
    });
};

/**
 * Deletar radar de hospedagem
 */
const deleteRadar = async (token: string, radarId: number): Promise<void> => {
  await api
    .delete(`/radars/accommodation/${radarId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      throw new Error(handleApiError(err));
    });
};

export const AccommodationService = {
  search: searchAccommodations,
  createRadar,
  listRadars,
  getRadarResults,
  deleteRadar,
};
