import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import { GetDashboardResponse } from './types';

const getDashboard = async (token: string): Promise<GetDashboardResponse> => {
  return api.get<GetDashboardResponse>('/dashboard', { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}


export const PlannerService = {
  getDashboard: getDashboard,
}
