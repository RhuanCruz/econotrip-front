
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { toast } from "@/hooks/use-toast";

export default function RecoverPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      if (email) {
        setSubmitted(true);
        toast({
          title: "E-mail enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao enviar",
          description: "Por favor, digite um e-mail válido.",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="font-museomoderno font-bold text-4xl text-econotrip-blue">
            ECONOTRIP
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-econotrip-blue mb-4 text-center font-museomoderno">
          Esqueci minha senha
        </h1>
        
        <p className="text-lg text-center text-gray-600 mb-8 font-manrope">
          Informe seu e-mail e enviaremos instruções para redefinir sua senha.
        </p>

        {submitted ? (
          <AlertBox
            type="success"
            title="E-mail enviado com sucesso!"
            className="mb-8"
          >
            <p>
              Enviamos um e-mail com as instruções para redefinir sua senha.
              Por favor, verifique sua caixa de entrada.
            </p>
          </AlertBox>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="E-mail"
              placeholder="Digite seu e-mail cadastrado"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Digite seu e-mail para recuperar a senha"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Send}
              loading={loading}
              className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] rounded-full h-14 mt-8"
            >
              Enviar Instruções
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg underline underline-offset-2 touch-target"
            aria-label="Voltar para a tela de login"
          >
            Voltar para login
          </button>
        </div>
      </div>

      {/* Help button */}
      <button
        className="fixed bottom-6 right-6 bg-econotrip-blue text-white rounded-full p-4 shadow-lg hover:bg-econotrip-blue/90 transition-colors touch-target"
        aria-label="Obter ajuda com recuperação de senha"
        title="Ajuda com acesso à conta"
        onClick={() => alert("Assistente de ajuda com recuperação de senha será aberto aqui.")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>
    </div>
  );
}
