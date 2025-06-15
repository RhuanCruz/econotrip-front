import React, { useState } from "react";
import { StandardModal } from "@/components/ui-custom/StandardModal";
import { RadarService } from "@/api/radar/RadarService";
import { useAuthStore } from "@/stores/authStore";

interface NovoRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    partida: string;
    destino: string;
    inicio: string;
    fim: string;
    milhas: boolean;
  }) => void;
}

export function NovoRadarModal({ isOpen, onClose, onCreate }: NovoRadarModalProps) {
  const [partida, setPartida] = useState("");
  const [destino, setDestino] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [milhas, setMilhas] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const formContent = (
    <form className="flex flex-col gap-4 mt-2 px-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Partida</label>
        <input type="text" value={partida} onChange={e => setPartida(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Cidade de origem" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Destino</label>
        <input type="text" value={destino} onChange={e => setDestino(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Cidade de destino" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Início</label>
        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Fim</label>
        <input type="date" value={fim} onChange={e => setFim(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" id="milhas" checked={milhas} onChange={e => setMilhas(e.target.checked)} />
        <label htmlFor="milhas" className="text-sm text-gray-700">Procurar por milhas</label>
      </div>
    </form>
  );

  const handleConfirm = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await RadarService.create(token, {
        origin: partida,
        destination: destino,
        start: inicio,
        end: fim,
        // Se o backend aceitar campo milhas, inclua aqui
      });
      setPartida("");
      setDestino("");
      setInicio("");
      setFim("");
      setMilhas(false);
      onCreate({ partida, destino, inicio, fim, milhas });
    } catch (e) {
      // Trate erro se necessário
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      type="info"
      title="Novo Radar"
      description={formContent as unknown as string}
      confirmText={loading ? "Criando..." : "Criar Radar"}
      cancelText="Cancelar"
      showCancel
    />
  );
}
