import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Plane,
  Clock,
  ArrowLeft,
  ArrowRight,
  Users,
  Calendar,
  ExternalLink,
  Info,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";

interface FlightResult {
  id: string;
  flightNumbers: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  carriers: string;
  mileageCost: number;
  totalTaxes: number;
  taxesCurrency: string;
  taxesCurrencySymbol: string;
  remainingSeats: number;
  cabin: string;
  aircraft: string[];
  segments: Array<{
    id: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    aircraft: string;
    cabin: string;
    fareClass: string;
  }>;
  bookingLinks: Array<{
    label: string;
    link: string;
    primary: boolean;
  }>;
}

export default function MilesFlightDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados vindos da navegação
  const { flight, programa, origem, destino, dataIda, dataVolta } = location.state || {};

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (timeString: string) => {
    if (!timeString) return { time: '', date: '' };
    const date = new Date(timeString);
    return {
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      })
    };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCabinColor = (cabin: string) => {
    switch (cabin.toLowerCase()) {
      case 'economy': return "text-green-600 bg-green-100";
      case 'business': return "text-blue-600 bg-blue-100";
      case 'first': return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Links de reserva vindos da API
  const bookingLinks = flight?.bookingLinks || [];

  // Função para formatar o label substituindo "Book via" por "Reserve via"
  const formatBookingLabel = (label: string) => {
    return label.replace(/^Book via\s*/i, 'Reserve via ');
  };

  const handleBookingClick = (link: typeof bookingLinks[0]) => {
    // Redirecionar para o link de reserva
    if (link.link) {
      window.open(link.link, '_blank');
    }
  };

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Detalhes do voo não encontrados</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-econotrip-blue">
                Detalhes do Voo
              </h1>
              <p className="text-sm text-gray-600">{programa?.nome}</p>
            </div>
          </div>
        </motion.div>

        {/* Resumo do Voo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 overflow-hidden">
            <div className="p-6">
              {/* Rota e classe */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-econotrip-blue" />
                  <span className="font-semibold text-lg">
                    {flight.origin} → {flight.destination}
                  </span>
                </div>
                <Badge className={getCabinColor(flight.cabin)}>
                  {flight.cabin}
                </Badge>
              </div>

              {/* Horários principais */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatTime(flight.departureTime)}
                  </p>
                  <p className="text-sm text-gray-600">{flight.origin}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(flight.departureTime).date}
                  </p>
                </div>
                
                <div className="flex-1 px-4">
                  <div className="relative">
                    <div className="h-px bg-gray-300 w-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white px-3 py-1 rounded-full border text-xs text-gray-600 text-center">
                        <div className="font-medium">{formatDuration(flight.duration)}</div>
                        <div>{flight.stops === 0 ? 'Direto' : `${flight.stops} parada${flight.stops > 1 ? 's' : ''}`}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatTime(flight.arrivalTime)}
                  </p>
                  <p className="text-sm text-gray-600">{flight.destination}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(flight.arrivalTime).date}
                  </p>
                </div>
              </div>

              {/* Custo em milhas */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-econotrip-blue-light/10 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-econotrip-orange" />
                    <span className="text-sm text-gray-600">Milhas</span>
                  </div>
                  <p className="text-2xl font-bold text-econotrip-blue">
                    {flight.mileageCost.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-sm text-gray-600">+ Taxas</span>
                  </div>
                  <p className="text-2xl font-bold text-econotrip-blue-light">
                    {flight.taxesCurrencySymbol} {flight.totalTaxes.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Detalhes dos Segmentos */}
        {flight.segments && flight.segments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-econotrip-blue" />
                  Detalhes do Voo
                </h3>
                
                <div className="space-y-4">
                  {flight.segments.map((segment, index) => (
                    <div key={segment.id} className="border-l-2 border-econotrip-blue/20 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {segment.flightNumber}
                        </span>
                        <span className="text-sm text-gray-600">
                          {segment.aircraft}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium">
                            {formatTime(segment.departureTime)} - {segment.origin}
                          </div>
                          <div className="text-gray-500">
                            {formatDateTime(segment.departureTime).date}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="text-right">
                          <div className="font-medium">
                            {formatTime(segment.arrivalTime)} - {segment.destination}
                          </div>
                          <div className="text-gray-500">
                            {formatDateTime(segment.arrivalTime).date}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {segment.cabin}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Classe {segment.fareClass}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Informações Adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações Adicionais
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Companhia:</span>
                  <p className="font-medium">{flight.carriers}</p>
                </div>
                <div>
                  <span className="text-gray-600">Assentos restantes:</span>
                  <p className="font-medium">{flight.remainingSeats}</p>
                </div>
                <div>
                  <span className="text-gray-600">Números dos voos:</span>
                  <p className="font-medium">{flight.flightNumbers}</p>
                </div>
                <div>
                  <span className="text-gray-600">Aeronaves:</span>
                  <p className="font-medium">{flight.aircraft.join(', ')}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Opções de Reserva */}
        {bookingLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-econotrip-orange" />
                  Onde Reservar
                </h3>
                
                <div className="space-y-3">
                  {bookingLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <button
                        onClick={() => handleBookingClick(link)}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-econotrip-blue/50 hover:bg-gray-50 transition-colors text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {formatBookingLabel(link.label)}
                              </h4>
                              {link.primary && (
                                <Badge className="text-xs bg-green-100 text-green-600">
                                  Recomendado
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Clique para ser redirecionado para o site de reserva
                            </p>
                          </div>
                          <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-econotrip-blue transition-colors" />
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Compare preços em diferentes plataformas antes de finalizar sua reserva. 
                    Os valores podem variar entre os sites.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
