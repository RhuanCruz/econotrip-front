
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TelaBoasVindas from "./pages/TelaBoasVindas";
import TelaBuscaVoos from "./pages/TelaBuscaVoos";
import ResultsScreen from "./pages/ResultsScreen";
import FlightDetailsScreen from "./pages/FlightDetails/FlightDetailsScreen";
import CheckoutScreen from "./pages/CheckoutScreen";
import ConfirmationScreen from "./pages/ConfirmationScreen";
import ProfileScreen from "./pages/ProfileScreen";
import LoyaltyScreen from "./pages/LoyaltyScreen";
import SupportScreen from "./pages/SupportScreen";
import NotFound from "./pages/NotFound";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/bem-vindo" element={<TelaBoasVindas />} />
          <Route path="/busca-voos" element={<TelaBuscaVoos />} />
          <Route path="/resultados-voos" element={<ResultsScreen />} />
          <Route path="/detalhes-voo" element={<FlightDetailsScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/confirmacao" element={<ConfirmationScreen />} />
          <Route path="/perfil" element={<ProfileScreen />} />
          <Route path="/fidelidade" element={<LoyaltyScreen />} />
          <Route path="/suporte" element={<SupportScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/registro" element={<RegisterScreen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
