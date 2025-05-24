
import React, { useState } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Checkbox } from "@/components/ui-custom/Checkbox";
import { Heart, Mountain, Building, Users, Accessibility, Plane } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PerfilViajante {
  preferencias: string[];
  mobilidadeReduzida: boolean;
  experienciaAviao: boolean;
  ambientePreferido: string;
}

interface PerfilDeViajanteProps {
  onSave: (perfil: PerfilViajante) => void;
  perfilAtual?: PerfilViajante;
}

export function PerfilDeViajante({ onSave, perfilAtual }: PerfilDeViajanteProps) {
  const [perfil, setPerfil] = useState<PerfilViajante>({
    preferencias: perfilAtual?.preferencias || [],
    mobilidadeReduzida: perfilAtual?.mobilidadeReduzida || false,
    experienciaAviao: perfilAtual?.experienciaAviao || false,
    ambientePreferido: perfilAtual?.ambientePreferido || "",
  });

  const preferenciaOptions = [
    { id: "natureza", label: "Natureza e paisagens", icon: Mountain },
    { id: "cultura", label: "Cultura e história", icon: Building },
    { id: "descanso", label: "Descanso e relaxamento", icon: Heart },
    { id: "gastronomia", label: "Gastronomia local", icon: Users },
  ];

  const handlePreferenciaChange = (preferencia: string, checked: boolean) => {
    setPerfil(prev => ({
      ...prev,
      preferencias: checked 
        ? [...prev.preferencias, preferencia]
        : prev.preferencias.filter(p => p !== preferencia)
    }));
  };

  const handleSave = () => {
    onSave(perfil);
    localStorage.setItem("econotrip_perfil_viajante", JSON.stringify(perfil));
    toast({
      title: "Perfil salvo com sucesso!",
      description: "Suas preferências serão usadas para personalizar suas viagens.",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-6">
        Personalize sua experiência de viagem
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-econotrip-blue mb-4">
            O que mais gosta em uma viagem?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {preferenciaOptions.map(({ id, label, icon: Icon }) => (
              <label key={id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={perfil.preferencias.includes(id)}
                  onChange={(e) => handlePreferenciaChange(id, e.target.checked)}
                  className="w-5 h-5 text-econotrip-blue"
                />
                <Icon className="h-5 w-5 text-econotrip-blue" />
                <span className="text-lg">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-econotrip-blue mb-4">
            Informações adicionais
          </h3>
          <div className="space-y-3">
            <Checkbox
              id="mobilidade"
              checked={perfil.mobilidadeReduzida}
              onChange={(e) => setPerfil(prev => ({ ...prev, mobilidadeReduzida: e.target.checked }))}
              label="Preciso de assistência para mobilidade"
            />
            
            <Checkbox
              id="experiencia"
              checked={perfil.experienciaAviao}
              onChange={(e) => setPerfil(prev => ({ ...prev, experienciaAviao: e.target.checked }))}
              label="Já viajei de avião antes"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-econotrip-blue mb-4">
            Prefere locais:
          </h3>
          <div className="space-y-2">
            {["calmos", "moderados", "agitados"].map((ambiente) => (
              <label key={ambiente} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="ambiente"
                  value={ambiente}
                  checked={perfil.ambientePreferido === ambiente}
                  onChange={(e) => setPerfil(prev => ({ ...prev, ambientePreferido: e.target.value }))}
                  className="w-5 h-5 text-econotrip-blue"
                />
                <span className="text-lg capitalize">{ambiente}</span>
              </label>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          className="w-full h-14 text-xl"
        >
          Salvar preferências
        </Button>
      </div>
    </Card>
  );
}
