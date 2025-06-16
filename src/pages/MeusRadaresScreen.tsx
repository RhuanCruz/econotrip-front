import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Plus, Radar } from "lucide-react";
import { NovoRadarModal } from "@/components/roteiro/NovoRadarModal";
import { RadarService } from "@/api/radar/RadarService";
import { useAuthStore } from "@/stores/authStore";
import { isTokenValid } from "@/utils/tokenUtils";

export default function MeusRadaresScreen() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [radares, setRadares] = useState([]);
  const { token } = useAuthStore();

  React.useEffect(() => {
    if (!token || !isTokenValid(token)) {
      navigate("/login");
      return;
    }
    RadarService.list(token)
      .then((res) => setRadares(res.records))
      .catch(() => setRadares([]));
  }, [token, navigate]);

  const handleNovoRadar = () => {
    setModalOpen(true);
  };

  const handleCreateRadar = (data: { partida: string; destino: string; inicio: string; fim: string; milhas: boolean }) => {
    setModalOpen(false);
    // Aqui você pode adicionar lógica para salvar o novo radar
    // e navegar para RadarOfertasScreen, se desejar
    navigate("/radar-ofertas", { state: { novoRadar: true, ...data } });
  };

  const handleAbrirRadar = (radarId: string) => {
    navigate("/radar-ofertas", { state: { radarId } });
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-econotrip-blue flex items-center gap-2">
          <Radar className="h-7 w-7 text-econotrip-orange" />
          Meus Radares
        </h1>
        <button
          onClick={handleNovoRadar}
          className="h-11 w-11 flex items-center justify-center rounded-full bg-econotrip-blue hover:bg-econotrip-blue/90 transition-colors shadow-md"
          aria-label="Adicionar novo radar"
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="space-y-4">
        {radares.map((radar) => (
          <button
            key={radar.id}
            onClick={() => handleAbrirRadar(radar.id)}
            className="w-full text-left bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <Radar className="h-5 w-5 text-econotrip-orange" />
              <span className="font-semibold text-lg text-econotrip-blue">
                {radar.origin} → {radar.destination}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              Período: {radar.start && radar.end ? `${new Date(radar.start).toLocaleDateString()} até ${new Date(radar.end).toLocaleDateString()}` : "-"}
            </div>
            <div className="text-xs text-gray-500">
              {/* Se houver campo de milhas, exiba aqui. Caso contrário, remova ou adapte conforme backend */}
              {/* {radar.milhas ? "Busca por milhas" : "Busca por dinheiro"} */}
            </div>
          </button>
        ))}
      </div>
      <NovoRadarModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateRadar}
      />
    </div>
  );
}
