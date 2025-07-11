
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { ScreenContainer } from "./ScreenContainer";
import { BottomNavigation } from "./BottomNavigation";
import { useAuthStore } from "@/stores/authStore";
import { isTokenValid } from "@/utils/tokenUtils";
import { toast } from "@/hooks/use-toast";

interface LayoutBaseProps {
  children: React.ReactNode;
  userName?: string;
  className?: string;
  title?: string;
}

export function LayoutBase({ children, userName = "Maria", className, title }: LayoutBaseProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const unproctedRoutes = ["/", "/login", "/registro", "/recuperar-senha", "/checkout", "/confirmacao", "/redefinir-senha", "/politica-privacidade", "/termos-servico"]
  const hiddenRoutes = ["/", "/login", "/registro", "/recuperar-senha", "/checkout", "/confirmacao"];
  const hideNav = hiddenRoutes.includes(location.pathname);

  const { user, token } = useAuthStore();

  React.useEffect(() => {
    if (!unproctedRoutes.includes(location.pathname)) {
      if (!token || !isTokenValid(token)) {
        toast({
          title: "Sua Sessão Expirou",
          description: "Por favor, faça login novamente para continuar.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <Header user={user} />
      <main className="flex-1 overflow-auto">
        <ScreenContainer className={className} title={title}>
          {children}
        </ScreenContainer>
      </main>
      {!hideNav && <BottomNavigation />}
    </div>
  );
}
