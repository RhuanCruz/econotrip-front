import React from "react";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Button } from "../components/ui/button";
import { LinhaDoTempoRoteiro } from "../components/roteiro/LinhaDoTempoRoteiro";
import { Card } from "../components/ui-custom/Card";
import { CalendarDays, MapPin, Users, Briefcase, PiggyBank, Timer, Info, BookOpen, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RoteiroGeradoScreen() {
  const location = useLocation();
  console.log(location.state?.roteiro)
  
  if (!location.state?.roteiro) {
    return <div>Roteiro não encontrado. Volte e gere um roteiro.</div>;
  }

  const roteiro = location.state?.roteiro;
  const { resumo_viagem, custos_estimados, itinerario_detalhado, resumo_financeiro, dicas_economia, dicas_otimizacao_tempo, observacoes_importantes, informacoes_praticas } = roteiro;

  // Adapta o itinerario_detalhado para o formato de eventos do componente LinhaDoTempoRoteiro
  const eventos = itinerario_detalhado.flatMap((dia, idx) => {
    const atividades = dia.atividades.map((a, i) => ({
      id: `${dia.dia}-a${i}`,
      dia: dia.dia,
      horario: a.horario,
      titulo: a.nome_atividade,
      descricao: a.descricao,
      tipo: "passeio",
      concluido: false,
      lembrete: false,
    }));
    const refeicoes = dia.refeicoes.map((r, i) => ({
      id: `${dia.dia}-r${i}`,
      dia: dia.dia,
      horario: "",
      titulo: r.tipo_refeicao,
      descricao: `${r.local_sugerido} (R$ ${r.custo_estimado_por_pessoa})`,
      tipo: "passeio",
      concluido: false,
      lembrete: false,
    }));
    return [...atividades, ...refeicoes];
  });

  function formatPeriodo(periodo: string) {
    // Espera formato: "2025-09-01T00:00:00.000Z a 2025-09-10T00:00:00.000Z"
    const [inicio, fim] = periodo.split(' a ');
    const format = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR');
    };
    return `${format(inicio)} a ${format(fim)}`;
  }

  return (
    <ScreenContainer>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Seu Roteiro Gerado</h1>
        <section className="mb-6">
          <Card className="p-6 mb-4 bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600 h-5 w-5" />
                <span><b>Origem:</b> {resumo_viagem.origem}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-pink-600 h-5 w-5" />
                <span><b>Destino:</b> {resumo_viagem.destino}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="text-green-600 h-5 w-5" />
                <span><b>Período:</b> {formatPeriodo(resumo_viagem.periodo)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-purple-600 h-5 w-5" />
                <span><b>Nº Pessoas:</b> {resumo_viagem.numero_pessoas}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="text-yellow-600 h-5 w-5" />
                <span><b>Estilo:</b> {resumo_viagem.estilo_viagem}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="text-gray-600 h-5 w-5" />
                <span><b>Duração:</b> {resumo_viagem.duracao_dias} dias</span>
              </div>
            </div>
          </Card>
        </section>
        <section className="mb-6">
          <Card className="p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Custos Estimados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <LinhaDoTempoRoteiro objetivo={resumo_viagem.estilo_viagem} eventosExternos={eventos}/>
        </section>
        <section className="mb-6">
          {/* Dicas, observações e informações práticas em coluna única */}
          <div className="flex flex-col gap-4">
            <Card className="p-4 flex flex-col gap-2 bg-green-50 border-green-100">
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
            <Card className="p-4 flex flex-col gap-2 bg-blue-50 border-blue-100">
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
            <Card className="p-4 flex flex-col gap-2 bg-yellow-50 border-yellow-100">
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
            <Card className="p-4 flex flex-col gap-2 bg-purple-50 border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-purple-600 h-5 w-5" />
                <h3 className="font-semibold text-purple-800">Informações Práticas</h3>
              </div>
              <ul className="text-purple-900 text-sm space-y-1">
                <li><b>Melhor época para visitar:</b> {informacoes_praticas.melhor_epoca_visitar}</li>
                <li><b>Documentos necessários:</b> {informacoes_praticas.documentos_necessarios.join(', ')}</li>
                <li><b>Fuso horário:</b> {informacoes_praticas.fuso_horario}</li>
                <li><b>Idioma local:</b> {informacoes_praticas.idioma_local}</li>
                <li><b>Moeda local:</b> {informacoes_praticas.moeda_local}</li>
                <li><b>Voltagem:</b> {informacoes_praticas.voltagem}</li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
      <div className="flex justify-end max-w-2xl mx-auto pb-8">
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
        >
          <Plus className="h-6 w-6" />
          Salvar
        </Button>
      </div>
    </ScreenContainer>
  );
}
