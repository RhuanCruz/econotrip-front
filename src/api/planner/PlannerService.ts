import { handleApiError } from '@/utils/ErrorHandler';

import { api } from '../client';
import { CreatePlannerBody, GeneratePlannerBody, GeneratePlannerResponse, ListPlannerResponse, Planner } from './types';

const createPlanner = async (token: string, data: CreatePlannerBody): Promise<Planner> => {
  return api.post<Planner>('/planners', data, { headers: { Authorization: `Bearer ${token}`}})
    .then((res) => res.data)
    .catch((err) => { throw new Error(handleApiError(err)) })
}

const listPlanner = async (token: string): Promise<ListPlannerResponse> => {
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
  list: listPlanner,
  generate: generatePlanner,
}
