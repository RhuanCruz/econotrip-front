
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { 
  Star, 
  Download, 
  Send, 
  ThumbsUp, 
  MessageSquare,
  Award,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface Avaliacao {
  categoria: string;
  nota: number;
  comentario: string;
}

interface ServicoAvaliacao {
  id: string;
  nome: string;
  tipo: "voo" | "hotel" | "restaurante" | "atividade";
  icon: React.ComponentType<any>;
}

const servicosParaAvaliar: ServicoAvaliacao[] = [
  { id: "voo", nome: "Voo São Paulo → Lisboa", tipo: "voo", icon: Star },
  { id: "hotel", nome: "Hotel Lisboa Centro", tipo: "hotel", icon: Award },
  { id: "restaurante", nome: "Restaurante Alfama", tipo: "restaurante", icon: ThumbsUp },
  { id: "atividade", nome: "City Tour Lisboa", tipo: "atividade", icon: MessageSquare },
];

export default function AvaliacaoScreen() {
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState<Record<string, Avaliacao>>({});
  const [comentarioGeral, setComentarioGeral] = useState("");
  const [recomendaria, setRecomendaria] = useState<boolean | null>(null);

  const handleNotaChange = (servicoId: string, nota: number) => {
    setAvaliacoes(prev => ({
      ...prev,
      [servicoId]: {
        ...prev[servicoId],
        categoria: servicoId,
        nota,
        comentario: prev[servicoId]?.comentario || ""
      }
    }));
  };

  const handleComentarioChange = (servicoId: string, comentario: string) => {
    setAvaliacoes(prev => ({
      ...prev,
      [servicoId]: {
        ...prev[servicoId],
        categoria: servicoId,
        nota: prev[servicoId]?.nota || 0,
        comentario
      }
    }));
  };

  const handleEnviarAvaliacao = () => {
    const avaliacoesCompletas = Object.values(avaliacoes).filter(
      av => av.nota > 0
    );

    if (avaliacoesCompletas.length === 0) {
      toast({
        title: "Avaliação incompleta",
        description: "Por favor, avalie pelo menos um serviço.",
        variant: "destructive",
      });
      return;
    }

    // Simular envio
    console.log("Enviando avaliações:", {
      avaliacoes: avaliacoesCompletas,
      comentarioGeral,
      recomendaria
    });

    toast({
      title: "Avaliação enviada!",
      description: "Obrigado pelo seu feedback. Ele nos ajuda a melhorar.",
    });

    navigate("/dashboard");
  };

  const handleExportarRelatorio = () => {
    const relatorioData = {
      dataViagem: new Date().toLocaleDateString("pt-BR"),
      avaliacoes: Object.values(avaliacoes),
      comentarioGeral,
      recomendaria,
      notaMedia: Object.values(avaliacoes).reduce((acc, av) => acc + av.nota, 0) / Object.values(avaliacoes).length || 0
    };

    console.log("Exportando relatório:", relatorioData);

    toast({
      title: "Relatório exportado!",
      description: "Seu relatório de viagem foi salvo em PDF.",
    });
  };

  const renderEstrelas = (servicoId: string, notaAtual: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((nota) => (
          <button
            key={nota}
            type="button"
            onClick={() => handleNotaChange(servicoId, nota)}
            className="touch-target transition-transform hover:scale-110"
            aria-label={`Dar nota ${nota} para ${servicoId}`}
          >
            <Star
              className={`h-8 w-8 ${
                nota <= notaAtual
                  ? "text-yellow-500 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-4 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-econotrip-orange/10 rounded-xl">
            <Star className="h-6 w-6 text-econotrip-orange" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-econotrip-blue">
            Avalie sua Viagem
          </h1>
        </div>
        <p className="text-gray-600 text-base">
          Sua opinião nos ajuda a melhorar
        </p>
      </motion.div>

      {/* Avaliações por serviço */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 mb-6"
      >
        {servicosParaAvaliar.map((servico, index) => (
          <motion.div
            key={servico.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <servico.icon className="h-6 w-6 text-econotrip-blue" />
                  <h3 className="text-lg font-semibold text-econotrip-blue">
                    {servico.nome}
                  </h3>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Como você avalia este serviço?
                  </label>
                  {renderEstrelas(servico.id, avaliacoes[servico.id]?.nota || 0)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentários (opcional)
                  </label>
                  <textarea
                    value={avaliacoes[servico.id]?.comentario || ""}
                    onChange={(e) => handleComentarioChange(servico.id, e.target.value)}
                    placeholder="Conte-nos sobre sua experiência..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-econotrip-orange focus:border-transparent"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Avaliação geral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-econotrip-blue mb-4">
            Avaliação Geral da Viagem
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Você recomendaria nossos serviços?
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRecomendaria(true)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  recomendaria === true
                    ? "border-econotrip-green bg-econotrip-green/10 text-econotrip-green"
                    : "border-gray-300 text-gray-600 hover:border-econotrip-green"
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
                Sim, recomendaria
              </button>
              <button
                type="button"
                onClick={() => setRecomendaria(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  recomendaria === false
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-gray-300 text-gray-600 hover:border-red-500"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                Precisa melhorar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentário geral sobre sua experiência
            </label>
            <textarea
              value={comentarioGeral}
              onChange={(e) => setComentarioGeral(e.target.value)}
              placeholder="Conte-nos o que achou da sua viagem com a EconoTrip..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-econotrip-orange focus:border-transparent"
            />
          </div>
        </Card>
      </motion.div>

      {/* Botões de ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <Button
          variant="primary"
          onClick={handleEnviarAvaliacao}
          className="w-full h-14 text-lg"
          icon={Send}
        >
          Enviar Avaliação
        </Button>

        <Button
          variant="secondary"
          onClick={handleExportarRelatorio}
          className="w-full h-12"
          icon={Download}
        >
          Exportar Relatório da Viagem
        </Button>
      </motion.div>
    </div>
  );
}
