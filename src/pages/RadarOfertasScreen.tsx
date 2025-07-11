import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  MapPin,
  Clock,
  Star,
  Plane,
  Tag,
  Heart,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { SustainableBadge } from "@/components/sustainable/SustainableBadge";
import { RadarService } from "@/api/radar/RadarService";
import { useAuthStore } from "@/stores/authStore";
import { DatasDisponiveisModal } from "@/components/roteiro/DatasDisponiveisModal";

interface Oferta {
  id: string;
  destino: string;
  origem: string;
  preco: number;
  precoOriginal: number;
  desconto: number;
  dataLimite: string;
  categoria: "promocao" | "milhas" | "lastminute" | "sustentavel";
  avaliacao: number;
  imagem: string;
  isSustentavel: boolean;
  pontosMilhas?: number;
}

const mockOfertas: Oferta[] = [
  {
    id: "1",
    destino: "Lisboa",
    origem: "São Paulo",
    preco: 1890,
    precoOriginal: 2350,
    desconto: 20,
    dataLimite: "2024-01-20",
    categoria: "promocao",
    avaliacao: 4.8,
    imagem: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
    isSustentavel: true,
  },
  {
    id: "2",
    destino: "Madrid",
    origem: "Rio de Janeiro",
    preco: 2100,
    precoOriginal: 2800,
    desconto: 25,
    dataLimite: "2024-01-25",
    categoria: "lastminute",
    avaliacao: 4.6,
    imagem: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
    isSustentavel: false,
    pontosMilhas: 35000,
  },
  {
    id: "3",
    destino: "Paris",
    origem: "Brasília",
    preco: 2200,
    precoOriginal: 2900,
    desconto: 24,
    dataLimite: "2024-01-30",
    categoria: "milhas",
    avaliacao: 4.9,
    imagem: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
    isSustentavel: true,
    pontosMilhas: 42000,
  },
];

export default function RadarOfertasScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuthStore();
  // Recebe o radarId ou novoRadar da navegação
  const radarId = location.state?.radarId;
  const novoRadar = location.state?.novoRadar;

  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [favoritadas, setFavoritadas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !radarId) return;
    setLoading(true);
    RadarService.getFlights(token, radarId)
      .then((res) => {
        // Adapte para o formato de Oferta se necessário
        const ofertasConvertidas = res.results.map((item, idx) => ({
          id: String(idx),
          destino: item.destination,
          origem: item.origin,
          preco: item.value,
          precoOriginal: item.value, // ou outro campo se houver
          desconto: 0,
          dataLimite: item.date,
          categoria: "promocao" as const,
          avaliacao: 5,
          imagem: "/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png",
          isSustentavel: false,
        }));
        setOfertas(ofertasConvertidas);
      })
      .catch(() => setOfertas([]))
      .finally(() => setLoading(false));
  }, [token, radarId]);

  // Agrupa ofertas por preço
  const ofertasPorPreco: Record<number, Oferta[]> = {};
  ofertas.forEach((oferta) => {
    if (!ofertasPorPreco[oferta.preco]) ofertasPorPreco[oferta.preco] = [];
    ofertasPorPreco[oferta.preco].push(oferta);
  });
  const precosOrdenados = Object.keys(ofertasPorPreco).map(Number).sort((a, b) => a - b);

  const [modalDatas, setModalDatas] = useState<{ preco: number; datas: string[] } | null>(null);

  const handleFavoritar = (ofertaId: string) => {
    const novasFavoritadas = new Set(favoritadas);
    if (novasFavoritadas.has(ofertaId)) {
      novasFavoritadas.delete(ofertaId);
    } else {
      novasFavoritadas.add(ofertaId);
    }
    setFavoritadas(novasFavoritadas);
  };

  const handleVerOferta = (oferta: Oferta) => {
    navigate("/busca-voos", {
      state: {
        origem: oferta.origem,
        destino: oferta.destino,
        ofertaId: oferta.id
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
          <div className="p-3 bg-econotrip-orange/10 rounded-2xl">
            <Radar className="h-8 w-8 text-econotrip-orange" />
          </div>
          <h1 className="text-2xl font-bold text-econotrip-blue">
            Radar de Ofertas
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Ofertas personalizadas para você
        </p>
      </motion.div>

      {/* Lista de Ofertas agrupadas por preço */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {precosOrdenados.map((preco) => {
          const grupo = ofertasPorPreco[preco];
          if (!grupo.length) return null;
          const primeira = grupo[0];
          return (
            <Card key={preco} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header da oferta */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-econotrip-blue" />
                      <span className="text-lg font-semibold text-econotrip-blue">
                        {primeira.origem} → {primeira.destino}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFavoritar(primeira.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Favoritar oferta"
                  >
                    <Heart
                      className={`h-6 w-6 ${favoritadas.has(primeira.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
                {/* Preço */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-econotrip-orange">
                      R$ {preco.toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* Badges e informações */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {primeira.isSustentavel && <SustainableBadge type="carbon" />}
                  {primeira.pontosMilhas && (
                    <Badge variant="outline" className="border-econotrip-blue text-econotrip-blue">
                      <Star className="h-3 w-3 mr-1" />
                      {primeira.pontosMilhas.toLocaleString()} milhas
                    </Badge>
                  )}
                </div>
                {/* Botão de ação */}
                <Button
                  variant="primary"
                  onClick={() => setModalDatas({ preco, datas: grupo.map(o => o.dataLimite) })}
                  className="w-full h-12 text-lg"
                >
                  Mostrar datas disponíveis
                </Button>
              </div>
            </Card>
          );
        })}
      </motion.div>
      {modalDatas && (
        <DatasDisponiveisModal
          isOpen={!!modalDatas}
          onClose={() => setModalDatas(null)}
          preco={modalDatas.preco}
          datas={modalDatas.datas}
          origem={ofertas.length > 0 ? ofertas[0].origem : ""}
          destino={ofertas.length > 0 ? ofertas[0].destino : ""}
        />
      )}

      {ofertas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="p-4 bg-econotrip-orange/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8 text-econotrip-orange" />
          </div>
          <h3 className="text-lg font-medium text-econotrip-blue mb-3">
            Aguarde, estamos processando seu radar
          </h3>
          <div className="space-y-3 text-gray-600 max-w-sm mx-auto">
            <p className="text-sm">
              <strong>Radar recém-criado?</strong> As ofertas podem demorar até <strong>1 hora</strong> para começar a aparecer.
            </p>
            <p className="text-sm">
              Se após esse período ainda não houver ofertas, recomendamos <strong>ajustar os parâmetros do radar</strong> (datas, destinos ou valor limite).
            </p>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Radar className="h-5 w-5 text-econotrip-blue" />
              <span className="text-sm font-medium text-econotrip-blue">Dica</span>
            </div>
            <p className="text-xs text-gray-600">
              Radares com parâmetros mais flexíveis tendem a encontrar mais ofertas
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
