
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { toast } from "@/hooks/use-toast";
import { AssistButton } from "@/components/ui-custom/AssistButton";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";
import { MotivationalHint } from "@/components/ui-custom/MotivationalHint";
import { useAuthStore } from "@/stores/authStore";
import { isTokenValid } from "@/utils/tokenUtils";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, isLoading, login, error, clearError, token } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && isTokenValid(token)) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a página inicial.",
      });
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, token]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: error ?? "Erro no login",
        description: "Por favor, preencha todos os campos.",
      });
      clearError();
    }
  }, [clearError, error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
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
          Que bom ver você novamente!
        </h1>
        
        <p className="text-lg text-center text-gray-600 mb-8 font-manrope">
          Entre com seus dados para acessar suas viagens e descobrir novas ofertas
        </p>

        <MotivationalHint message="Suas próximas aventuras estão esperando por você!" className="mb-6" />

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-lg font-medium text-econotrip-blue">
                Seu e-mail
              </label>
              <ContextualTooltip content="Digite o e-mail que você usou para criar sua conta no EconoTrip." />
            </div>
            <Input
              type="email"
              placeholder="exemplo@email.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Digite seu e-mail para entrar"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-lg font-medium text-econotrip-blue">
                Sua senha
              </label>
              <ContextualTooltip content="Digite a senha que você criou para proteger sua conta." />
            </div>
            <Input
              type="password"
              placeholder="Digite sua senha"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Digite sua senha para entrar"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/recuperar-senha")}
              className="text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg touch-target"
              aria-label="Recuperar senha esquecida"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={LogIn}
            loading={isLoading}
            className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] rounded-full h-14 mt-6"
          >
            Entrar na minha conta
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Ainda não tem conta?</p>
          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg underline underline-offset-2 touch-target"
            aria-label="Criar uma nova conta"
          >
            Criar conta gratuita
          </button>
        </div>
      </div>

      {/* Replace inline help button with AssistButton */}
      <AssistButton tooltipText="Precisa de ajuda para entrar?" />
    </div>
  );
}
