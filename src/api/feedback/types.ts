// Tipos para sistema de Feedback

export type FeedbackCategory =
  | 'BUG'
  | 'FEATURE_REQUEST'
  | 'IMPROVEMENT'
  | 'GENERAL'
  | 'COMPLIMENT'
  | 'COMPLAINT';

export interface CreateFeedbackBody {
  category: FeedbackCategory;
  subject: string;
  message: string;
  rating?: number; // 1-5 stars
  email?: string; // Email opcional para resposta
  attachments?: string[]; // URLs de screenshots ou arquivos
}

export interface Feedback {
  id: number;
  userId: number;
  category: FeedbackCategory;
  subject: string;
  message: string;
  rating?: number;
  email?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackResponse {
  feedback: Feedback;
  message: string;
}
