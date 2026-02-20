"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, PieChart } from "lucide-react";
import { toast } from "sonner";

interface UserActivityData {
  active: number;
  inactive: number;
  total: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<UserActivityData | null>(null);

  // Função simples para buscar dados de atividade
  const fetchActivityData = async () => {
    try {
      console.log("Iniciando busca de dados de atividade...");
      setLoading(true);

      // 1. Primeiro, buscar total de usuários
      const { count: totalUsers, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // 2. Depois, buscar usuários ativos nos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeUsers, error: activeError } = await supabase
        .from('readings')
        .select('user_id')
        .gte('completed_at', sevenDaysAgo.toISOString());

      if (activeError) throw activeError;

      // 3. Calcular métricas
      const uniqueActiveUsers = new Set(activeUsers?.map(u => u.user_id) || []).size;
      const total = totalUsers || 0;
      
      console.log("Dados coletados:", {
        total,
        active: uniqueActiveUsers,
        inactive: total - uniqueActiveUsers
      });

      setActivityData({
        total,
        active: uniqueActiveUsers,
        inactive: total - uniqueActiveUsers
      });

    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg">
                <PieChart className="text-white w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-slate-800">
                Dashboard Administrativo
              </h1>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader>
            <CardTitle>Atividade dos Usuários (Últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : activityData ? (
              <div className="space-y-6">
                {/* Gráfico Simplificado */}
                <div className="flex gap-4 justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                      {activityData.active}
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-600">Ativos</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl">
                      {activityData.inactive}
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-600">Inativos</p>
                  </div>
                </div>

                {/* Métricas */}
                <div className="text-center space-y-1">
                  <p className="text-sm text-slate-500">
                    Total de Usuários: <span className="font-bold text-slate-700">{activityData.total}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    Taxa de Atividade: <span className="font-bold text-slate-700">
                      {Math.round((activityData.active / activityData.total) * 100)}%
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;