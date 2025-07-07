import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import { CreatePlannerBody, GeneratePlannerBody, GeneratePlannerResponse, IListPlannerFilterBody, ListPlannerResponse, Planner } from './types';

const createPlanner = async (token: string, data: CreatePlannerBody): Promise<Planner> => {
  return api.post<Planner>('/planners', data, { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const getCurrentPlanner = async (token: string): Promise<Planner> => {
  return api.get<Planner>('/planners/current', { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const cancelCurrentPlanner = async (id: string, token: string): Promise<void> => {
  await api.patch(`/planners/current/cancel`, {}, { headers: { Authorization: `Bearer ${token}`}})
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const listPlanner = async (token: string, filters?: IListPlannerFilterBody): Promise<ListPlannerResponse> => {
  return api.post<ListPlannerResponse>('/planners/list', {}, { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

export const generatePlanner = async (token: string, data: GeneratePlannerBody): Promise<GeneratePlannerResponse> => {
  const response = await api.post<GeneratePlannerResponse>(`/planners/generate`, data, { headers: { Authorization: `Bearer ${token}`}})
    .catch((err) => { console.log(err); throw new Error(handleApiError(err)) });

  return response.data;
}

export const PlannerService = {
  create: createPlanner,
  getCurrent: getCurrentPlanner,
  list: listPlanner,
  cancelCurrent: cancelCurrentPlanner,
  generate: generatePlanner,
}
