import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plus, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function NovaViagemScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    partida: "",
    destino: "",
    inicio: "",
    duracao: 10,
    pessoas: 1,
    estilo: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aqui você pode integrar com a API ou navegar para a tela de roteiro gerado
    // Exemplo: navigate('/roteiro-gerado', { state: { ...form } });
    navigate("/roteiro-gerado", { state: { ...form } });
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header moderno */}
          <motion.div variants={itemAnimation} className="text-center py-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Plus className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Criar Nova Viagem
            </h1>
          </motion.div>
      </motion.div>
      <Card className="max-w-md w-full p-8 rounded-3xl shadow-xl bg-white/90">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partida</label>
            <input
              type="text"
              name="partida"
              value={form.partida}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
              placeholder="Cidade de origem"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
            <input
              type="text"
              name="destino"
              value={form.destino}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
              placeholder="Cidade de destino"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
            <input
              type="date"
              name="inicio"
              min={new Date().toISOString().split('T')[0]}
              value={form.inicio}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duração (dias)</label>
            <input
              type="number"
              name="duracao"
              min={1}
              max={20}
              value={form.duracao}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue ${form.duracao > 20 ? 'border-red-500 ring-2 ring-red-400' : ''}`}
              placeholder="Ex: 7"
            />
            {form.duracao > 20 && (
              <p className="text-red-600 text-sm mt-1">A duração máxima permitida é 20 dias.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Pessoas</label>
            <input
              type="number"
              name="pessoas"
              min={1}
              value={form.pessoas}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estilo de Viagem</label>
            <select
              name="estilo"
              value={form.estilo}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
            >
              <option value="">Selecione</option>
              <option value="economico">Econômico</option>
              <option value="medio">Médio</option>
              <option value="luxo">Luxo</option>
            </select>
          </div>
          <Button
            type="submit"
            icon={Plus}
            size="lg"
            className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
          >
            Criar Roteiro
          </Button>
        </form>
      </Card>
    </div>
  );
}
