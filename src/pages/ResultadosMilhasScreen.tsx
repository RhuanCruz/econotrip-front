import React, { useState, useEffect } from "react";
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
  Loader2,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { FlightService } from "@/api/flight/FlightService";
import type { GetTripByMileageResponse } from "@/api/flight/types";

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

export default function ResultadosMilhasScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados vindos da navegação
  const { origem, destino, dataIda, dataVolta, programa } = location.state || {};
  
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para mapear dados da API para interface local
  const mapApiDataToFlights = (apiData: GetTripByMileageResponse): FlightResult[] => {
    if (!apiData.data || !Array.isArray(apiData.data)) {
      return [];
    }

    // Os booking_links são compartilhados para todos os voos
    const bookingLinks = apiData.booking_links || [];

    return apiData.data.map((trip) => ({
      id: trip.ID,
      flightNumbers: trip.FlightNumbers,
      origin: trip.OriginAirport,
      destination: trip.DestinationAirport,
      departureTime: trip.DepartsAt,
      arrivalTime: trip.ArrivesAt,
      duration: trip.TotalDuration,
      stops: trip.Stops,
      carriers: trip.Carriers,
      mileageCost: trip.MileageCost,
      totalTaxes: trip.TotalTaxes / 100, // Converte de centavos
      taxesCurrency: trip.TaxesCurrency,
      taxesCurrencySymbol: trip.TaxesCurrencySymbol,
      remainingSeats: trip.RemainingSeats,
      cabin: trip.Cabin,
      aircraft: trip.Aircraft,
      bookingLinks: bookingLinks,
      segments: trip.AvailabilitySegments.map((segment) => ({
        id: segment.ID,
        flightNumber: segment.FlightNumber,
        origin: segment.OriginAirport,
        destination: segment.DestinationAirport,
        departureTime: segment.DepartsAt,
        arrivalTime: segment.ArrivesAt,
        aircraft: segment.AircraftName,
        cabin: segment.Cabin,
        fareClass: segment.FareClass
      }))
    }));
  };

  // Carregar voos por milhas
  useEffect(() => {
    const loadFlightsByMileage = async () => {
      if (!programa?.id) {
        setError('Programa de milhas não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await FlightService.getMileageTrips(programa.id);
        const mappedFlights = mapApiDataToFlights(response);
        setFlights(mappedFlights);
      } catch (err) {
        console.error('Erro ao carregar voos por milhas:', err);
        setError('Erro ao carregar voos. Tente novamente.');
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    loadFlightsByMileage();
  }, [programa?.id]);

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCabinColor = (cabin: string) => {
    switch (cabin.toLowerCase()) {
      case 'economy': return "text-green-600 bg-green-100";
      case 'business': return "text-blue-600 bg-blue-100";
      case 'first': return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleSelectFlight = (flight: FlightResult) => {
    // Navegar para detalhes do voo por milhas
    navigate("/miles-flight-details", {
      state: {
        flight,
        programa,
        origem,
        destino,
        dataIda,
        dataVolta
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-econotrip-primary p-4 rounded-2xl text-white mb-4">
            <div className="text-center mb-3">
              <h1 className="text-xl font-bold text-white">
                Programa: {programa?.nome}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">
                {origem} → {destino}
              </span>
            </div>
            {dataIda && (
              <div className="flex items-center justify-center gap-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {formatDate(dataIda)} {dataVolta && `• ${formatDate(dataVolta)}`}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Resultados */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-econotrip-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando voos disponíveis...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Plane className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Erro ao carregar voos
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="px-6"
            >
              Tentar novamente
            </Button>
          </motion.div>
        ) : flights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Plane className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum voo encontrado
            </h3>
            <p className="text-gray-500">
              Não há voos disponíveis para esta rota com {programa?.nome}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {flights.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Horários e duração */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatTime(flight.departureTime)}
                        </p>
                        <p className="text-sm text-gray-600">{flight.origin}</p>
                      </div>
                      
                      <div className="flex-1 px-4">
                        <div className="relative">
                          <div className="h-px bg-gray-300 w-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white px-2 text-xs text-gray-500 text-center">
                              <div>{formatDuration(flight.duration)}</div>
                              <div>{flight.stops === 0 ? 'Direto' : `${flight.stops} parada${flight.stops > 1 ? 's' : ''}`}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatTime(flight.arrivalTime)}
                        </p>
                        <p className="text-sm text-gray-600">{flight.destination}</p>
                      </div>
                    </div>

                    {/* Tag da classe centralizada - comentado temporariamente */}
                    {/* <div className="flex justify-center mb-4">
                      <Badge className={getCabinColor(flight.cabin)}>
                        {flight.cabin}
                      </Badge>
                    </div> */}

                    {/* Informações de preço */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-econotrip-orange" />
                          <span className="text-xs text-gray-600">Milhas</span>
                        </div>
                        <p className="text-lg font-bold text-econotrip-blue">
                          {flight.mileageCost.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-xs text-gray-600">+ Taxas</span>
                        </div>
                        <p className="text-lg font-bold text-econotrip-blue-light">
                          {flight.taxesCurrencySymbol} {flight.totalTaxes.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Botão de seleção */}
                    <Button
                      variant="primary"
                      onClick={() => handleSelectFlight(flight)}
                      className="w-full h-12 text-lg bg-econotrip-primary"
                      icon={ArrowRight}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
