import { handleApiError } from '@/utils/ErrorHandler';
import { api } from '../client';
import type { CreateFeedbackBody, CreateFeedbackResponse } from './types';
import { USE_MOCK_FEEDBACK, mockSendFeedback } from '@/mocks/feedback.mock';

/**
 * Enviar feedback do usuário
 */
const sendFeedback = async (
  token: string,
  data: CreateFeedbackBody
): Promise<CreateFeedbackResponse> => {
  // Se mock está habilitado, usa dados mockados
  if (USE_MOCK_FEEDBACK) {
    console.log('🔧 [MOCK] Usando feedback mockado');
    return mockSendFeedback(token, data);
  }

  // Se mock desabilitado, usa API real
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
