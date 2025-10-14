import { handleApiError } from '@/utils/ErrorHandler';
import { api } from '../client';
import type { CreateFeedbackBody, CreateFeedbackResponse } from './types';

/**
 * Enviar feedback do usuário
 */
const sendFeedback = async (
  token: string,
  data: CreateFeedbackBody
): Promise<CreateFeedbackResponse> => {
  return api
    .post<CreateFeedbackResponse>('/feedback', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(handleApiError(err));
    });
};

export const FeedbackService = {
  send: sendFeedback,
};
