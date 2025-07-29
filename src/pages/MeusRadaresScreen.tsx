import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Plus, Radar, X } from "lucide-react";
import { NovoRadarModal } from "@/components/roteiro/NovoRadarModal";
import { RadarService } from "@/api/radar/RadarService";
import { useAuthStore } from "@/stores/authStore";
import { StandardModal } from "@/components/ui-custom/StandardModal";
import { MeusRadaresSkeleton } from "@/components/ui-custom/MeusRadaresSkeleton";
import { RadaresEmptyState } from "@/components/ui-custom/RadaresEmptyState";

export default function MeusRadaresScreen() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [radares, setRadares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const { token } = useAuthStore();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await RadarService.list(token);
      setRadares(res.records);
    } catch (error) {
      setRadares([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchData();
  }, [token, navigate, fetchData]);

  const handleNovoRadar = () => {
    setModalOpen(true);
  };

  const handleCreateRadar = async (data: { partida: string; destino: string; inicio: string; fim: string; milhas: boolean }) => {
    setModalOpen(false);
    await fetchData();

    // Aqui você pode adicionar lógica para salvar o novo radar
    // e navegar para RadarOfertasScreen, se desejar
    // navigate("/radar-ofertas", { state: { novoRadar: true, ...data } });
  };

  const handleAbrirRadar = (radarId: string) => {
    navigate("/radar-ofertas", { state: { radarId } });
  };

  // Função para remover radar
  const handleRemoverRadar = async (radarId: number) => {
    setConfirmDeleteId(radarId);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await RadarService.delete(token, confirmDeleteId);
      setRadares((prev) => prev.filter((r) => r.id !== confirmDeleteId));
    } catch (e) {
      // Aqui pode exibir um toast de erro se desejar
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = () => setConfirmDeleteId(null);

  // Renderização condicional baseada no estado
  if (loading) {
    return <MeusRadaresSkeleton />;
  }

  if (radares.length === 0) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-econotrip-blue flex items-center gap-2">
            <Radar className="h-7 w-7 text-econotrip-orange" />
            Meus Radares
          </h1>
          <button
            onClick={handleNovoRadar}
            className="h-11 w-11 flex items-center justify-center rounded-full bg-econotrip-blue hover:bg-econotrip-blue/90 transition-colors shadow-md touch-target"
            aria-label="Adicionar novo radar"
          >
            <Plus className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <RadaresEmptyState onCreateRadar={handleNovoRadar} />
        
        <NovoRadarModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateRadar}
        />
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-econotrip-blue flex items-center gap-2">
          <Radar className="h-7 w-7 text-econotrip-orange" />
          Meus Radares
        </h1>
        <button
          onClick={handleNovoRadar}
          className="h-11 w-11 flex items-center justify-center rounded-full bg-econotrip-blue hover:bg-econotrip-blue/90 transition-colors shadow-md touch-target"
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
            className="w-full text-left bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100 flex flex-col gap-2 relative"
          >
            {/* Botão de remover no canto superior direito */}
            <span
              className="absolute top-2 right-2 z-10 h-7 w-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors cursor-pointer touch-target"
              onClick={e => { e.stopPropagation(); handleRemoverRadar(radar.id); }}
              title="Remover radar"
            >
              <X className="h-4 w-4 text-red-600" />
            </span>
            <div className="flex items-center gap-2 mb-1">
              <Radar className="h-5 w-5 text-econotrip-orange" />
              <span className="font-semibold text-lg text-econotrip-blue">
                {radar.origin} → {radar.destination}
              </span>
            </div>
            
            {/* Informações do período */}
            <div className="text-gray-600 text-sm mb-1">
              <span className="font-medium">Período:</span> {
                radar.start && radar.end 
                  ? `${new Date(radar.start).toLocaleDateString()} até ${new Date(radar.end).toLocaleDateString()}`
                  : "Qualquer período"
              }
            </div>
            
            {/* Informações do tipo de monitoramento */}
            <div className="text-gray-600 text-sm mb-1">
              <span className="font-medium">Tipo:</span> {radar.type === 'AIRMILES' ? 'Milhas' : 'Reais'}
            </div>
            
            {/* Informações do alerta de preço */}
            {radar.value && (
              <div className="text-econotrip-orange text-sm">
                <span className="font-medium">Alerta de preço:</span> {radar.value} {radar.type === 'AIRMILES' ? 'milhas' : 'reais'}
              </div>
            )}
          </button>
        ))}
      </div>
      <NovoRadarModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateRadar}
      />
      <StandardModal
        isOpen={!!confirmDeleteId}
        onClose={handleCancelDelete}
        type="warning"
        title="Remover radar"
        description="Tem certeza que deseja remover este radar? Esta ação não poderá ser desfeita."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
