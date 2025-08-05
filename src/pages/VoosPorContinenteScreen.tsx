import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plane,
  MapPin,
  Calendar,
  DollarSign,
  Clock
} from "lucide-react";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { RadarService } from "../api/radar/RadarService";
import { RadarResult } from "../api/radar/types";
import { handleApiError } from "../utils/ErrorHandler";
import { useAuthStore } from "@/stores/authStore";

interface ContinentMapping {
  [key: string]: {
    nome: string;
    apiValue: string;
    cor: string;
    imagem: string;
  };
}

const continentMapping: ContinentMapping = {
  "europa": {
    nome: "Europa",
    apiValue: "EUROPE",
    cor: "from-blue-500 to-purple-600",
    imagem: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=400&fit=crop&crop=center"
  },
  "america-sul": {
    nome: "América do Sul",
    apiValue: "SOUTH_AMERICA",
    cor: "from-green-500 to-teal-600",
    imagem: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=400&fit=crop&crop=center"
  },
  "america-norte": {
    nome: "América do Norte",
    apiValue: "NORTH_AMERICA",
    cor: "from-red-500 to-orange-600",
    imagem: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop&crop=center"
  },
  "asia": {
    nome: "Ásia",
    apiValue: "ASIA",
    cor: "from-yellow-500 to-red-600",
    imagem: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&h=400&fit=crop&crop=center"
  },
  "africa": {
    nome: "África",
    apiValue: "AFRICA",
    cor: "from-orange-500 to-yellow-600",
    imagem: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop&crop=center"
  },
  "oceania": {
    nome: "Oceania",
    apiValue: "OCEANIA",
    cor: "from-cyan-500 to-blue-600",
    imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center"
  }
};

export default function VoosPorContinenteScreen() {
  const { continenteId } = useParams<{ continenteId: string }>();
  const navigate = useNavigate();
  const [voos, setVoos] = useState<RadarResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthStore();

  const continente = continenteId ? continentMapping[continenteId] : null;

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const carregarVoos = async () => {
      if (!continente) {
        setError("Continente não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        if (!token) {
          throw new Error("Token de autenticação não encontrado");
        }
        const response = await RadarService.listResultsByContinent(token, continente.apiValue);
        setVoos(response.results || []);
      } catch (err) {
        console.error("Erro ao carregar voos:", err);
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    carregarVoos();
  }, [continente, token]);

  const formatarData = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatarPreco = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!continente) {
    return (
      <ScreenContainer>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Continente não encontrado</h2>
            <p className="text-gray-600 mb-4">O continente solicitado não existe.</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Card>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
        <div className="max-w-2xl mx-auto px-4 py-2 space-y-6 pb-24">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={itemAnimation} className="mb-6">
              <div className={`h-28 bg-gradient-to-r ${continente.cor} relative overflow-hidden rounded-2xl mb-4`}>
                <img
                  src={continente.imagem}
                  alt={`Vista de ${continente.nome}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <Plane className="h-8 w-8 text-white/90" />
                    <h1 className="text-2xl font-museomoderno font-bold text-white drop-shadow-lg">
                      {continente.nome}
                    </h1>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div variants={itemAnimation}>
                <Card className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-econotrip-blue mx-auto mb-3"></div>
                  <p className="text-gray-600">Carregando ofertas...</p>
                </Card>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div variants={itemAnimation}>
                <Card className="p-6 text-center bg-red-50 border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">Erro ao carregar ofertas</h3>
                  <p className="text-red-600 text-sm mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Tentar Novamente
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Lista de Voos */}
            {!loading && !error && (
              <motion.div variants={itemAnimation}>
                {!voos || voos.length === 0 ? (
                  <Card className="p-6 text-center">
                    <Plane className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Nenhuma oferta encontrada
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Não há ofertas disponíveis para {continente.nome} no momento.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {voos.length} {voos.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
                      </h2>
                    </div>

                    {voos.map((voo) => (
                      <motion.div
                        key={voo._id}
                        variants={itemAnimation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="p-1 hover:shadow-lg transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-econotrip-blue" />
                                <span className="font-medium text-gray-800">
                                  {voo.origin} → {voo.destination}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{formatarData(voo.date)}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-econotrip-green">
                                {formatarPreco(voo.value)}
                              </div>
                              <div className="text-xs text-gray-500">por pessoa</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                            <button
                              onClick={() => navigate('/busca-voos', {
                                state: {
                                  searchParams: {
                                    origem: voo.origin,
                                    destino: voo.destination,
                                    dataIda: new Date(voo.date).toISOString().split('T')[0],
                                  }
                                }
                              })}
                              className="bg-econotrip-blue hover:bg-econotrip-blue/90 text-white px-8 py-2 rounded-lg text-sm font-medium transition-colors w-48"
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Informação adicional */}
            {!loading && !error && voos && voos.length > 0 && (
              <motion.div variants={itemAnimation}>
                <Card className="p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-blue/10 rounded-2xl border-0">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-econotrip-blue mx-auto mb-2" />
                    <h3 className="font-semibold text-econotrip-blue mb-1">
                      Ofertas atualizadas
                    </h3>
                    <p className="text-xs text-gray-600">
                      Preços e disponibilidade sujeitos a alteração.
                      Clique em "Ver Detalhes" para mais informações.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </ScreenContainer>
  );
}
