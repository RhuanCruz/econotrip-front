import React, { useState } from "react";
import { StandardModal } from "@/components/ui-custom/StandardModal";
import { RadarService } from "@/api/radar/RadarService";
import { useAuthStore } from "@/stores/authStore";
import { LocationApi } from "@/api/location/location.api";
import type { Location } from "@/api/location/types";

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

  // Autocomplete states
  const [partidaSuggestions, setPartidaSuggestions] = useState<Location[]>([]);
  const [destinoSuggestions, setDestinoSuggestions] = useState<Location[]>([]);
  const [showPartidaDropdown, setShowPartidaDropdown] = useState(false);
  const [showDestinoDropdown, setShowDestinoDropdown] = useState(false);
  const [selectedPartida, setSelectedPartida] = useState<Location | null>(null);
  const [selectedDestino, setSelectedDestino] = useState<Location | null>(null);

  // Fetch suggestions for partida
  React.useEffect(() => {
    if (partida.length >= 3) {
      LocationApi.listLocations(partida).then((res) => {
        setPartidaSuggestions(res);
        setShowPartidaDropdown(true);
      });
    } else {
      setPartidaSuggestions([]);
      setShowPartidaDropdown(false);
    }
  }, [partida]);

  // Fetch suggestions for destino
  React.useEffect(() => {
    if (destino.length >= 3) {
      LocationApi.listLocations(destino).then((res) => {
        setDestinoSuggestions(res);
        setShowDestinoDropdown(true);
      });
    } else {
      setDestinoSuggestions([]);
      setShowDestinoDropdown(false);
    }
  }, [destino]);

  const formContent = (
    <form className="flex flex-col gap-4 mt-2 px-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Partida</label>
        <div className="relative">
          <input
            type="text"
            value={partida}
            onChange={e => {
              setPartida(e.target.value);
              setSelectedPartida(null);
            }}
            onFocus={() => partida.length >= 3 && setShowPartidaDropdown(true)}
            onBlur={() => setTimeout(() => setShowPartidaDropdown(false), 150)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Cidade de origem"
          />
          {showPartidaDropdown && partidaSuggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {partidaSuggestions.map((loc) => (
                <li
                  key={loc.id}
                  className="px-4 py-2 cursor-pointer hover:bg-econotrip-blue/10"
                  onMouseDown={() => {
                    setPartida(`${loc.name} (${loc.iata})`);
                    setSelectedPartida(loc);
                    setShowPartidaDropdown(false);
                  }}
                >
                  <span className="font-semibold text-econotrip-blue">{loc.iata}</span> - {loc.name}, {loc.city}, {loc.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Destino</label>
        <div className="relative">
          <input
            type="text"
            value={destino}
            onChange={e => {
              setDestino(e.target.value);
              setSelectedDestino(null);
            }}
            onFocus={() => destino.length >= 3 && setShowDestinoDropdown(true)}
            onBlur={() => setTimeout(() => setShowDestinoDropdown(false), 150)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Cidade de destino"
          />
          {showDestinoDropdown && destinoSuggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {destinoSuggestions.map((loc) => (
                <li
                  key={loc.id}
                  className="px-4 py-2 cursor-pointer hover:bg-econotrip-orange/10"
                  onMouseDown={() => {
                    setDestino(`${loc.name} (${loc.iata})`);
                    setSelectedDestino(loc);
                    setShowDestinoDropdown(false);
                  }}
                >
                  <span className="font-semibold text-econotrip-orange">{loc.iata}</span> - {loc.name}, {loc.city}, {loc.country}
                </li>
              ))}
            </ul>
          )}
        </div>
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
        origin: selectedPartida?.iata || selectedPartida?.city || partida,
        destination: selectedDestino?.iata || selectedDestino?.city || destino,
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
