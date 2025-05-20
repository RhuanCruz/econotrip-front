
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui-custom/Input";
import { toast } from "@/hooks/use-toast";

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

      {/* Help button */}
      <button
        className="fixed bottom-6 right-6 bg-econotrip-blue text-white rounded-full p-4 shadow-lg hover:bg-econotrip-blue/90 transition-colors touch-target"
        aria-label="Obter ajuda com o login"
        title="Ajuda com o login"
        onClick={() => alert("Assistente de ajuda com login será aberto aqui.")}
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
