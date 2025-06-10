
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Clock, 
  DollarSign, 
  Filter,
  ArrowRight,
  Search,
  Star,
  Accessibility,
  Leaf,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { SustainableBadge } from "@/components/sustainable/SustainableBadge";
import { toast } from "@/hooks/use-toast";

interface Voo {
  id: string;
  origem: string;
  origemCodigo: string;
  destino: string;
  destinoCodigo: string;
  dataIda: string;
  horaPartida: string;
  horaChegada: string;
  preco: number;
  duracao: string;
  paradas: number;
  companhia: string;
  isEco: boolean;
  isAcessivel: boolean;
  isMelhorPreco: boolean;
  pontuacao: number;
}

const mockVoos: Voo[] = [
  {
    id: "1",
    origem: "São Paulo",
    origemCodigo: "GRU",
    destino: "Lisboa",
    destinoCodigo: "LIS",
    dataIda: "15/03/2024",
    horaPartida: "23:50",
    horaChegada: "14:15+1",
    preco: 2350,
    duracao: "10h 25min",
    paradas: 0,
    companhia: "TAP",
    isEco: true,
    isAcessivel: false,
    isMelhorPreco: false,
    pontuacao: 4.8,
  },
  {
    id: "2",
    origem: "São Paulo",
    origemCodigo: "GRU",
    destino: "Lisboa",
    destinoCodigo: "LIS",
    dataIda: "15/03/2024",
    horaPartida: "09:20",
    horaChegada: "05:45+1",
    preco: 1980,
    duracao: "12h 25min",
    paradas: 1,
    companhia: "LATAM",
    isEco: false,
    isAcessivel: true,
    isMelhorPreco: true,
    pontuacao: 4.6,
  },
  {
    id: "3",
    origem: "São Paulo",
    origemCodigo: "GRU",
    destino: "Lisboa",
    destinoCodigo: "LIS",
    dataIda: "15/03/2024",
    horaPartida: "14:30",
    horaChegada: "06:20+1",
    preco: 2800,
    duracao: "11h 50min",
    paradas: 1,
    companhia: "Lufthansa",
    isEco: false,
    isAcessivel: true,
    isMelhorPreco: false,
    pontuacao: 4.7,
  },
];

export default function ResultsScreen() {
  const navigate = useNavigate();
  const [voos] = useState(mockVoos);
  const [ordenacao, setOrdenacao] = useState<"preco" | "duracao" | "pontuacao">("preco");

  const voosOrdenados = [...voos].sort((a, b) => {
    switch (ordenacao) {
      case "preco":
        return a.preco - b.preco;
      case "duracao":
        return parseInt(a.duracao) - parseInt(b.duracao);
      case "pontuacao":
        return b.pontuacao - a.pontuacao;
      default:
        return 0;
    }
  });

  const handleVerDetalhes = (voo: Voo) => {
    toast({
      title: "Carregando detalhes...",
      description: `Voo ${voo.companhia} ${voo.origemCodigo} → ${voo.destinoCodigo}`,
    });
    navigate("/detalhes-voo", { state: { vooId: voo.id } });
  };

  const handleNovaBusca = () => {
    navigate("/busca-voos");
  };

  const formatarParadas = (paradas: number) => {
    if (paradas === 0) return "Direto";
    if (paradas === 1) return "1 parada";
    return `${paradas} paradas`;
  };

  return (
    <LayoutBase>
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-econotrip-blue">
                Voos Encontrados
              </h1>
              <p className="text-gray-600">
                {voos.length} opções para sua viagem
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-econotrip-orange">
                GRU → LIS
              </div>
              <div className="text-sm text-gray-600">15 Mar 2024</div>
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "preco", label: "Menor preço", icon: DollarSign },
              { id: "duracao", label: "Menor tempo", icon: Clock },
              { id: "pontuacao", label: "Melhor avaliado", icon: Star },
            ].map((opcao) => (
              <button
                key={opcao.id}
                onClick={() => setOrdenacao(opcao.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
                  ordenacao === opcao.id
                    ? "border-econotrip-orange bg-econotrip-orange text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-econotrip-orange"
                }`}
              >
                <opcao.icon className="h-4 w-4" />
                {opcao.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lista de voos */}
        <div className="space-y-4 mb-6">
          {voosOrdenados.map((voo, index) => (
            <motion.div
              key={voo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer">
                <div className="p-6">
                  {/* Header do voo */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-econotrip-blue" />
                          <span className="font-semibold text-lg text-econotrip-blue">
                            {voo.companhia}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{voo.pontuacao}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {formatarParadas(voo.paradas)} • {voo.duracao}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-econotrip-orange">
                        R$ {voo.preco.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">por pessoa</div>
                    </div>
                  </div>

                  {/* Horários */}
                  <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-econotrip-blue">
                        {voo.horaPartida}
                      </div>
                      <div className="text-sm text-gray-600">{voo.origemCodigo}</div>
                      <div className="text-xs text-gray-500">{voo.origem}</div>
                    </div>
                    
                    <div className="flex-1 px-4">
                      <div className="flex items-center justify-center">
                        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                        <Plane className="h-5 w-5 text-econotrip-orange mx-2" />
                        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                      </div>
                      <div className="text-center text-xs text-gray-500 mt-1">
                        {voo.duracao}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-econotrip-blue">
                        {voo.horaChegada}
                      </div>
                      <div className="text-sm text-gray-600">{voo.destinoCodigo}</div>
                      <div className="text-xs text-gray-500">{voo.destino}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {voo.isEco && <SustainableBadge type="carbon" />}
                    
                    {voo.isAcessivel && (
                      <Badge variant="outline" className="border-econotrip-blue text-econotrip-blue">
                        <Accessibility className="h-3 w-3 mr-1" />
                        Acessível
                      </Badge>
                    )}
                    
                    {voo.isMelhorPreco && (
                      <Badge className="bg-econotrip-green text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Melhor preço
                      </Badge>
                    )}
                  </div>

                  {/* Botão ver detalhes */}
                  <Button
                    variant="primary"
                    onClick={() => handleVerDetalhes(voo)}
                    className="w-full h-12 text-lg"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Ver detalhes e reservar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Botão nova busca fixo */}
        <div className="fixed bottom-24 left-0 right-0 px-4 z-30">
          <div className="max-w-screen-sm mx-auto">
            <Button
              variant="secondary"
              onClick={handleNovaBusca}
              className="w-full h-14 text-lg shadow-lg border-2 border-econotrip-blue"
              icon={Search}
            >
              Nova Busca
            </Button>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
}
