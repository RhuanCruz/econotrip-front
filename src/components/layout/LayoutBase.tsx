
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutBaseProps {
  children: React.ReactNode;
  userName?: string;
}

export function LayoutBase({ children, userName }: LayoutBaseProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <main className="flex flex-col flex-1">
          <Header userName={userName} />
          <div className="flex-1 px-4 md:px-8 py-6 overflow-auto">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
