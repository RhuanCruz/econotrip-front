
import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import ISearchFlightResponse, { GetFlightDetailBody, GetFlightDetailResponse, GetHomeOfferResponse, GetTripByMileageResponse, SearchFlightByMileageResponse, SearchFlightOffersBody, SearchFlightOffersResponse, SearchMileageProgramsBody, SearchMileageProgramsResponse } from './types';

const SearchFlightOffersService = async (data: SearchFlightOffersBody): Promise<ISearchFlightResponse> => {
  return api.post<ISearchFlightResponse>('/flights/skyscrapper/search', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

const SearchFlightOffersByMileageService = async (data: SearchFlightOffersBody): Promise<SearchFlightByMileageResponse> => {
  return api.post<SearchFlightByMileageResponse>('/flights/mileage/search', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

const GetSearchFlightDetailService = async (data: GetFlightDetailBody): Promise<GetFlightDetailResponse> => {
  return api.post<GetFlightDetailResponse>('/flights/skyscrapper/search/detail', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

const GetTripsByMileage = async (id: string): Promise<GetTripByMileageResponse> => {
  return api.post<GetTripByMileageResponse>(`/flights/mileage/${id}`)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

const HomeFlightOffersService = async (): Promise<GetHomeOfferResponse> => {
  return api.post<GetHomeOfferResponse>('/flights/offers/home')
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

const SearchMilesProgramsService = async (data: SearchMileageProgramsBody): Promise<SearchMileageProgramsResponse> => {
  return api.post<SearchMileageProgramsResponse>('/flights/mileage/programs/search', data)
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) });
}

export const FlightService = {
  search: SearchFlightOffersService,
  searchByMileage: SearchFlightOffersByMileageService,
  getFlighDetails: GetSearchFlightDetailService,
  getMileageTrips: GetTripsByMileage,
  getOverview: HomeFlightOffersService,
  searchMilesPrograms: SearchMilesProgramsService
}