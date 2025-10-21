import type { CreateFeedbackBody, CreateFeedbackResponse, Feedback } from '@/api/feedback/types';

/**
 * Simula envio de feedback
 * Para usar enquanto o backend não está disponível
 */
export async function mockSendFeedback(
  token: string,
  data: CreateFeedbackBody
): Promise<CreateFeedbackResponse> {
  console.log('🔧 [MOCK FEEDBACK] Simulando envio de feedback:', data);

  // Simula delay de rede (500ms)
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simula validação de campos obrigatórios
  if (!data.category || !data.subject || !data.message) {
    throw new Error('Campos obrigatórios faltando: category, subject, message');
  }

  // Simula criação do feedback
  const mockFeedback: Feedback = {
    id: Math.floor(Math.random() * 10000), // ID aleatório
    userId: 1, // ID mockado
    category: data.category,
    subject: data.subject,
    message: data.message,
    rating: data.rating,
    email: data.email,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log('✅ [MOCK FEEDBACK] Feedback mockado criado com sucesso:', mockFeedback);

  return {
    feedback: mockFeedback,
    message: 'Feedback enviado com sucesso! (MOCK - dados não foram salvos no servidor)'
  };
}

/**
 * Flag para controlar se deve usar mock ou API real
 * Altere para false quando o backend estiver funcionando
 */
export const USE_MOCK_FEEDBACK = false; // ✅ Desativado - usando API real
