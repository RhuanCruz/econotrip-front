import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LayoutBase } from "./components/layout/LayoutBase";
import { TourIntro } from "./components/onboarding/TourIntro";
import { HumanSupportButton } from "./components/support/HumanSupportButton";
import { AccessibilityBar } from "./components/accessibility/AccessibilityBar";

import TelaBoasVindas from "./pages/TelaBoasVindas";
import TelaBuscaVoos from "./pages/TelaBuscaVoos";
import ResultsScreen from "./pages/ResultsScreen";
import FlightDetailsScreen from "./pages/FlightDetails/FlightDetailsScreen";
import CheckoutScreen from "./pages/Checkout/CheckoutScreen";
import ConfirmationScreen from "./pages/ConfirmationScreen";
import ProfileScreen from "./pages/ProfileScreen";
import EditProfileScreen from "./pages/EditProfileScreen";
import LoyaltyScreen from "./pages/LoyaltyScreen";
import SupportScreen from "./pages/SupportScreen";
import SustainableTravel from "./pages/SustainableTravel";
import RoteirosPersonalizadosScreen from "./pages/RoteirosPersonalizadosScreen";
import MeuRoteiroScreen from "./pages/MeuRoteiroScreen";
import DashboardScreen from "./pages/DashboardScreen";
import NotFound from "./pages/NotFound";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import RecoverPasswordScreen from "./pages/RecoverPasswordScreen";
import RadarOfertasScreen from "./pages/RadarOfertasScreen";
import AvaliacaoScreen from "./pages/AvaliacaoScreen";
import TurismoSustentavelScreen from "./pages/TurismoSustentavelScreen";
import MinhaEvolucaoScreen from "./pages/MinhaEvolucaoScreen";
import NovaViagemScreen from "./pages/NovaViagemScreen";
import RoteiroGeradoScreen from "./pages/RoteiroGeradoScreen";
import MeusRadaresScreen from "./pages/MeusRadaresScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem("econotrip_seen_tour");
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Rotas públicas sem o layout base */}
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/registro" element={<RegisterScreen />} />
              <Route path="/recuperar-senha" element={<RecoverPasswordScreen />} />
              <Route path="/confirmacao" element={<ConfirmationScreen />} />
              
              {/* Rotas que usam o LayoutBase */}
              <Route element={<LayoutBase><Outlet /></LayoutBase>}>
                <Route path="/bem-vindo" element={<TelaBoasVindas />} />
                <Route path="/dashboard" element={<DashboardScreen />} />
                <Route path="/busca-voos" element={<TelaBuscaVoos />} />
                <Route path="/resultados-voos" element={<ResultsScreen />} />
                <Route path="/detalhes-voo" element={<FlightDetailsScreen />} />
                <Route path="/detalhes-voo/:id" element={<FlightDetailsScreen />} />
                <Route path="/checkout" element={<CheckoutScreen />} />
                <Route path="/perfil" element={<ProfileScreen />} />
                <Route path="/editar-perfil" element={<EditProfileScreen />} />
                <Route path="/fidelidade" element={<LoyaltyScreen />} />
                <Route path="/minha-evolucao" element={<MinhaEvolucaoScreen />} />
                <Route path="/suporte" element={<SupportScreen />} />
                <Route path="/viagens-sustentaveis" element={<SustainableTravel />} />
                <Route path="/roteiros-personalizados" element={<RoteirosPersonalizadosScreen />} />
                <Route path="/meu-roteiro" element={<MeuRoteiroScreen />} />
                <Route path="/radar-ofertas" element={<RadarOfertasScreen />} />
                <Route path="/avaliacao" element={<AvaliacaoScreen />} />
                <Route path="/turismo-sustentavel" element={<TurismoSustentavelScreen />} />
                <Route path="/nova-viagem" element={<NovaViagemScreen />} />
                <Route path="/roteiro-gerado" element={<RoteiroGeradoScreen />} />
                <Route path="/meus-radares" element={<MeusRadaresScreen />} />

              </Route>

              {/* Rota para página não encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          
          {/* Global components */}
          <HumanSupportButton />
          <AccessibilityBar />
          
          {/* Tour for new users */}
          {showTour && <TourIntro onComplete={handleTourComplete} />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
