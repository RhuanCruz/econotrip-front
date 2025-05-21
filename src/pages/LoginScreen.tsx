import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { toast } from "@/hooks/use-toast";
import { AssistButton } from "@/components/ui-custom/AssistButton";

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
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado para a página inicial.",
        });
        navigate("/busca-voos");
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Por favor, preencha todos os campos.",
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

        <h1 className="text-2xl md:text-3xl font-bold text-econotrip-blue mb-8 text-center font-museomoderno">
          Entrar na sua conta
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Digite seu e-mail para login"
          />

          <Input
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Digite sua senha para login"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/recuperar-senha")}
              className="text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg touch-target"
              aria-label="Recuperar senha esquecida"
            >
              Esqueceu a senha?
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
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="text-econotrip-blue hover:text-econotrip-orange transition-colors text-lg underline underline-offset-2 touch-target"
            aria-label="Ir para a página de criação de conta"
          >
            Ainda não tem conta? Criar agora
          </button>
        </div>
      </div>

      {/* Replace inline help button with AssistButton */}
      <AssistButton tooltipText="Ajuda com o login" />
    </div>
  );
}
