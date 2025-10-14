import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Search, Hotel, Bed } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";

export default function BuscaHospedagemScreen() {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];

  const [cidade, setCidade] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [criancas, setCriancas] = useState(0);
  const [quartos, setQuartos] = useState(1);

  const handleBuscar = () => {
    if (!cidade || !checkIn || !checkOut) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    navigate("/resultados-hospedagem", {
      state: {
        cidade,
        checkIn,
        checkOut,
        adultos,
        criancas,
        quartos,
      },
    });
  };

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
                Cidade de destino
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-coral/20 focus:border-econotrip-coral"
                placeholder="Ex: São Paulo, Rio de Janeiro..."
              />
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1 text-econotrip-coral" />
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={todayStr}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-coral/20 focus:border-econotrip-coral"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1 text-econotrip-coral" />
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || todayStr}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-coral/20 focus:border-econotrip-coral"
                />
              </div>
            </div>

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
              className="w-full h-12 text-lg bg-econotrip-coral hover:bg-econotrip-coral/90"
            >
              Buscar Hospedagem
            </Button>
          </form>
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
