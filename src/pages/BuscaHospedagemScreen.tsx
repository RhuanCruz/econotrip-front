import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Hotel, Bed, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { redirectToBooking, validateDates, calculateNights } from "@/services/bookingUrlBuilder";
import { HospedagemSearchParams } from "@/types/hospedagem";

export default function BuscaHospedagemScreen() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [cidade, setCidade] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [criancas, setCriancas] = useState(0);
  const [quartos, setQuartos] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBuscar = () => {
    // Validações
    const newErrors: Record<string, string> = {};

    if (!cidade.trim()) {
      newErrors.cidade = "Digite o nome da cidade";
    }

    if (!checkIn) {
      newErrors.checkIn = "Selecione a data de check-in";
    }

    if (!checkOut) {
      newErrors.checkOut = "Selecione a data de check-out";
    }

    if (checkIn && checkOut && !validateDates(checkIn, checkOut)) {
      newErrors.checkOut = "Check-out deve ser após o check-in";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Construir objeto de busca
    const searchParams: HospedagemSearchParams = {
      cidade,
      checkIn,
      checkOut,
      adultos,
      criancas,
      quartos,
    };

    // Redirecionar para Booking.com
    redirectToBooking(searchParams);
  };

  // Calcular número de noites
  const nights = checkIn && checkOut && validateDates(checkIn, checkOut)
    ? calculateNights(checkIn, checkOut)
    : 0;

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 bg-econotrip-coral/10 rounded-2xl">
            <Hotel className="h-8 w-8 text-econotrip-coral" />
          </div>
          <h1 className="text-2xl font-bold text-econotrip-blue">
            Buscar Hospedagem
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Encontre os melhores hotéis e acomodações
        </p>
      </motion.div>

      {/* Formulário de Busca */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <form className="space-y-5">
            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1 text-econotrip-coral" />
                Cidade de destino *
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value);
                  if (errors.cidade) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.cidade;
                      return newErrors;
                    });
                  }
                }}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-coral/20 focus:border-econotrip-coral ${
                  errors.cidade ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: São Paulo, Rio de Janeiro..."
              />
              {errors.cidade && (
                <p className="mt-1 text-sm text-red-600">{errors.cidade}</p>
              )}
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1 text-econotrip-coral" />
                  Check-in *
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (errors.checkIn) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.checkIn;
                        return newErrors;
                      });
                    }
                  }}
                  min={todayStr}
                  className={`w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-coral/20 focus:border-econotrip-coral ${
                    errors.checkIn ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.checkIn && (
                  <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1 text-econotrip-coral" />
                  Check-out *
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => {
                    setCheckOut(e.target.value);
                    if (errors.checkOut) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.checkOut;
                        return newErrors;
                      });
                    }
                  }}
                  min={checkIn || todayStr}
                  className={`w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-coral/20 focus:border-econotrip-coral ${
                    errors.checkOut ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.checkOut && (
                  <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
                )}
              </div>
            </div>

            {/* Info de noites */}
            {nights > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-econotrip-blue">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Estadia de <strong>{nights}</strong> {nights === 1 ? 'noite' : 'noites'}
                </p>
              </div>
            )}

            {/* Hóspedes e Quartos */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-econotrip-coral" />
                  <span className="text-sm font-medium text-gray-700">Adultos</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdultos(Math.max(1, adultos - 1))}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold text-gray-700 w-8 text-center">{adultos}</span>
                  <button
                    type="button"
                    onClick={() => setAdultos(adultos + 1)}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-econotrip-coral" />
                  <span className="text-sm font-medium text-gray-700">Crianças</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCriancas(Math.max(0, criancas - 1))}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold text-gray-700 w-8 text-center">{criancas}</span>
                  <button
                    type="button"
                    onClick={() => setCriancas(criancas + 1)}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-econotrip-coral" />
                  <span className="text-sm font-medium text-gray-700">Quartos</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuartos(Math.max(1, quartos - 1))}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold text-gray-700 w-8 text-center">{quartos}</span>
                  <button
                    type="button"
                    onClick={() => setQuartos(quartos + 1)}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Botão de Buscar */}
            <Button
              type="button"
              onClick={handleBuscar}
              variant="primary"
              className="w-full h-12 text-lg bg-econotrip-coral hover:bg-econotrip-coral/90 flex items-center justify-center gap-2"
            >
              Buscar Hospedagens
            </Button>
          </form>

          {/* Nota informativa sobre redirecionamento */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>📌 Nota:</strong> Você será redirecionado para o Booking.com com sua busca já preenchida.
              Compare preços e reserve com segurança!
            </p>
          </div>
        </Card>

        {/* Dicas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <h3 className="text-sm font-semibold text-econotrip-blue mb-2">💡 Dicas para economizar:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Reserve com antecedência para melhores preços</li>
            <li>• Considere ficar um pouco fora do centro turístico</li>
            <li>• Verifique se o café da manhã está incluído</li>
            <li>• Leia as avaliações de outros hóspedes</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
