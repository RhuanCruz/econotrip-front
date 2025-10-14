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
  console.log('🔵 FeedbackService - Enviando feedback:', {
    endpoint: '/feedback',
    data,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'sem token'
  });

  return api
    .post<CreateFeedbackResponse>('/feedback', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log('✅ FeedbackService - Sucesso:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.error('❌ FeedbackService - Erro:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        fullError: err
      });
      throw new Error(handleApiError(err));
    });
};

export const FeedbackService = {
  send: sendFeedback,
};
