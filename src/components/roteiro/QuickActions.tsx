
import React, { useState } from "react";
import { Button } from "@/components/ui-custom/Button";
import { StandardModal } from "@/components/ui-custom/StandardModal";
import { 
  Plus, 
  Download, 
  Share2,
  Settings,
  Trash2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onNewEvent: () => void;
  onExport: () => void;
  onShare: () => void;
  onEditObjective: () => void;
}

export function QuickActions({
  onNewEvent,
  onExport,
  onShare,
  onEditObjective
}: QuickActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading("export");
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(null);
    onExport();
  };

  const handleShare = async () => {
    setIsLoading("share");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(null);
    onShare();
  };

  const handleDeleteRoteiro = () => {
    setShowDeleteModal(false);
    toast({
      title: "Roteiro excluído",
      description: "Seu roteiro foi removido com sucesso.",
    });
  };

  return (
    <>
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-base font-medium text-econotrip-blue">
          Ações Rápidas
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="default"
            icon={Download}
            onClick={handleExport}
            loading={isLoading === "export"}
            className="h-12 flex-col text-sm"
            aria-label="Exportar roteiro em PDF"
          >
            <span>Exportar</span>
            <span className="text-xs opacity-75">PDF</span>
          </Button>

          <Button
            variant="secondary"
            size="default"
            icon={Share2}
            onClick={handleShare}
            loading={isLoading === "share"}
            className="h-12 flex-col text-sm"
            aria-label="Compartilhar roteiro"
          >
            <span>Compartilhar</span>
            <span className="text-xs opacity-75">Link</span>
          </Button>
          
          <Button
            variant="secondary"
            size="default"
            icon={Settings}
            onClick={onEditObjective}
            className="h-12 flex-col text-sm"
            aria-label="Editar objetivo"
          >
            <span>Editar</span>
            <span className="text-xs opacity-75">Objetivo</span>
          </Button>

          <Button
            variant="secondary"
            size="default"
            icon={Trash2}
            onClick={() => setShowDeleteModal(true)}
            className="h-12 flex-col text-sm text-red-600 hover:bg-red-50"
            aria-label="Excluir roteiro"
          >
            <span>Excluir</span>
            <span className="text-xs opacity-75">Roteiro</span>
          </Button>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={Plus}
          onClick={onNewEvent}
          className="w-full h-14 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90"
          aria-label="Adicionar novo evento"
        >
          Adicionar Novo Evento
        </Button>
      </div>

      <StandardModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteRoteiro}
        type="warning"
        title="Excluir Roteiro"
        description="Tem certeza que deseja excluir este roteiro? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        showCancel={true}
      />
    </>
  );
}
