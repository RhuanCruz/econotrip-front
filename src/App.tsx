
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LayoutBase } from "./components/layout/LayoutBase";

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
import NotFound from "./pages/NotFound";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import RecoverPasswordScreen from "./pages/RecoverPasswordScreen";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/busca-voos" element={<TelaBuscaVoos />} />
              <Route path="/resultados-voos" element={<ResultsScreen />} />
              <Route path="/detalhes-voo" element={<FlightDetailsScreen />} />
              <Route path="/checkout" element={<CheckoutScreen />} />
              <Route path="/perfil" element={<ProfileScreen />} />
              <Route path="/editar-perfil" element={<EditProfileScreen />} />
              <Route path="/fidelidade" element={<LoyaltyScreen />} />
              <Route path="/suporte" element={<SupportScreen />} />
            </Route>

            {/* Rota para página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
