
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { toast } from "@/hooks/use-toast";
import { AssistButton } from "@/components/ui-custom/AssistButton";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";
import { MotivationalHint } from "@/components/ui-custom/MotivationalHint";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      setLoading(false);
      
      if (email && password) {
        toast({
          title: "Bem-vinda de volta!",
          description: "Acesso realizado com sucesso. Preparando suas opções de viagem...",
        });
        navigate("/busca-voos");
      } else {
        toast({
          variant: "destructive",
          title: "Ops! Algo não está certo",
          description: "Por favor, preencha seu e-mail e senha para continuar.",
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
            loading={loading}
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
