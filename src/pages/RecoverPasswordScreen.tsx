import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { toast } from "@/hooks/use-toast";
import { AssistButton } from "@/components/ui-custom/AssistButton";
import { UserService } from "@/api/user/UserService";

export default function RecoverPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await UserService.forgotPassword(email);
      setSubmitted(true);
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: error instanceof Error ? error.message : "Por favor, tente novamente.",
      });
    } finally {
      setLoading(false);
    }
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
      <AssistButton tooltipText="Ajuda com recuperação de senha" />
    </div>
  );
}
