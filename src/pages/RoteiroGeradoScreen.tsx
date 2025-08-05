import React, { useState } from "react";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Button } from "../components/ui/button";
import { LinhaDoTempoRoteiro } from "../components/roteiro/LinhaDoTempoRoteiro";
import { Card } from "../components/ui-custom/Card";
import { CalendarDays, MapPin, Users, Briefcase, PiggyBank, Timer, Info, BookOpen, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlannerService } from "../api/planner/PlannerService";
import { useToast } from "../hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

export default function RoteiroGeradoScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { token } = useAuthStore();

  // Garante que o hook nunca é chamado condicionalmente
  const roteiro = location.state?.roteiro;
  const start = location.state?.start;
  const duracao = location.state?.duration;
  const destination: Array<{ city: string; duration: number; }> = location.state?.destination;
  const itinerario_detalhado = roteiro?.itinerario_detalhado || [];

  const [eventos, setEventos] = useState(() => itinerario_detalhado.flatMap((dia, idx) => {
    const atividades = dia.atividades
      ? dia.atividades.filter(a => {
        const cat = a.categoria?.toLowerCase();
        return cat !== "transporte";
      })
        .map((a, i) => ({
          id: `${dia.dia}-a${i}`,
          dia: dia.dia,
          horario: a.horario,
          titulo: a.nome_atividade,
          descricao: a.descricao,
          tipo: a.categoria?.toLowerCase() === "refeição" || a.categoria?.toLowerCase() === "refeicao" ? "refeicao" : "passeio",
          concluido: false,
          lembrete: false,
          categoria: a.categoria
        }))
      : [];
    return atividades;
  }));

  if (!roteiro) {
    return <div>Roteiro não encontrado. Volte e gere um roteiro.</div>;
  }

  const { resumo_viagem, custos_estimados, resumo_financeiro, dicas_economia, dicas_otimizacao_tempo, observacoes_importantes, informacoes_praticas } = roteiro;

  // Atualiza eventos ao editar/adicionar/remover no componente filho
  function handleEventosChange(novosEventos) {
    setEventos(novosEventos);
  }

  // Extrai todas as atividades sugeridas da API (de todos os dias), incluindo categoria e filtrando acomodações, transporte e refeições
  const atividadesSugeridas = itinerario_detalhado.flatMap((dia) =>
    dia.atividades
      .filter(a => {
        const cat = a.categoria?.toLowerCase();
        return cat !== "acomodação" && cat !== "acomodacao" && cat !== "transporte" && cat !== "refeição" && cat !== "refeicao";
      })
      .map((a, i) => ({
        id: `${dia.dia}-a${i}`,
        nome: a.nome_atividade,
        descricao: a.descricao,
        categoria: a.categoria
      }))
  );

  // Função para salvar o planner
  async function handleSalvar() {
    try {
      // Monta novo itinerario_detalhado a partir dos eventos
      const novoItinerario = [];
      for (const dia of itinerario_detalhado) {
        const atividadesDoDia = eventos.filter(ev => ev.dia === dia.dia).map(ev => ({
          horario: ev.horario,
          nome_atividade: ev.titulo,
          descricao: ev.descricao,
          categoria: ev.categoria || "passeio"
        }));
        novoItinerario.push({ ...dia, atividades: atividadesDoDia });
      }

      // Debug: verificar os valores recebidos
      console.log('Start recebido:', start, typeof start);
      console.log('Duração recebida:', duracao, typeof duracao);

      // Validação e tratamento das datas
      let startDate;

      if (!start || !duracao) {
        throw new Error('Data de início ou duração não encontrada');
      }

      // Tenta criar a data de início
      startDate = new Date(start);
      if (isNaN(startDate.getTime())) {
        // Se falhar, tenta formatar como YYYY-MM-DD
        const dateStr = start.toString();
        if (dateStr.includes('/')) {
          // Formato DD/MM/YYYY para YYYY-MM-DD
          const [day, month, year] = dateStr.split('/');
          startDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        } else {
          startDate = new Date(dateStr);
        }
      }

      if (isNaN(startDate.getTime())) {
        throw new Error('Formato de data inválido: ' + start);
      }

      // Calcula a data de fim
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(duracao) - 1);

      const content = {
        ...roteiro,
        itinerario_detalhado: novoItinerario
      };

      await PlannerService.create(token, {
        start: startDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        end: endDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        destination: destination.map((dest) => dest.city),
        content
      });
      toast({ title: "Roteiro salvo com sucesso!" });
      navigate("/meu-roteiro")
    } catch (e) {
      console.error('Erro ao salvar roteiro:', e);
      toast({ title: "Erro ao salvar roteiro", description: e.message, variant: "destructive" });
    }
  }



  return (
    <ScreenContainer>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        {/* Header principal melhorado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-econotrip-blue mb-2">
            Viagem para {destination.map(item => item.city.split(',')[0].trim())
              .join(', ')
              .replace(/, ([^,]*)$/, ' e $1')}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
            <CalendarDays className="h-5 w-5" />
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
                <CalendarDays className="text-green-600 h-4 w-4 mt-1" />
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
                <CalendarDays className="text-gray-600 h-4 w-4 mt-1" />
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
          <LinhaDoTempoRoteiro 
            objetivo={resumo_viagem.estilo_viagem} 
            eventosExternos={eventos} 
            atividadesDisponiveis={atividadesSugeridas} 
            itinerarioDetalhado={itinerario_detalhado}
            onEventosChange={handleEventosChange} 
          />
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
      <div className="flex justify-end max-w-2xl mx-auto pb-8 mt-6">
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
          onClick={handleSalvar}
        >
          <Plus className="h-6 w-6" />
          Salvar
        </Button>
      </div>
    </ScreenContainer>
  );
}
