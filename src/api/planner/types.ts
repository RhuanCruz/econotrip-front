export type Planner = {
  id: number;
  userId: number;
  start: string;
  end: string;
  destination: string;
  content: object;
  createdAt: string;
  updatedAt: string;
}

export type CreatePlannerBody = {
  start: string;
  end: string;
  destination: string;
  content: object;
};

export type GeneratePlannerBody = {
  start: string;
  duration: number;
  amountPeople?: number;
  tripStyle?: string;
  origin: string;
  destination: string;
};

export type ListPlannerResponse = {
  records: Planner[];
  metadata: {
    total: number;
    items: number;
    offset: number;
  }
}

// Interface para o plano de viagem completo
export interface GeneratePlannerResponse {
  resumo_viagem: TravelSummary;
  custos_estimados: EstimatedCosts;
  itinerario_detalhado: DailyItinerary[];
  alternativas_atividades: ActivityAlternative[];
  resumo_financeiro: FinancialSummary;
  dicas_economia: string[];
  dicas_otimizacao_tempo: string[];
  observacoes_importantes: string[];
  informacoes_praticas: PracticalInfo;
  data_estimativa: string;
}

// Resumo da viagem
interface TravelSummary {
  destino: string;
  origem: string;
  duracao_dias: number;
  numero_pessoas: number;
  periodo: string;
  estilo_viagem: string;
}

// Custos estimados
interface EstimatedCosts {
  passagens_aereas: FlightCosts;
  hospedagem: AccommodationCosts;
  alimentacao: FoodCosts;
  transporte_local: LocalTransportCosts;
  atividades_turismo: TourismCosts;
  outros_gastos: OtherExpenses;
}

interface FlightCosts {
  valor_por_pessoa: number;
  valor_total: number;
  observacoes: string;
}

interface AccommodationCosts {
  valor_por_noite: number;
  total_noites: number;
  valor_total: number;
  tipo_acomodacao: string;
  observacoes: string;
}

interface FoodCosts {
  valor_por_pessoa_por_dia: number;
  valor_total: number;
  observacoes: string;
}

interface LocalTransportCosts {
  valor_total: number;
  tipos_incluidos: string[];
  observacoes: string;
}

interface TourismCosts {
  valor_total: number;
  principais_atividades: string[];
  observacoes: string;
}

interface OtherExpenses {
  valor_total: number;
  itens_incluidos: string[];
  observacoes: string;
}

// Itinerário diário
interface DailyItinerary {
  dia: number;
  data: string;
  tema_do_dia: string;
  atividades: Activity[];
  refeicoes: Meal[];
  transporte_do_dia: DailyTransport;
  custo_total_dia: number;
  tempo_livre: string;
  observacoes_dia: string;
}

interface Activity {
  horario: string;
  nome_atividade: string;
  descricao: string;
  duracao_estimada: string;
  custo_por_pessoa: number;
  custo_total: number;
  categoria: string;
  nivel_prioridade: string;
  dicas: string;
  endereco_aproximado: string;
}

interface Meal {
  tipo_refeicao: string;
  local_sugerido: string;
  custo_estimado_por_pessoa: number;
  custo_total: number;
  observacoes: string;
}

interface DailyTransport {
  meios_utilizados: string[];
  custo_total: number;
  observacoes: string;
}

// Alternativas de atividades
interface ActivityAlternative {
  atividade_original: string;
  alternativas: Alternative[];
}

interface Alternative {
  nome: string;
  custo_por_pessoa: number;
  motivo_alternativa: string;
}

// Resumo financeiro
interface FinancialSummary {
  custo_total_viagem: number;
  custo_por_pessoa: number;
  distribuicao_por_categoria: CategoryDistribution;
  moeda: string;
}

interface CategoryDistribution {
  passagens: number;
  hospedagem: number;
  alimentacao: number;
  transporte_local: number;
  atividades: number;
  outros: number;
}

// Informações práticas
interface PracticalInfo {
  melhor_epoca_visitar: string;
  documentos_necessarios: string[];
  fuso_horario: string;
  idioma_local: string;
  moeda_local: string;
  voltagem: string;
}