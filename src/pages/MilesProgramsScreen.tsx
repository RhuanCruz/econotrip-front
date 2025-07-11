import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Plane,
  Users,
  Clock,
  Award,
  ArrowRight,
  Zap,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { FlightService } from "@/api/flight/FlightService";
import type { SearchMileageProgramsResponse, SearchMileageProgramsBody } from "@/api/flight/types";

interface MilesProgram {
  id: string;
  nome: string;
  companhiaAerea: string;
  logo: string;
  custoMilhas: number;
  custoTaxas: number;
  disponibilidade: "alta" | "media" | "baixa";
  tempoAntecedencia: string;
  beneficios: string[];
  categoria: "premium" | "executivo" | "economico";
  rating: number;
  parceiros: string[];
  source: string;
  currency: string;
  originIata: string;
  destinationIata: string;
}

export default function MilesProgramsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados vindos da navegação
  const { origem, destino, dataIda, dataVolta } = location.state || {};
  
  const [programs, setPrograms] = useState<MilesProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [error, setError] = useState<string | null>(null);

  // Função para mapear dados da API para interface local
  const mapApiDataToPrograms = (apiData: SearchMileageProgramsResponse): MilesProgram[] => {
    const sourceToCompany: Record<string, string> = {
      'latam': 'LATAM Airlines',
      'azul': 'Azul Linhas Aéreas', 
      'gol': 'GOL Linhas Aéreas',
      'tap': 'TAP Air Portugal',
      'default': 'Companhia Aérea'
    };

    return apiData.map((item, index) => {
      const companhiaAerea = sourceToCompany[item.source.toLowerCase()] || sourceToCompany['default'];
      
      // Determina categoria baseada no preço (econômico é o mais barato disponível)
      let categoria: "premium" | "executivo" | "economico" = "economico";
      let custoMilhas = item.economy.price;
      let custoTaxas = item.economy.taxes / 100; // Divide por 100 pois vem em centavos

      if (item.business.price > 0 && item.business.price < item.first.price) {
        categoria = "executivo";
        custoMilhas = item.business.price;
        custoTaxas = item.business.taxes / 100; // Divide por 100 pois vem em centavos
      }
      
      if (item.first.price > 0) {
        categoria = "premium";
        custoMilhas = item.first.price;
        custoTaxas = item.first.taxes / 100; // Divide por 100 pois vem em centavos
      }

      return {
        id: item.id,
        nome: item.source.charAt(0).toUpperCase() + item.source.slice(1).toLowerCase(), // Capitaliza primeira letra
        companhiaAerea,
        logo: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
        custoMilhas,
        custoTaxas,
        disponibilidade: (index % 3 === 0 ? "alta" : index % 2 === 0 ? "media" : "baixa") as "alta" | "media" | "baixa",
        tempoAntecedencia: categoria === "premium" ? "90 dias" : categoria === "executivo" ? "45 dias" : "30 dias",
        beneficios: categoria === "premium" 
          ? ["Lounge access", "Bagagem extra", "Refeições premium"]
          : categoria === "executivo"
          ? ["Upgrade gratuito", "Embarque prioritário", "Milhas não expiram"]
          : ["Bagagem grátis", "Assento preferencial", "Cancelamento flexível"],
        categoria,
        rating: 4.0 + Math.random() * 0.7, // Rating entre 4.0 e 4.7
        parceiros: categoria === "premium" 
          ? ["Star Alliance", "Livelo"]
          : ["Multiplus", "Livelo", "Esfera"],
        source: item.source,
        currency: item.currency,
        originIata: item.originIata,
        destinationIata: item.destiantionIata
      } as MilesProgram;
    });
  };

  // Carregar programas de milhas
  useEffect(() => {
    const loadMilesPrograms = async () => {
      if (!origem || !destino || !dataIda) {
        setError('Dados de busca incompletos');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const requestBody: SearchMileageProgramsBody = {
          origin: origem,
          destination: destino,
          departure: dataIda
        };
        
        const response = await FlightService.searchMilesPrograms(requestBody);
        const mappedPrograms = mapApiDataToPrograms(response);
        setPrograms(mappedPrograms);
      } catch (err) {
        console.error('Erro ao carregar programas de milhas:', err);
        setError('Erro ao carregar programas de milhas. Tente novamente.');
        // Fallback para dados mock em caso de erro
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    loadMilesPrograms();
  }, [origem, destino, dataIda]);

  const categorias = [
    { id: "todos", label: "Todos", color: "gray" },
    { id: "economico", label: "Econômico", color: "green" },
    { id: "executivo", label: "Executivo", color: "blue" },
    { id: "premium", label: "Premium", color: "purple" }
  ];

  const programsFiltrados = programs.filter(program => 
    filtroCategoria === "todos" || program.categoria === filtroCategoria
  );

  const getDisponibilidadeColor = (disponibilidade: string) => {
    switch (disponibilidade) {
      case "alta": return "text-green-600 bg-green-100";
      case "media": return "text-yellow-600 bg-yellow-100";
      case "baixa": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "economico": return "text-green-600 bg-green-100";
      case "executivo": return "text-blue-600 bg-blue-100";
      case "premium": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Força interpretação como data local para evitar problemas de timezone
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSelectProgram = (program: MilesProgram) => {
    navigate("/resultados-milhas", {
      state: {
        origem,
        destino,
        dataIda,
        dataVolta,
        programa: {
          id: program.id,
          nome: program.nome,
          source: program.source,
          companhiaAerea: program.companhiaAerea
        }
      }
    });
  };

  return (
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-28">
        {/* Header da rota */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-econotrip-blue to-econotrip-orange p-4 rounded-2xl text-white mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Star className="h-6 w-6" />
              <h1 className="text-xl font-bold">Programas de Milhas</h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">
                {origem} → {destino}
              </span>
            </div>
            {dataIda && (
              <div className="flex items-center justify-center gap-2 mt-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {formatDate(dataIda)} {dataVolta && `• ${formatDate(dataVolta)}`}
                </span>
              </div>
            )}
          </div>
          
          <p className="text-center text-gray-600">
            Escolha o programa de milhas para ver as opções disponíveis
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setFiltroCategoria(categoria.id)}
                className={`px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
                  filtroCategoria === categoria.id
                    ? "border-econotrip-orange bg-econotrip-orange text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-econotrip-orange"
                }`}
              >
                {categoria.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lista de Programas */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-econotrip-orange animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando programas de milhas...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Erro ao carregar programas
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {programsFiltrados.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Header do programa */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Plane className="h-6 w-6 text-econotrip-blue" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-econotrip-blue">
                            {program.nome}
                          </h3>
                          <Badge className={getCategoriaColor(program.categoria)}>
                            {program.categoria}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {program.companhiaAerea}
                        </p>
                      </div>
                    </div>

                    {/* Informações principais */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-econotrip-orange" />
                          <span className="text-xs text-gray-600">Milhas</span>
                        </div>
                        <p className="text-lg font-bold text-econotrip-blue">
                          {program.custoMilhas.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-xs text-gray-600">+ Taxas</span>
                        </div>
                        <p className="text-lg font-bold text-econotrip-orange">
                          {program.currency === 'USD' ? '$' : 'R$'} {program.custoTaxas.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Botão de ação */}
                    <Button
                      variant="primary"
                      onClick={() => handleSelectProgram(program)}
                      className="w-full h-12 text-lg"
                      icon={ArrowRight}
                    >
                      Ver voos disponíveis
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && programsFiltrados.length === 0 && programs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum programa encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros para ver mais opções
            </p>
          </motion.div>
        )}

        {!loading && !error && programs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum programa disponível
            </h3>
            <p className="text-gray-500">
              Não há programas de milhas disponíveis para esta rota no momento
            </p>
          </motion.div>
        )}
      </div>
  );
}
