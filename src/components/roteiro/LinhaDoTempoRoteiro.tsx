
import React, { useState } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Hotel, MapPin, Clock, Bell, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

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
}

export function LinhaDoTempoRoteiro({ objetivo }: LinhaDoTempoRoteiroProps) {
  const [eventos, setEventos] = useState<EventoRoteiro[]>([
    {
      id: "1",
      dia: 1,
      horario: "08:00",
      titulo: "Embarque no aeroporto",
      descricao: "Chegada ao aeroporto - Gate A12",
      tipo: "viagem",
      concluido: false,
      lembrete: true,
    },
    {
      id: "2",
      dia: 1,
      horario: "14:30",
      titulo: "Check-in no hotel",
      descricao: "Hotel Pousada do Sol - Rua das Flores, 123",
      tipo: "hotel",
      concluido: false,
      lembrete: false,
    },
    {
      id: "3",
      dia: 2,
      horario: "09:00",
      titulo: "Passeio cultural",
      descricao: "Centro histórico - Guia incluído",
      tipo: "passeio",
      concluido: false,
      lembrete: true,
    },
    {
      id: "4",
      dia: 3,
      horario: "16:00",
      titulo: "Retorno ao aeroporto",
      descricao: "Transporte saindo do hotel",
      tipo: "transporte",
      concluido: false,
      lembrete: true,
    },
  ]);

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

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6 text-econotrip-blue" />
        <h2 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
          Sua programação de viagem
        </h2>
      </div>

      <div className="space-y-8">
        {Object.entries(eventosPorDia).map(([dia, eventosODia]) => (
          <motion.div
            key={dia}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-econotrip-blue pl-6 relative"
          >
            <div className="absolute -left-3 top-0 w-6 h-6 bg-econotrip-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{dia}</span>
            </div>
            
            <h3 className="text-xl font-bold text-econotrip-blue mb-4">
              Dia {dia}
            </h3>
            
            <div className="space-y-4">
              {eventosODia.map((evento) => {
                const Icon = getIconByTipo(evento.tipo);
                return (
                  <div
                    key={evento.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      evento.concluido 
                        ? "bg-green-50 border-green-200 opacity-75" 
                        : "bg-white border-gray-200 hover:border-econotrip-blue/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getColorByTipo(evento.tipo)}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className={`text-lg font-medium ${evento.concluido ? "line-through text-gray-500" : "text-econotrip-blue"}`}>
                              {evento.titulo}
                            </h4>
                            <p className="text-base text-gray-600">
                              {evento.horario} - {evento.descricao}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant={evento.lembrete ? "primary" : "secondary"}
                            size="sm"
                            icon={Bell}
                            onClick={() => toggleLembrete(evento.id)}
                            className="text-sm"
                          >
                            {evento.lembrete ? "Lembrete ativo" : "Me lembrar"}
                          </Button>
                          
                          <Button
                            variant={evento.concluido ? "secondary" : "primary"}
                            size="sm"
                            icon={Check}
                            onClick={() => marcarConcluido(evento.id)}
                            className="text-sm"
                          >
                            {evento.concluido ? "Desmarcar" : "Marcar como feito"}
                          </Button>
                          
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={X}
                            onClick={() => cancelarEvento(evento.id)}
                            className="text-sm text-red-600 hover:bg-red-50"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
