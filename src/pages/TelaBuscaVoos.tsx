
import React, { useState } from "react";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Input } from "@/components/ui-custom/Input";
import { Button } from "@/components/ui-custom/Button";
import { Checkbox } from "@/components/ui-custom/Checkbox";
import { Card } from "@/components/ui-custom/Card";
import { AlertBox } from "@/components/ui-custom/AlertBox";

export default function TelaBuscaVoos() {
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    dataIda: "",
    dataVolta: "",
    passageiros: "1",
    classe: "economica",
    somenteDireto: false,
    voosSustentaveis: false,
    tarifasFlexiveis: false,
    acessibilidade: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados da busca:", formData);
    // Aqui seria feita a navegação para a página de resultados de voos
    // navigate("/resultados-voos", { state: formData });
    alert("Busca realizada! Redirecionando para resultados...");
  };

  return (
    <LayoutBase>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-econotrip-blue mb-8">Busque seu próximo voo</h1>

        <Card className="mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Origem"
                name="origem"
                id="origem"
                placeholder="De onde você vai partir?"
                value={formData.origem}
                onChange={handleChange}
                required
              />

              <Input
                label="Destino"
                name="destino"
                id="destino"
                placeholder="Para onde você vai?"
                value={formData.destino}
                onChange={handleChange}
                required
              />

              <Input
                type="date"
                label="Data de Ida"
                name="dataIda"
                id="dataIda"
                value={formData.dataIda}
                onChange={handleChange}
                required
              />

              <Input
                type="date"
                label="Data de Volta"
                name="dataVolta"
                id="dataVolta"
                value={formData.dataVolta}
                onChange={handleChange}
              />

              <div>
                <label
                  htmlFor="passageiros"
                  className="block text-lg font-medium text-econotrip-blue mb-2"
                >
                  Passageiros
                </label>
                <select
                  id="passageiros"
                  name="passageiros"
                  className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg"
                  value={formData.passageiros}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "passageiro" : "passageiros"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="classe"
                  className="block text-lg font-medium text-econotrip-blue mb-2"
                >
                  Classe
                </label>
                <select
                  id="classe"
                  name="classe"
                  className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg"
                  value={formData.classe}
                  onChange={handleChange}
                >
                  <option value="economica">Econômica</option>
                  <option value="premium">Econômica Premium</option>
                  <option value="executiva">Executiva</option>
                  <option value="primeira">Primeira Classe</option>
                </select>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                id="somenteDireto"
                name="somenteDireto"
                checked={formData.somenteDireto}
                onChange={handleChange}
                label="Somente voos diretos"
              />

              <Checkbox
                id="voosSustentaveis"
                name="voosSustentaveis"
                checked={formData.voosSustentaveis}
                onChange={handleChange}
                label="Priorizar voos sustentáveis"
              />

              <Checkbox
                id="tarifasFlexiveis"
                name="tarifasFlexiveis"
                checked={formData.tarifasFlexiveis}
                onChange={handleChange}
                label="Tarifas flexíveis"
              />

              <Checkbox
                id="acessibilidade"
                name="acessibilidade"
                checked={formData.acessibilidade}
                onChange={handleChange}
                label="Preciso de assistência especial"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <Button type="submit" variant="primary" size="lg">
                Buscar Voos
              </Button>
            </div>
          </form>
        </Card>

        <AlertBox
          type="info"
          title="Dica de Viagem"
        >
          Reservas feitas com antecedência de 60 dias ou mais geralmente têm melhores preços. 
          Considere planejar sua viagem com antecedência para economizar!
        </AlertBox>
      </div>
    </LayoutBase>
  );
}
