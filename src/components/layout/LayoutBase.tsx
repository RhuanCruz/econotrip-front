
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScreenContainer } from "./ScreenContainer";

interface LayoutBaseProps {
  children: React.ReactNode;
  userName?: string;
  className?: string;
}

export function LayoutBase({ children, userName, className }: LayoutBaseProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <main className="flex flex-col flex-1">
          <Header userName={userName} />
          <div className="flex-1 overflow-auto">
            <ScreenContainer className={className}>
              {children}
            </ScreenContainer>
          </div>
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
