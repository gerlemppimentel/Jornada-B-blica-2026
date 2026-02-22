"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, PieChart, Users, TrendingUp, ArrowLeft } from "lucide-react";
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

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      
      // Buscar total de usuários
      const { count: totalUsers, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Usar a função RPC para contar usuários ativos dos últimos 7 dias
      const { data: activeCount, error: rpcError } = await supabase
        .rpc('count_active_users_last_7_days');

      if (rpcError) throw rpcError;

      const total = totalUsers || 0;
      const active = activeCount || 0;
      
      setActivityData({
        total,
        active,
        inactive: Math.max(0, total - active)
      });
    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();

    // Subscription para atualização em tempo real
    const subscription = supabase
      .channel('readings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'readings'
        },
        () => {
          // Atualizar dados quando novo registro for inserido
          fetchActivityData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE', 
          schema: 'public',
          table: 'readings'
        },
        () => {
          // Atualizar dados quando registro for deletado
          fetchActivityData();
        }
      )
      .subscribe();

    // Cleanup da subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const activityRate = activityData?.total ? Math.round((activityData.active / activityData.total) * 100) : 0;

  // Calcular ângulos para o gráfico de pizza
  const getPieChartData = () => {
    if (!activityData) return null;
    
    const { active, inactive } = activityData;
    const total = active + inactive;
    if (total === 0) return null;

    const activeAngle = (active / total) * 360;
    const inactiveAngle = (inactive / total) * 360;

    return {
      active: Math.max(activeAngle, 1), // Mínimo de 1 grau para garantir visibilidade
      inactive: Math.max(inactiveAngle, 1)
    };
  };

  const pieData = getPieChartData();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/")}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </Button>
              <div>
                <h1 className="text-xl font-black text-slate-800">Painel de Controle</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administração</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-600 rounded-xl"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 py-8">
        {/* Grid 2x2 para os cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primeira linha: Total de Leitores e Leitores Ativos */}
          <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total de Leitores</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{activityData?.total || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-emerald-500 text-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Ativos (7 dias)</p>
              <p className="text-3xl font-black text-white mt-1">{activityData?.active || 0}</p>
            </CardContent>
          </Card>

          {/* Segunda linha: Engajamento e Visualização de Atividade */}
          <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center mb-3">
                <PieChart className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Engajamento</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{activityRate}%</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-black text-slate-800">Visualização de Atividade</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                </div>
              ) : activityData ? (
                <div className="space-y-4">
                  {/* Gráfico de Pizza compacto */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="50" 
                          fill="#f1f5f9"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />
                        
                        {pieData && (
                          <circle 
                            cx="60" 
                            cy="60" 
                            r="50" 
                            fill="transparent"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray={`${pieData.active} ${360 - pieData.active}`}
                            strokeLinecap="round"
                          />
                        )}
                        
                        {pieData && activityData.inactive > 0 && (
                          <circle 
                            cx="60" 
                            cy="60" 
                            r="50" 
                            fill="transparent"
                            stroke="#f59e0b"
                            strokeWidth="10"
                            strokeDasharray={`${pieData.inactive} ${360 - pieData.inactive}`}
                            strokeDashoffset={`-${pieData.active}`}
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs font-bold text-slate-500">Total</div>
                          <div className="text-xl font-black text-slate-800">
                            {activityData.total}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legendas compactas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold text-slate-600">Engajados</span>
                      </div>
                      <div className="text-sm font-bold text-slate-800">{activityData.active}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-xs font-bold text-slate-600">Em Pausa</span>
                      </div>
                      <div className="text-sm font-bold text-slate-800">{activityData.inactive}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">Nenhum dado encontrado.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;