
import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScreenContainer } from "./ScreenContainer";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutBaseProps {
  children: React.ReactNode;
  userName?: string;
  className?: string;
}

export function LayoutBase({ children, userName, className }: LayoutBaseProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header userName={userName} />
      <main className="flex-1 overflow-auto">
        <ScreenContainer className={className}>
          {children}
        </ScreenContainer>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
}
