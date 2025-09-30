/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlannerService } from "@/api/dashboard/DashboardService";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { motion } from "framer-motion";
import {
  Users,
  Radar,
  Route,
  Bell,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Shield,
  RefreshCw,
  LogOut,
  Activity,
  Calendar,
  Clock,
  ArrowUpRight
} from "lucide-react";



interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function DashboardScreenStandalone({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();
  // Use provided user or fallback
  const currentUser = user || { fullname: "Admin Dashboard" };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    totalRadars: number;
    totalNotifications: number;
    totalSimulations: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthStore((state) => state.token);

  // Simular atualização de dados

  const fetchMetrics = async () => {
    if (!token) {
      setError("Token de autenticação não encontrado.");
      setLoading(false);
      toast({
        title: "Acesso restrito",
        description: "Este é um ambiente de administração. Faça login para continuar.",
        variant: "destructive"
      });
      navigate(-1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await PlannerService.getDashboard(token);
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar métricas do dashboard.");
      toast({
        title: "Acesso restrito",
        description: "Este é um ambiente de administração. Faça login para continuar.",
        variant: "destructive"
      });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMetrics();
    setIsRefreshing(false);
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {loading && (
          <div className="text-center py-8 text-gray-500">Carregando métricas...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-500 font-medium">{error}</div>
        )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-econotrip-primary rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600">
                Olá, {currentUser?.fullname?.split(' ')[0] || 'Admin'}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Usuários Cadastrados */}
            <motion.div variants={itemAnimation}>
              <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all h-40 flex flex-col overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {metrics ? metrics.totalUsers.toLocaleString() : '--'}
                  </h3>
                  <p className="text-gray-600 text-xs font-medium">Usuários Cadastrados</p>
                </div>
              </Card>
            </motion.div>

            {/* Radares */}
            <motion.div variants={itemAnimation}>
              <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all h-40 flex flex-col overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Radar className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {metrics ? metrics.totalRadars.toLocaleString() : '--'}
                  </h3>
                  <p className="text-gray-600 text-xs font-medium">Total de Radares</p>
                </div>
              </Card>
            </motion.div>

            {/* Simulações */}
            <motion.div variants={itemAnimation}>
              <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all h-40 flex flex-col overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Route className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {metrics ? metrics.totalSimulations.toLocaleString() : '--'}
                  </h3>
                  <p className="text-gray-600 text-xs font-medium">Simulações</p>
                </div>
              </Card>
            </motion.div>

            {/* Notificações */}
            <motion.div variants={itemAnimation}>
              <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all h-40 flex flex-col overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {metrics ? metrics.totalNotifications.toLocaleString() : '--'}
                  </h3>
                  <p className="text-gray-600 text-xs font-medium">Notificações Enviadas</p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Ações Rápidas */}
          <motion.div variants={itemAnimation}>
            <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-econotrip-primary" />
                Ações Rápidas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="secondary"
                  className="flex items-center justify-between p-4 h-auto bg-gray-50 hover:bg-gray-100 border-gray-200"
                  onClick={() => window.open('https://econotrip.collabyt.com', '_blank')}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-econotrip-primary" />
                    <span>App Principal</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>


                <Button
                  variant="secondary"
                  className="flex items-center justify-between p-4 h-auto bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  disabled
                >
                  <div className="flex items-center gap-3">
                    <Radar className="w-5 h-5 text-orange-600" />
                    <span>Ver Radares</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>


                <Button
                  variant="secondary"
                  className="flex items-center justify-between p-4 h-auto bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  disabled
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Usuários</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Status do Sistema */}
          <motion.div variants={itemAnimation}>
            <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-econotrip-primary" />
                Status do Sistema
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium text-green-900">API Online</p>
                    <p className="text-xs text-green-700">Funcionando normalmente</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Notificações</p>
                    <p className="text-xs text-green-700">Sistema ativo</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}