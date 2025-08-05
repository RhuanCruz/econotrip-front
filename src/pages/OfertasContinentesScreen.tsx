import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Globe,
  MapPin
} from "lucide-react";
import { ScreenContainer } from "../components/layout/ScreenContainer";

const continentes = [
  {
    id: "europa",
    nome: "Europa",
    descricao: "Castelos medievais, arte renascentista e cultura milenar",
    imagem: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&h=400&fit=crop&crop=center",
    paises: ["França", "Itália", "Espanha", "Portugal", "Alemanha"],
    cor: "from-blue-500 to-purple-600"
  },
  {
    id: "america-sul",
    nome: "América do Sul",
    descricao: "Natureza exuberante, praias paradisíacas e aventuras",
    imagem: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=400&fit=crop&crop=center",
    paises: ["Brasil", "Argentina", "Chile", "Peru", "Colômbia"],
    cor: "from-green-500 to-teal-600"
  },
  {
    id: "america-norte",
    nome: "América do Norte",
    descricao: "Cidades cosmopolitas, parques nacionais e diversidade",
    imagem: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop&crop=center",
    paises: ["Estados Unidos", "Canadá", "México"],
    cor: "from-red-500 to-orange-600"
  },
  {
    id: "asia",
    nome: "Ásia",
    descricao: "Templos ancestrais, tecnologia e tradições milenares",
    imagem: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&h=400&fit=crop&crop=center",
    paises: ["Japão", "China", "Tailândia", "Índia", "Coreia do Sul"],
    cor: "from-yellow-500 to-red-600"
  },
  {
    id: "africa",
    nome: "África",
    descricao: "Safáris inesquecíveis, desertos e vida selvagem",
    imagem: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop&crop=center",
    paises: ["África do Sul", "Quênia", "Marrocos", "Egito", "Tanzânia"],
    cor: "from-orange-500 to-yellow-600"
  },
  {
    id: "oceania",
    nome: "Oceania",
    descricao: "Praias de águas cristalinas e natureza única",
    imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center",
    paises: ["Austrália", "Nova Zelândia", "Fiji"],
    cor: "from-cyan-500 to-blue-600"
  }
];

export default function OfertasContinentesScreen() {
  const navigate = useNavigate();

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

  const handleContinenteClick = (continente: typeof continentes[0]) => {
    // Navegar para a tela de voos por continente
    navigate(`/voos-continente/${continente.id}`);
  };

  return (
    <ScreenContainer>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={itemAnimation} className="mb-6">
              <div>
                <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
                  Ofertas por Continentes
                </h1>
                <p className="text-gray-600">Escolha seu destino dos sonhos</p>
              </div>
            </motion.div>

            {/* Grid de Continentes */}
            <motion.div variants={itemAnimation}>
              <div className="grid grid-cols-1 gap-4">
                {continentes.map((continente) => (
                  <motion.div
                    key={continente.id}
                    variants={itemAnimation}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="p-0 rounded-2xl shadow-lg bg-white border-0 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                      onClick={() => handleContinenteClick(continente)}
                    >
                      {/* Imagem do continente */}
                      <div className={`h-32 bg-gradient-to-r ${continente.cor} relative overflow-hidden`}>
                        <img 
                          src={continente.imagem} 
                          alt={`Vista de ${continente.nome}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute top-4 left-4">
                          <Globe className="h-8 w-8 text-white/90" />
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">{continente.nome}</h3>
                        </div>
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="p-4">
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                          {continente.descricao}
                        </p>
                        
                        {/* Países populares */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Destinos populares:</p>
                          <div className="flex flex-wrap gap-1">
                            {continente.paises.slice(0, 3).map((pais) => (
                              <span
                                key={pais}
                                className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-lg"
                              >
                                {pais}
                              </span>
                            ))}
                            {continente.paises.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-lg">
                                +{continente.paises.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Botão de ação */}
                        <button className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white rounded-xl px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                          <MapPin className="h-4 w-4" />
                          Ver Ofertas
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Informação adicional */}
            <motion.div variants={itemAnimation}>
              <Card className="p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-blue/10 rounded-2xl border-0">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-econotrip-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-econotrip-blue mb-2">
                    Encontre as melhores ofertas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Selecionamos as melhores oportunidades de viagem para cada continente. 
                    Clique em um continente para ver ofertas exclusivas!
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ScreenContainer>
  );
}
