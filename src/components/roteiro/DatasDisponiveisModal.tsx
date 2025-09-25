import React from "react";
import { useNavigate } from "react-router-dom";
import { StandardModal } from "@/components/ui-custom/StandardModal";

interface DatasDisponiveisModalProps {
  isOpen: boolean;
  onClose: () => void;
  preco: number;
  datas: string[];
  origem: string;
  destino: string;
  radarType?: 'AIRMILES' | 'MONEY';
}

export function DatasDisponiveisModal({ isOpen, onClose, preco, datas, origem, destino, radarType = 'MONEY' }: DatasDisponiveisModalProps) {
  const navigate = useNavigate();

  const handleIrParaBusca = (data: string) => {
    onClose();
    // Ensure date is in YYYY-MM-DD format
    const dateFormatted = new Date(data).toISOString().split('T')[0];
    navigate("/busca-voos", {
      state: {
        searchParams:{
          origem,
          destino,
          dataIda: dateFormatted,
          usarMilhas: radarType === 'AIRMILES',
          preco
        }
      }
    });
  };

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      type="info"
      title={`Datas disponíveis para ${radarType === 'AIRMILES' 
        ? `${preco.toLocaleString()} milhas`
        : `R$ ${preco.toLocaleString()}`
      }`}
      description={""}
      confirmText="Fechar"
      showCancel={false}
    >
      <div className="flex flex-col gap-2 mt-4">
        {datas.map((data, idx) => (
          <button
            key={idx}
            className="w-full text-left px-3 py-2 rounded-lg bg-econotrip-blue/10 hover:bg-econotrip-blue/20 text-econotrip-blue font-medium transition-colors"
            onClick={() => handleIrParaBusca(data)}
          >
            {new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </button>
        ))}
      </div>
    </StandardModal>
  );
}
