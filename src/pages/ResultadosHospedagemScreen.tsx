import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, Star, MapPin, Check, ExternalLink, Heart, Wifi, Coffee, ParkingCircle } from "lucide-react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { AccommodationService } from "@/api/accommodation/AccommodationService";
import { useAuthStore } from "@/stores/authStore";
import type { Accommodation } from "@/api/accommodation/types";

export default function ResultadosHospedagemScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const searchParams = location.state as {
    cidade: string;
    checkIn: string;
    checkOut: string;
    adultos: number;
    criancas: number;
    quartos: number;
  };

  const [hospedagens, setHospedagens] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritadas, setFavoritadas] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!searchParams || !token) {
      navigate("/busca-hospedagem");
      return;
    }

    setLoading(true);
    AccommodationService.search(token, {
      city: searchParams.cidade,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      adults: searchParams.adultos,
      children: searchParams.criancas,
      rooms: searchParams.quartos,
    })
      .then((res) => {
        setHospedagens(res.results);
      })
      .catch((err) => {
        console.error("Erro ao buscar hospedagens:", err);
        // Mock data para demonstração
        setHospedagens(mockHospedagens);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams, token, navigate]);

  const handleFavoritar = (id: string) => {
    const novasFavoritadas = new Set(favoritadas);
    if (novasFavoritadas.has(id)) {
      novasFavoritadas.delete(id);
    } else {
      novasFavoritadas.add(id);
    }
    setFavoritadas(novasFavoritadas);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const calculateNoites = () => {
    if (!searchParams) return 0;
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  if (!searchParams) {
    return null;
  }

  const noites = calculateNoites();

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-econotrip-blue mb-2">
          Hospedagens em {searchParams.cidade}
        </h1>
        <p className="text-gray-600">
          {searchParams.checkIn && new Date(searchParams.checkIn).toLocaleDateString('pt-BR')} -{' '}
          {searchParams.checkOut && new Date(searchParams.checkOut).toLocaleDateString('pt-BR')} ({noites}{' '}
          {noites === 1 ? 'noite' : 'noites'})
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {searchParams.adultos} {searchParams.adultos === 1 ? 'adulto' : 'adultos'}
          {searchParams.criancas > 0 && `, ${searchParams.criancas} ${searchParams.criancas === 1 ? 'criança' : 'crianças'}`}
          {' • '} {searchParams.quartos} {searchParams.quartos === 1 ? 'quarto' : 'quartos'}
        </p>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-econotrip-coral border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Buscando as melhores opções...</p>
        </div>
      )}

      {/* Lista de Hospedagens */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {hospedagens.length === 0 && (
            <div className="text-center py-12">
              <Hotel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhuma hospedagem encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar seus critérios de busca
              </p>
              <Button onClick={() => navigate("/busca-hospedagem")} variant="outline">
                Nova Busca
              </Button>
            </div>
          )}

          {hospedagens.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagem */}
              {hotel.images && hotel.images.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleFavoritar(hotel.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    aria-label="Favoritar"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favoritadas.has(hotel.id) ? "text-red-500 fill-current" : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>
              )}

              <div className="p-5">
                {/* Nome e Rating */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-econotrip-blue">{hotel.name}</h3>
                    {hotel.rating >= 7 && (
                      <Badge className="bg-econotrip-green text-white shrink-0">
                        {hotel.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.address}</span>
                  </div>
                </div>

                {/* Amenidades */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Preço e Ação */}
                <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">A partir de</p>
                    <p className="text-2xl font-bold text-econotrip-coral">
                      {formatCurrency(hotel.price.amount)}
                    </p>
                    <p className="text-xs text-gray-500">por noite</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-econotrip-coral hover:bg-econotrip-coral/90"
                    onClick={() => {
                      if (hotel.bookingUrl) {
                        window.open(hotel.bookingUrl, '_blank');
                      }
                    }}
                  >
                    Ver Detalhes
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Helper para ícones de amenidades
function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) {
    return <Wifi className="h-3 w-3" />;
  }
  if (lower.includes('café') || lower.includes('breakfast')) {
    return <Coffee className="h-3 w-3" />;
  }
  if (lower.includes('estacionamento') || lower.includes('parking')) {
    return <ParkingCircle className="h-3 w-3" />;
  }
  return <Check className="h-3 w-3" />;
}

// Mock data para demonstração
const mockHospedagens: Accommodation[] = [
  {
    id: "1",
    name: "Hotel Conforto Plus",
    type: "HOTEL",
    city: "São Paulo",
    country: "Brasil",
    address: "Av. Paulista, 1000",
    rating: 8.5,
    reviewScore: 8.5,
    reviewCount: 324,
    price: {
      currency: "BRL",
      amount: 250,
      perNight: true,
    },
    images: ["/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png"],
    amenities: ["Wi-Fi Grátis", "Café da Manhã", "Estacionamento", "Ar-Condicionado"],
    description: "Hotel confortável no coração de São Paulo",
  },
  {
    id: "2",
    name: "Pousada Vista Linda",
    type: "GUESTHOUSE",
    city: "São Paulo",
    country: "Brasil",
    address: "Rua das Flores, 234",
    rating: 9.2,
    reviewScore: 9.2,
    reviewCount: 128,
    price: {
      currency: "BRL",
      amount: 180,
      perNight: true,
    },
    images: ["/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png"],
    amenities: ["Wi-Fi Grátis", "Café da Manhã", "Piscina"],
    description: "Pousada aconchegante com excelente atendimento",
  },
];
