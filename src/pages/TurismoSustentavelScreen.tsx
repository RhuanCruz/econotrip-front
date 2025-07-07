
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Recycle,
  TreePine,
  Heart,
  Award,
  MapPin,
  Star,
  ArrowRight,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { SustainableBadge } from "@/components/sustainable/SustainableBadge";

interface DestinoSustentavel {
  id: string;
  nome: string;
  pais: string;
  imagem: string;
  nivelSustentabilidade: "bronze" | "prata" | "ouro";
  iniciativas: string[];
  avaliacaoAmbiental: number;
  descricao: string;
  certificacoes: string[];
}

const destinosSustentaveis: DestinoSustentavel[] = [
  {
    id: "1",
    nome: "Costa Rica",
    pais: "Costa Rica",
    imagem: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
    nivelSustentabilidade: "ouro",
    iniciativas: [
      "100% energia renovável",
      "Proteção da biodiversidade",
      "Turismo de baixo impacto",
      "Certificação sustentável"
    ],
    avaliacaoAmbiental: 4.9,
    descricao: "Líder mundial em turismo sustentável e conservação ambiental.",
    certificacoes: ["ISO 14001", "Green Globe", "Carbon Neutral"]
  },
  {
    id: "2",
    nome: "Noruega",
    pais: "Noruega",
    imagem: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
    nivelSustentabilidade: "ouro",
    iniciativas: [
      "Transporte público elétrico",
      "Hotéis eco-friendly",
      "Preservação de fiordes",
      "Zero emissões até 2030"
    ],
    avaliacaoAmbiental: 4.8,
    descricao: "Natureza preservada e compromisso com sustentabilidade.",
    certificacoes: ["Nordic Swan", "EU Ecolabel"]
  },
  {
    id: "3",
    nome: "Nova Zelândia",
    pais: "Nova Zelândia",
    imagem: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
    nivelSustentabilidade: "prata",
    iniciativas: [
      "Turismo regenerativo",
      "Proteção da fauna nativa",
      "Agricultura orgânica",
      "Energia limpa"
    ],
    avaliacaoAmbiental: 4.7,
    descricao: "Paisagens únicas com foco em turismo responsável.",
    certificacoes: ["Qualmark Green", "EarthCheck"]
  }
];

const iniciativasGlobais = [
  {
    titulo: "Programa de Compensação de Carbono",
    descricao: "Neutralize suas emissões de CO₂ automaticamente em cada voo",
    icon: Leaf,
    cor: "text-green-600"
  },
  {
    titulo: "Parceria com Hotéis Sustentáveis",
    descricao: "Hospede-se apenas em acomodações certificadas ambientalmente",
    icon: Award,
    cor: "text-blue-600"
  },
  {
    titulo: "Turismo de Impacto Positivo",
    descricao: "Atividades que contribuem para as comunidades locais",
    icon: Heart,
    cor: "text-red-500"
  },
  {
    titulo: "Reflorestamento Global",
    descricao: "Plantamos uma árvore a cada 1000 milhas voadas",
    icon: TreePine,
    cor: "text-green-700"
  }
];

export default function TurismoSustentavelScreen() {
  const navigate = useNavigate();
  const [destinoSelecionado, setDestinoSelecionado] = useState<string | null>(null);

  const getNivelCor = (nivel: string) => {
    switch (nivel) {
      case "ouro": return "text-yellow-600 bg-yellow-100";
      case "prata": return "text-gray-600 bg-gray-100";
      case "bronze": return "text-amber-600 bg-amber-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleBuscarDestino = (destino: DestinoSustentavel) => {
    navigate("/busca-voos", {
      state: {
        destino: destino.nome,
        sustentavel: true
      }
    });
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-4 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 bg-econotrip-green/10 rounded-2xl">
            <Leaf className="h-8 w-8 text-econotrip-green" />
          </div>
          <h1 className="text-2xl font-bold text-econotrip-blue">
            Turismo Sustentável
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Viaje com consciência ambiental
        </p>
      </motion.div>

      {/* Iniciativas Globais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6 bg-gradient-to-r from-econotrip-green/5 to-econotrip-blue/5">
          <h2 className="text-xl font-semibold text-econotrip-blue mb-4 flex items-center gap-2">
            <Recycle className="h-6 w-6" />
            Nossas Iniciativas
          </h2>
          <div className="space-y-4">
            {iniciativasGlobais.map((iniciativa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white rounded-lg"
              >
                <div className={`p-2 rounded-lg ${iniciativa.cor.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100').replace('-700', '-100')}`}>
                  <iniciativa.icon className={`h-5 w-5 ${iniciativa.cor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-econotrip-blue">
                    {iniciativa.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {iniciativa.descricao}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Destinos Sustentáveis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold text-econotrip-blue mb-4 flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Destinos Certificados
        </h2>

        <div className="space-y-4">
          {destinosSustentaveis.map((destino, index) => (
            <motion.div
              key={destino.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header do destino */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-econotrip-blue mb-1">
                        {destino.nome}
                      </h3>
                      <p className="text-gray-600">{destino.pais}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {destino.avaliacaoAmbiental}/5.0 sustentabilidade
                        </span>
                      </div>
                    </div>

                    <Badge className={`${getNivelCor(destino.nivelSustentabilidade)} border-0`}>
                      <Award className="h-3 w-3 mr-1" />
                      {destino.nivelSustentabilidade.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-700 mb-4">{destino.descricao}</p>

                  {/* Iniciativas */}
                  <div className="mb-4">
                    <h4 className="font-medium text-econotrip-blue mb-2 text-sm">
                      Iniciativas Sustentáveis:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {destino.iniciativas.map((iniciativa, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-econotrip-green text-econotrip-green"
                        >
                          {iniciativa}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certificações */}
                  <div className="mb-4">
                    <h4 className="font-medium text-econotrip-blue mb-2 text-sm">
                      Certificações:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {destino.certificacoes.map((cert, idx) => (
                        <SustainableBadge key={idx} type="carbon" />
                      ))}
                    </div>
                  </div>

                  {/* Botão de ação */}
                  <Button
                    variant="primary"
                    onClick={() => handleBuscarDestino(destino)}
                    className="w-full h-12"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Buscar voos sustentáveis
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Informações adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 border-econotrip-blue/20 bg-econotrip-blue/5">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-econotrip-blue mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-econotrip-blue mb-2">
                Compromisso EconoTrip
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Estamos comprometidos em reduzir o impacto ambiental das viagens.
                Todos os voos incluem compensação automática de carbono, e trabalhamos
                apenas com parceiros certificados em sustentabilidade.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
