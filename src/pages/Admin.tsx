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
      const { count: totalUsers, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // CORREÇÃO: Buscar usuários únicos que tiveram atividade nos últimos 7 dias
      const { data: activeUsers, error: activeError } = await supabase
        .from('readings')
        .select('user_id')
        .ilike('book_name', 'Semana%')
        .gte('completed_at', sevenDaysAgo.toISOString());

      if (activeError) throw activeError;

      // CORREÇÃO: Contar usuários únicos (não registros)
      const uniqueActiveUserIds = new Set(activeUsers?.map(u => u.user_id) || []);
      const activeCount = uniqueActiveUserIds.size;
      const total = totalUsers || 0;
      
      setActivityData({
        total,
        active: activeCount,
        inactive: Math.max(0, total - activeCount)
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

      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total de Leitores</p>
              <p className="text-4xl font-black text-slate-800 mt-1">{activityData?.total || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-emerald-500 text-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Ativos (7 dias)</p>
              <p className="text-4xl font-black text-white mt-1">{activityData?.active || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Engajamento</p>
              <p className="text-4xl font-black text-slate-800 mt-1">{activityRate}%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-slate-800">Visualização de Atividade</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
              </div>
            ) : activityData ? (
              <div className="space-y-8">
                <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${activityRate}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span className="text-sm font-bold text-slate-600">Leitores Engajados</span>
                    </div>
                    <p className="text-slate-400 text-xs">Usuários únicos que registraram progresso na última semana.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-200 rounded-full" />
                      <span className="text-sm font-bold text-slate-600">Leitores em Pausa</span>
                    </div>
                    <p className="text-slate-400 text-xs">Usuários cadastrados que ainda não marcaram leituras recentes.</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-50">
                  <Button 
                    onClick={fetchActivityData}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-8 font-bold"
                  >
                    Atualizar Relatório
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">Nenhum dado encontrado.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;