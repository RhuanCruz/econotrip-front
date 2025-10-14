import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, Send, CheckCircle, Bug, Lightbulb, Heart, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { FeedbackService } from "@/api/feedback/FeedbackService";
import { useAuthStore } from "@/stores/authStore";
import type { FeedbackCategory } from "@/api/feedback/types";

export default function FeedbackScreen() {
  const { token } = useAuthStore();

  const [categoria, setCategoria] = useState<FeedbackCategory>("GENERAL");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [avaliacao, setAvaliacao] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const categorias: { value: FeedbackCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "BUG", label: "Reportar Bug", icon: <Bug className="h-5 w-5" />, color: "text-red-600" },
    { value: "FEATURE_REQUEST", label: "Sugerir Funcionalidade", icon: <Lightbulb className="h-5 w-5" />, color: "text-yellow-600" },
    { value: "IMPROVEMENT", label: "Melhoria", icon: <AlertCircle className="h-5 w-5" />, color: "text-blue-600" },
    { value: "COMPLIMENT", label: "Elogio", icon: <Heart className="h-5 w-5" />, color: "text-pink-600" },
    { value: "COMPLAINT", label: "Reclamação", icon: <AlertCircle className="h-5 w-5" />, color: "text-orange-600" },
    { value: "GENERAL", label: "Geral", icon: <MessageSquare className="h-5 w-5" />, color: "text-gray-600" },
  ];

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assunto.trim() || !mensagem.trim()) {
      alert("Por favor, preencha o assunto e a mensagem");
      return;
    }

    if (!token) {
      alert("Você precisa estar logado para enviar feedback");
      return;
    }

    setLoading(true);

    try {
      await FeedbackService.send(token, {
        category: categoria,
        subject: assunto,
        message: mensagem,
        rating: avaliacao > 0 ? avaliacao : undefined,
        email: email.trim() || undefined,
      });

      setEnviado(true);

      // Limpar formulário após 3 segundos
      setTimeout(() => {
        setCategoria("GENERAL");
        setAssunto("");
        setMensagem("");
        setAvaliacao(0);
        setEmail("");
        setEnviado(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);

      // Mensagem amigável considerando que o backend pode não estar implementado
      const errorMessage = error instanceof Error && error.message.includes("500")
        ? "O sistema de feedback está temporariamente indisponível. Por favor, tente novamente mais tarde ou entre em contato conosco diretamente pelo email suporte@primevoyage.com"
        : "Erro ao enviar feedback. Por favor, verifique sua conexão e tente novamente.";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-econotrip-blue mb-3">
            Feedback Enviado!
          </h2>
          <p className="text-gray-600 mb-2">
            Muito obrigado pelo seu feedback.
          </p>
          <p className="text-gray-500 text-sm">
            Sua opinião é fundamental para melhorarmos o PrimeVoyage.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 bg-econotrip-blue/10 rounded-2xl">
            <MessageSquare className="h-8 w-8 text-econotrip-primary" />
          </div>
          <h1 className="text-2xl font-bold text-econotrip-blue">
            Enviar Feedback
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Ajude-nos a melhorar sua experiência
        </p>
      </motion.div>

      {/* Formulário */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <form onSubmit={handleEnviar} className="space-y-5">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Feedback
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categorias.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategoria(cat.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      categoria === cat.value
                        ? "border-econotrip-blue bg-econotrip-blue/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`${cat.color} mb-1`}>{cat.icon}</div>
                    <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avaliação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação Geral (opcional)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setAvaliacao(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= avaliacao
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Assunto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assunto
              </label>
              <input
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-blue/20 focus:border-econotrip-blue"
                placeholder="Resuma seu feedback em poucas palavras"
                required
              />
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-blue/20 focus:border-econotrip-blue resize-none"
                placeholder="Descreva seu feedback de forma detalhada..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {mensagem.length} caracteres
              </p>
            </div>

            {/* Email (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email para resposta (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-econotrip-blue/20 focus:border-econotrip-blue"
                placeholder="seu@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se quiser receber uma resposta da equipe
              </p>
            </div>

            {/* Botão de Enviar */}
            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-lg bg-econotrip-blue hover:bg-econotrip-blue/90"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Enviando...
                </span>
              ) : (
                <>
                  Enviar Feedback
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Informação adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <h3 className="text-sm font-semibold text-econotrip-blue mb-2">
            💙 Sua opinião importa!
          </h3>
          <p className="text-sm text-gray-600">
            Lemos todos os feedbacks e utilizamos suas sugestões para melhorar continuamente
            a experiência no PrimeVoyage. Agradecemos por dedicar seu tempo para nos ajudar!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
