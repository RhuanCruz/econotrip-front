
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
import { UserService } from "@/api/user/UserService";

// Componentes de ícones customizados para redes sociais
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, isLoading, login, error, clearError, token, signInWithGoogle } = useAuthStore();

  useEffect(() => {
    async function registerPush() {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker não suportado neste navegador.');
        return;
      }
      if (!('PushManager' in window)) {
        console.warn('PushManager não está disponível neste navegador/contexto. Certifique-se de estar em HTTPS ou localhost.');
        return;
      }
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Substitua pelo seu VAPID public key
          const vapidPublicKey = 'BKUVUZ43uF-dI4QpeyTyk8vdB3ZQ_pTJdh8QbjwkfaJmiLqHr5CIJATo1jumbVtNW091IZsEEpf-RdfN9Qoa5E0';
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
          // Envie para o backend
          if (token && subscription) {
            UserService.pushSubscription(token, subscription);
          }
        } else {
          console.warn('Permissão de notificação não concedida pelo usuário.');
        }
      } catch (err) {
        console.warn('Erro ao registrar push notification:', err);
      }
    }

    function urlBase64ToUint8Array(base64String: string) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    if (isAuthenticated && isTokenValid(token)) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a página inicial.",
        duration: 4000,
      });
      registerPush();
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, token]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "E-mail ou senha incorretos",
        description: "Por favor, verifique se seus dados estão corretos",
        duration: 4000,
      });
      clearError();
    }
  }, [clearError, error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleFacebookLogin = () => {
    // TODO: Implementar login com Facebook
    toast({
      title: "Login com Facebook",
      description: "Funcionalidade em desenvolvimento",
      duration: 3000,
    });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="font-museomoderno font-bold text-4xl text-econotrip-primary">
            ECONOTRIP
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-econotrip-primary mb-4 text-center font-museomoderno">
          Que bom ver você novamente!
        </h1>
        
        <p className="text-lg text-center text-gray-600 mb-8 font-manrope">
          Entre com seus dados para acessar suas viagens e descobrir novas ofertas
        </p>

        {/* <MotivationalHint message="Suas próximas aventuras estão esperando por você!" className="mb-6" /> */}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-lg font-medium text-econotrip-primary">
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
              <label className="text-lg font-medium text-econotrip-primary">
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
              className="text-econotrip-primary hover:text-econotrip-coral transition-colors text-lg touch-target"
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
            className="w-full bg-econotrip-primary hover:bg-econotrip-primary/90 rounded-full h-14 mt-6 text-white font-semibold"
          >
            Entrar na minha conta
          </Button>
        </form>

        {/* Divisor */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">ou continue com</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Botões de login social */}
        <div className="space-y-3 mb-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-3 transition-colors"
          >
            <GoogleIcon className="w-5 h-5 flex-shrink-0" />
            <span>Continuar com Google</span>
          </button>
          
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-3 transition-colors"
          >
            <FacebookIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <span>Continuar com Facebook</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Ainda não tem conta?</p>
          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="text-econotrip-primary hover:text-econotrip-coral transition-colors text-lg underline underline-offset-2 touch-target font-medium"
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
