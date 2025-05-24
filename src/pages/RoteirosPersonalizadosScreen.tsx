
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Mountain, Building, Heart, MapPin, Clock, DollarSign, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Roteiro {
  id: string;
  titulo: string;
  destino: string;
  descricao: string;
  duracao: string;
  preco: string;
  categoria: string;
  imagem: string;
  destaques: string[];
}

export default function RoteirosPersonalizadosScreen() {
  const navigate = useNavigate();
  const [preferenciasUsuario, setPreferenciasUsuario] = useState<string[]>([]);

  useEffect(() => {
    const perfilSalvo = localStorage.getItem("econotrip_perfil_viajante");
    if (perfilSalvo) {
      const perfil = JSON.parse(perfilSalvo);
      setPreferenciasUsuario(perfil.preferencias || []);
    }
  }, []);

  const roteiros: Roteiro[] = [
    {
      id: "1",
      titulo: "Serra Gaúcha Relaxante",
      destino: "Gramado e Canela",
      descricao: "Roteiro pensado para conforto, com pouca caminhada e muitas paisagens lindas",
      duracao: "4 dias / 3 noites",
      preco: "R$ 1.200",
      categoria: "natureza",
      imagem: "🏔️",
      destaques: ["Bondinho aéreo", "Vinícolas", "Chocolate artesanal", "Hotel confortável"],
    },
    {
      id: "2",
      titulo: "Minas Gerais Cultural",
      destino: "Ouro Preto e Tiradentes",
      descricao: "Explore a história do Brasil com conforto e segurança",
      duracao: "5 dias / 4 noites",
      preco: "R$ 980",
      categoria: "cultura",
      imagem: "🏛️",
      destaques: ["Museus adaptados", "Guia especializado", "Gastronomia mineira", "Transporte confortável"],
    },
    {
      id: "3",
      titulo: "Caldas Novas Wellness",
      destino: "Caldas Novas",
      descricao: "Relaxamento total em águas termais terapêuticas",
      duracao: "3 dias / 2 noites",
      preco: "R$ 1.100",
      categoria: "descanso",
      imagem: "♨️",
      destaques: ["Águas termais", "Spa completo", "Massoterapia", "Refeições inclusas"],
    },
    {
      id: "4",
      titulo: "Salvador Gastronômico",
      destino: "Salvador",
      descricao: "Sabores únicos da Bahia em restaurantes selecionados",
      duracao: "4 dias / 3 noites",
      preco: "R$ 1.400",
      categoria: "gastronomia",
      imagem: "🍤",
      destaques: ["Aula de culinária", "Mercado Modelo", "Pelourinho", "Restaurantes típicos"],
    },
  ];

  const roteirsFiltrados = preferenciasUsuario.length > 0 
    ? roteiros.filter(r => preferenciasUsuario.includes(r.categoria))
    : roteiros;

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "natureza": return Mountain;
      case "cultura": return Building;
      case "descanso": return Heart;
      default: return MapPin;
    }
  };

  const handleSelectRoteiro = (roteiro: Roteiro) => {
    // Aqui você pode implementar a navegação para detalhes do roteiro
    // ou integrar com a busca de voos
    navigate("/busca-voos", { 
      state: { 
        destinoSugerido: roteiro.destino,
        roteiroId: roteiro.id 
      } 
    });
  };

  return (
    <div className="max-w-xl mx-auto pb-24">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
        </button>
        <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
          Roteiros Personalizados
        </h1>
      </div>

      {preferenciasUsuario.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-4 bg-econotrip-blue/5">
            <p className="text-econotrip-blue font-medium">
              ✨ Roteiros selecionados com base no seu perfil
            </p>
          </Card>
        </motion.div>
      )}

      <div className="space-y-6">
        {roteirsFiltrados.map((roteiro, index) => {
          const Icon = getCategoryIcon(roteiro.categoria);
          
          return (
            <motion.div
              key={roteiro.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{roteiro.imagem}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-econotrip-blue" />
                      <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue">
                        {roteiro.titulo}
                      </h2>
                    </div>
                    <p className="text-gray-600 mb-2">{roteiro.descricao}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {roteiro.destino}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {roteiro.duracao}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {roteiro.preco}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-econotrip-blue mb-2">Destaques do roteiro:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {roteiro.destaques.map((destaque, i) => (
                      <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-econotrip-orange rounded-full"></span>
                        {destaque}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleSelectRoteiro(roteiro)}
                  className="w-full"
                >
                  Ver disponibilidade
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {roteirsFiltrados.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Complete seu perfil de viajante para ver sugestões personalizadas!
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/perfil")}
          >
            Completar perfil
          </Button>
        </Card>
      )}
    </div>
  );
}
