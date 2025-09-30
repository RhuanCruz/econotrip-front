 
import React from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLogin } from "../src/components/dashboard/DashboardLogin";
import DashboardScreenStandalone from "../src/pages/DashboardScreenStandalone";
import { useAuthStore } from "../src/stores/authStore";

const queryClient = new QueryClient();



function DashboardWrapper() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Função de logout que também redireciona
  const handleLogout = () => {
    logoutStore();
    navigate("/", { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<DashboardLogin />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardScreenStandalone user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      {/* fallback para qualquer rota desconhecida */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardWrapper />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
