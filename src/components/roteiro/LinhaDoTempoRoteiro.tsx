import React, { useState } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Hotel, MapPin, Clock, Bell, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { StandardModal } from "@/components/ui-custom/StandardModal";

interface EventoRoteiro {
  id: string;
  dia: number;
  horario: string;
  titulo: string;
  descricao: string;
  tipo: "viagem" | "hotel" | "passeio" | "transporte";
  concluido: boolean;
  lembrete: boolean;
}

interface LinhaDoTempoRoteiroProps {
  objetivo: string;
  eventosExternos?: EventoRoteiro[];
  atividadesDisponiveis?: Array<{ id: string; nome: string; descricao: string; categoria?: string }>;
  onEventosChange?: (eventos: EventoRoteiro[]) => void;
}

export function LinhaDoTempoRoteiro({ objetivo, eventosExternos, atividadesDisponiveis = [], onEventosChange }: LinhaDoTempoRoteiroProps) {
  const [eventos, setEventos] = useState<EventoRoteiro[]>(eventosExternos);
  const [showAddModal, setShowAddModal] = useState<number | null>(null);
  const [newAtividade, setNewAtividade] = useState({
    horario: "",
    titulo: "",
    descricao: ""
  });

  // Notifica alterações ao pai
  React.useEffect(() => {
    if (onEventosChange) onEventosChange(eventos);
  }, [eventos]);

  const getIconByTipo = (tipo: string) => {
    switch (tipo) {
      case "viagem": return Plane;
      case "hotel": return Hotel;
      case "passeio": return MapPin;
      case "transporte": return MapPin;
      default: return Clock;
    }
  };

  const getColorByTipo = (tipo: string) => {
    switch (tipo) {
      case "viagem": return "bg-blue-100 text-blue-600";
      case "hotel": return "bg-green-100 text-green-600";
      case "passeio": return "bg-purple-100 text-purple-600";
      case "transporte": return "bg-orange-100 text-orange-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const toggleLembrete = (eventoId: string) => {
    setEventos(prev => 
      prev.map(evento => 
        evento.id === eventoId 
          ? { ...evento, lembrete: !evento.lembrete }
          : evento
      )
    );
    toast({
      title: "Lembrete atualizado",
      description: "Suas preferências de notificação foram salvas.",
    });
  };

  const marcarConcluido = (eventoId: string) => {
    setEventos(prev => 
      prev.map(evento => 
        evento.id === eventoId 
          ? { ...evento, concluido: !evento.concluido }
          : evento
      )
    );
    toast({
      title: "Status atualizado",
      description: "Evento marcado como concluído!",
    });
  };

  const cancelarEvento = (eventoId: string) => {
    setEventos(prev => prev.filter(evento => evento.id !== eventoId));
    toast({
      title: "Evento cancelado",
      description: "O evento foi removido do seu roteiro.",
    });
  };

  // Agrupar eventos por dia
  const eventosPorDia = eventos.reduce((acc, evento) => {
    if (!acc[evento.dia]) {
      acc[evento.dia] = [];
    }
    acc[evento.dia].push(evento);
    return acc;
  }, {} as Record<number, EventoRoteiro[]>);

  // Função para filtrar atividades disponíveis para o modal
  function getAtividadesNaoUsadas() {
    const usadas = new Set(eventos.map(ev => ev.titulo));
    return atividadesDisponiveis.filter(a => {
      const cat = a.categoria?.toLowerCase();
      return (
        !usadas.has(a.nome) &&
        cat !== "acomodação" && cat !== "acomodacao" &&
        cat !== "refeição" && cat !== "refeicao" &&
        cat !== "transporte"
      );
    });
  }

  return (
    <Card className="">
      <div className="space-y-6">
        {Object.entries(eventosPorDia).map(([dia, eventosODia]) => {
          // Ordena eventos pelo horário (vazio vai para o final)
          const eventosOrdenados = [...eventosODia].sort((a, b) => {
            if (!a.horario && !b.horario) return 0;
            if (!a.horario) return 1;
            if (!b.horario) return -1;
            return a.horario.localeCompare(b.horario);
          });
          return (
            <motion.div
              key={dia}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="flex items-center mb-3 gap-2">
                <h3 className="text-lg font-bold text-econotrip-blue">
                  Dia {dia}
                </h3>
                <button
                  className="ml-1 w-8 h-8 rounded-full bg-econotrip-blue text-white flex items-center justify-center hover:bg-econotrip-blue/90 transition"
                  onClick={() => setShowAddModal(Number(dia))}
                  type="button"
                  aria-label="Adicionar atividade"
                >
                  <span className="sr-only">Adicionar atividade</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {eventosOrdenados.map((evento) => {
                  const Icon = getIconByTipo(evento.tipo);
                  return (
                    <div
                      key={evento.id}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        evento.concluido 
                          ? "bg-green-50 border-green-200 opacity-75" 
                          : "bg-white border-gray-200 hover:border-econotrip-blue/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColorByTipo(evento.tipo)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-base font-medium break-words ${evento.concluido ? "line-through text-gray-500" : "text-econotrip-blue"}`}>
                                {evento.titulo}
                              </h4>
                              <p className="text-sm text-gray-600 break-words">
                                {evento.horario} - {evento.descricao}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={X}
                              onClick={() => cancelarEvento(evento.id)}
                              className="text-xs px-2 py-1 h-8 text-red-600 hover:bg-red-50 flex-shrink-0"
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal de adicionar atividade */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-econotrip-blue mb-4">Adicionar atividade sugerida</h2>
            <form className="space-y-3 px-1 pt-2" onSubmit={e => {
              e.preventDefault();
              if (!newAtividade.titulo || !newAtividade.horario || !newAtividade.descricao) return;
              setEventos(prev => [
                ...prev,
                {
                  id: `${showAddModal}-a${prev.length + 1}`,
                  dia: showAddModal,
                  horario: newAtividade.horario,
                  titulo: newAtividade.titulo,
                  descricao: newAtividade.descricao,
                  tipo: "passeio",
                  concluido: false,
                  lembrete: false
                }
              ]);
              setShowAddModal(null);
              setNewAtividade({ horario: "", titulo: "", descricao: "" });
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Atividade</label>
                <input
                  type="text"
                  list="atividades-sugeridas"
                  value={newAtividade.titulo}
                  onChange={e => {
                    const value = e.target.value;
                    const atividade = atividadesDisponiveis.find(a => a.nome === value);
                    setNewAtividade(a => ({
                      ...a,
                      titulo: value,
                      descricao: atividade?.descricao || ""
                    }));
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
                  placeholder="Digite ou selecione uma atividade"
                  required
                />
                <datalist id="atividades-sugeridas">
                  {getAtividadesNaoUsadas().map(a => (
                    <option key={a.id} value={a.nome} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input
                  type="time"
                  value={newAtividade.horario}
                  onChange={e => setNewAtividade(a => ({ ...a, horario: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={newAtividade.descricao}
                  onChange={e => setNewAtividade(a => ({ ...a, descricao: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
                  rows={2}
                  disabled={!!atividadesDisponiveis.find(a => a.nome === newAtividade.titulo)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowAddModal(null)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-econotrip-blue text-white font-semibold hover:bg-econotrip-blue/90">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
