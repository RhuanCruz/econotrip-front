import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { PlannerService } from "../api/planner/PlannerService";
import { Calendar, MapPin, Users, Briefcase, PiggyBank, Timer, Info, BookOpen, Plane } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function MeuRoteiroDetalhesScreen() {
  const handleDelete = async () => {
    if (!id || !token) return;
    try {
      await PlannerService.deleteById(id, token);
      navigate("/meu-roteiro");
    } catch (e) {
      setError("Erro ao excluir simulação. Tente novamente.");
    }
  };
  const { id } = useParams();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [roteiro, setRoteiro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoteiro() {
      setLoading(true);
      setError(null);
      try {
        const response = await PlannerService.getById(id, token);
        setRoteiro(response.content);
      } catch (e) {
        setError("Não foi possível carregar os detalhes da simulação.");
      } finally {
        setLoading(false);
      }
    }
    if (id && token) fetchRoteiro();
  }, [id, token]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!roteiro) return <div className="p-8 text-center">Simulação não encontrada.</div>;

  const { resumo_viagem, custos_estimados, resumo_financeiro, dicas_economia, dicas_otimizacao_tempo, observacoes_importantes, informacoes_praticas, itinerario_detalhado } = roteiro;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        {/* Header principal melhorado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-econotrip-blue mb-2">
            Viagem para {resumo_viagem.destino}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
            <Calendar className="h-5 w-5" />
            <span className="text-lg font-medium">{resumo_viagem.periodo}</span>
          </div>
          <div className="text-sm text-gray-500">
            {resumo_viagem.duracao_dias} dias • {resumo_viagem.numero_pessoas} {resumo_viagem.numero_pessoas === 1 ? 'pessoa' : 'pessoas'} • Estilo {resumo_viagem.estilo_viagem}
          </div>
        </div>

        {/* Card do resumo minimalista */}
        <section className="mb-6">
          <Card className="p-1 mb-4 bg-white border border-gray-100 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2 py-1">
                <MapPin className="text-blue-600 h-4 w-4 mt-1" />
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Origem</span>
                  <div className="font-medium text-gray-900">{resumo_viagem.origem}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 py-1">
                <MapPin className="text-pink-600 h-4 w-4 mt-1" />
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Destino</span>
                  <div className="font-medium text-gray-900">{resumo_viagem.destino}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 py-1">
                <Calendar className="text-green-600 h-4 w-4 mt-1" />
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Período</span>
                  <div className="font-medium text-gray-900">{resumo_viagem.periodo}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 py-1">
                <Users className="text-purple-600 h-4 w-4 mt-1" />
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Viajantes</span>
                  <div className="font-medium text-gray-900">{resumo_viagem.numero_pessoas} {resumo_viagem.numero_pessoas === 1 ? 'pessoa' : 'pessoas'}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 py-1">
                <Briefcase className="text-yellow-600 h-4 w-4 mt-1" />
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Estilo</span>
                  <div className="font-medium text-gray-900 capitalize">{resumo_viagem.estilo_viagem}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 py-1">
                <Calendar className="text-gray-600 h-4 w-4 mt-1" />
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Duração</span>
                  <div className="font-medium text-gray-900">{resumo_viagem.duracao_dias} dias</div>
                </div>
              </div>
            </div>
          </Card>
        </section>
        <section className="mb-6">
          <Card className="p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Custos Estimados</h2>
            <div className="flex flex-col gap-3">
              <div className="bg-blue-50 rounded-lg p-3 flex flex-col">
                <span className="font-medium text-blue-900">Passagens</span>
                <span className="text-lg font-bold text-blue-700">R$ {custos_estimados.passagens_aereas.valor_total}</span>
                <span className="text-xs text-blue-800 mt-1">{custos_estimados.passagens_aereas.observacoes}</span>
              </div>
              <div className="bg-green-50 rounded-lg p-3 flex flex-col">
                <span className="font-medium text-green-900">Hospedagem</span>
                <span className="text-lg font-bold text-green-700">R$ {custos_estimados.hospedagem.valor_total}</span>
                <span className="text-xs text-green-800 mt-1">{custos_estimados.hospedagem.observacoes}</span>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 flex flex-col">
                <span className="font-medium text-yellow-900">Alimentação</span>
                <span className="text-lg font-bold text-yellow-700">R$ {custos_estimados.alimentacao.valor_total}</span>
                <span className="text-xs text-yellow-800 mt-1">{custos_estimados.alimentacao.observacoes}</span>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 flex flex-col">
                <span className="font-medium text-purple-900">Transporte local</span>
                <span className="text-lg font-bold text-purple-700">R$ {custos_estimados.transporte_local.valor_total}</span>
                <span className="text-xs text-purple-800 mt-1">{custos_estimados.transporte_local.observacoes}</span>
              </div>
              <div className="bg-pink-50 rounded-lg p-3 flex flex-col">
                <span className="font-medium text-pink-900">Atividades</span>
                <span className="text-lg font-bold text-pink-700">R$ {custos_estimados.atividades_turismo.valor_total}</span>
                <span className="text-xs text-pink-800 mt-1">{custos_estimados.atividades_turismo.observacoes}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
                <span className="font-medium text-gray-900">Outros</span>
                <span className="text-lg font-bold text-gray-700">R$ {custos_estimados.outros_gastos.valor_total}</span>
                <span className="text-xs text-gray-800 mt-1">{custos_estimados.outros_gastos.observacoes}</span>
              </div>
            </div>
            <div className="mt-4 text-right">
              <span className="font-bold text-xl text-econotrip-orange">Total estimado: R$ {resumo_financeiro.custo_total_viagem}</span>
            </div>
          </Card>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Itinerário Detalhado</h2>
          <div className="space-y-4">
            {itinerario_detalhado?.map((dia) => (
              <Card key={dia.dia} className="p-4 mb-2">
                <div className="font-bold text-econotrip-blue mb-1">Dia {dia.dia} {dia.cidade && <span className="text-sm text-econotrip-blue-light">- {dia.cidade}</span>}</div>
                <ul className="list-disc ml-6 text-gray-700">
                  {dia.atividades?.map((atividade, idx) => (
                    <li key={idx}><span className="font-semibold">{atividade.nome_atividade}</span> <span className="text-xs text-gray-500">{atividade.horario}</span> <span className="text-sm">{atividade.descricao}</span></li>
                  ))}
                  {(!dia.atividades || dia.atividades.length === 0) && <li className="text-gray-400">Nenhuma atividade planejada</li>}
                </ul>
              </Card>
            ))}
          </div>
        </section>
        <section className="mb-6">
          {/* Dicas, observações e informações práticas em coluna única */}
          <div className="flex flex-col gap-4">
            {dicas_economia?.length > 0 && (
              <Card className="p-4 flex flex-col gap-2 bg-green-50 border-green-100 rounded-2xl shadow-lg border-0">
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank className="text-green-600 h-5 w-5" />
                  <h3 className="font-semibold text-green-800">Dicas de Economia</h3>
                </div>
                <ul className="list-disc list-inside text-green-900 text-sm">
                  {dicas_economia.map((dica, idx) => (
                    <li key={idx}>{dica}</li>
                  ))}
                </ul>
              </Card>
            )}
            {dicas_otimizacao_tempo?.length > 0 && (
              <Card className="p-4 flex flex-col gap-2 bg-blue-50 border-blue-100 rounded-2xl shadow-lg border-0">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="text-blue-600 h-5 w-5" />
                  <h3 className="font-semibold text-blue-800">Dicas de Otimização de Tempo</h3>
                </div>
                <ul className="list-disc list-inside text-blue-900 text-sm">
                  {dicas_otimizacao_tempo.map((dica, idx) => (
                    <li key={idx}>{dica}</li>
                  ))}
                </ul>
              </Card>
            )}
            {observacoes_importantes?.length > 0 && (
              <Card className="p-4 flex flex-col gap-2 bg-yellow-50 border-yellow-100 rounded-2xl shadow-lg border-0">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="text-yellow-600 h-5 w-5" />
                  <h3 className="font-semibold text-yellow-800">Observações Importantes</h3>
                </div>
                <ul className="list-disc list-inside text-yellow-900 text-sm">
                  {observacoes_importantes.map((obs, idx) => (
                    <li key={idx}>{obs}</li>
                  ))}
                </ul>
              </Card>
            )}
            {informacoes_praticas && (
              <Card className="p-4 flex flex-col gap-2 bg-purple-50 border-purple-100 rounded-2xl shadow-lg border-0">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="text-purple-600 h-5 w-5" />
                  <h3 className="font-semibold text-purple-800">Informações Práticas</h3>
                </div>
                <ul className="text-purple-900 text-sm space-y-1">
                  {informacoes_praticas.melhor_epoca_visitar && (
                    <li><b>Melhor época para visitar:</b> {informacoes_praticas.melhor_epoca_visitar}</li>
                  )}
                  {informacoes_praticas.documentos_necessarios && informacoes_praticas.documentos_necessarios.length > 0 && (
                    <li><b>Documentos necessários:</b> {informacoes_praticas.documentos_necessarios.join(', ')}</li>
                  )}
                  {informacoes_praticas.fuso_horario && (
                    <li><b>Fuso horário:</b> {informacoes_praticas.fuso_horario}</li>
                  )}
                  {informacoes_praticas.idioma_local && (
                    <li><b>Idioma local:</b> {informacoes_praticas.idioma_local}</li>
                  )}
                  {informacoes_praticas.moeda_local && (
                    <li><b>Moeda local:</b> {informacoes_praticas.moeda_local}</li>
                  )}
                  {informacoes_praticas.voltagem && (
                    <li><b>Voltagem:</b> {informacoes_praticas.voltagem}</li>
                  )}
                </ul>
              </Card>
            )}
          </div>
        </section>
        <div className="flex justify-end max-w-2xl mx-auto pb-8 mt-6">
          <div className="flex justify-center w-full pb-8 mt-6">
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-1.5 rounded-xl shadow-lg">
                Excluir simulação
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
