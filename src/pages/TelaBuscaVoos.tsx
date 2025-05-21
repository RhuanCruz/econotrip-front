
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui-custom/Input";
import { Button } from "@/components/ui-custom/Button";
import { Checkbox } from "@/components/ui-custom/Checkbox";
import { Card } from "@/components/ui-custom/Card";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { motion } from "framer-motion";
import { AssistButton } from "@/components/ui-custom/AssistButton";

export default function TelaBuscaVoos() {
  const navigate = useNavigate();
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
    navigate("/resultados-voos");
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-xl mx-auto">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemAnimation}
          className="text-2xl font-semibold font-museomoderno text-econotrip-blue mb-6"
        >
          Busque seu próximo voo
        </motion.h1>

        <motion.div variants={itemAnimation}>
          <Card className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Origem"
                  name="origem"
                  id="origem"
                  placeholder="De onde você vai partir?"
                  value={formData.origem}
                  onChange={handleChange}
                  className="h-14 rounded-xl px-4"
                  required
                  aria-label="Cidade ou aeroporto de origem"
                />

                <Input
                  label="Destino"
                  name="destino"
                  id="destino"
                  placeholder="Para onde você vai?"
                  value={formData.destino}
                  onChange={handleChange}
                  className="h-14 rounded-xl px-4"
                  required
                  aria-label="Cidade ou aeroporto de destino"
                />

                <Input
                  type="date"
                  label="Data de Ida"
                  name="dataIda"
                  id="dataIda"
                  value={formData.dataIda}
                  onChange={handleChange}
                  className="h-14 rounded-xl px-4"
                  required
                  aria-label="Data de ida da viagem"
                />

                <Input
                  type="date"
                  label="Data de Volta"
                  name="dataVolta"
                  id="dataVolta"
                  value={formData.dataVolta}
                  onChange={handleChange}
                  className="h-14 rounded-xl px-4"
                  aria-label="Data de volta da viagem (opcional)"
                />

                <div className="space-y-2">
                  <label
                    htmlFor="passageiros"
                    className="block text-lg font-medium text-econotrip-blue"
                  >
                    Passageiros
                  </label>
                  <select
                    id="passageiros"
                    name="passageiros"
                    className="h-14 w-full rounded-xl border border-input bg-background px-4 py-2 text-lg"
                    value={formData.passageiros}
                    onChange={handleChange}
                    aria-label="Quantidade de passageiros"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "passageiro" : "passageiros"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="classe"
                    className="block text-lg font-medium text-econotrip-blue"
                  >
                    Classe
                  </label>
                  <select
                    id="classe"
                    name="classe"
                    className="h-14 w-full rounded-xl border border-input bg-background px-4 py-2 text-lg"
                    value={formData.classe}
                    onChange={handleChange}
                    aria-label="Classe da viagem"
                  >
                    <option value="economica">Econômica</option>
                    <option value="premium">Econômica Premium</option>
                    <option value="executiva">Executiva</option>
                    <option value="primeira">Primeira Classe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
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
            </form>
          </Card>
        </motion.div>

        <motion.div
          variants={itemAnimation}
          className="mb-24"
        >
          <AlertBox
            type="info"
            title="Dica de Viagem"
          >
            Reservas feitas com antecedência de 60 dias ou mais geralmente têm melhores preços. 
            Considere planejar sua viagem com antecedência para economizar!
          </AlertBox>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="fixed bottom-24 left-0 right-0 px-6 pb-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full h-16 text-xl rounded-xl shadow-md"
          onClick={handleSubmit}
        >
          Buscar Voos
        </Button>
      </motion.div>
      
      {/* The AssistButton component will handle visibility itself */}
      <AssistButton tooltipText="Ajuda com busca de voos" />
    </div>
  );
}
