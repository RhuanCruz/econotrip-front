
import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { ScreenContainer } from "./ScreenContainer";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutBaseProps {
  children: React.ReactNode;
  userName?: string;
  className?: string;
  title?: string;
}

export function LayoutBase({ children, userName = "Maria", className, title }: LayoutBaseProps) {
  const location = useLocation();
  const hiddenRoutes = ["/", "/login", "/registro", "/recuperar-senha", "/checkout", "/confirmacao"];
  const hideNav = hiddenRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header userName={userName} />
      <main className="flex-1 overflow-auto">
        <ScreenContainer className={className} title={title}>
          {children}
        </ScreenContainer>
      </main>
      {!hideNav && <BottomNavigation />}
    </div>
  );
}
