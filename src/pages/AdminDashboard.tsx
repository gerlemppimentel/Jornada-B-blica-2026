"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Calendar, 
  Filter, 
  Loader2,
  LogOut,
  BarChart3,
  UserCheck,
  Clock
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UserReading {
  user_id: string;
  first_name: string;
  congregation_name: string;
  last_reading_date: string | null;
  weekly_progress: number;
  total_weeks: number;
}

interface CongregationRanking {
  congregation_name: string;
  reader_count: number;
  total_progress: number;
}

const AdminDashboard = () => {
  const { profile, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [readers, setReaders] = useState<UserReading[]>([]);
  const [ranking, setRanking] = useState<CongregationRanking[]>([]);
  const [totalReaders, setTotalReaders] = useState(0);
  const [weeklyActive, setWeeklyActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterCongregation, setFilterCongregation] = useState<string>("all");
  const [congregations, setCongregations] = useState<{ id: string; name: string }[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Verificar acesso administrativo
  useEffect(() => {
    if (authLoading) return;
    
    if (!profile || !isAdmin) {
      toast.error("Acesso negado. Área restrita para administradores.");
      navigate("/");
      return;
    }
  }, [profile, isAdmin, authLoading, navigate]);

  // Carregar congregações
  useEffect(() => {
    const fetchCongregations = async () => {
      try {
        const { data, error } = await supabase
          .from("congregations")
          .select("id, name")
          .order("name");
        
        if (error) throw error;
        setCongregations(data || []);
      } catch (error: any) {
        toast.error("Erro ao carregar congregações: " + error.message);
      }
    };

    if (isAdmin) {
      fetchCongregations();
    }
  }, [isAdmin]);

  // Carregar estatísticas
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;
      
      setStatsLoading(true);
      try {
        // Total de leitores
        const { count: totalReadersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        
        setTotalReaders(totalReadersCount || 0);

        // Leitores ativos nos últimos 7 dias
        const { count: weeklyActiveCount } = await supabase
          .from("readings")
          .select("user_id", { count: "exact", head: true })
          .gte("completed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .neq("book_name", "Semana ");
        
        setWeeklyActive(weeklyActiveCount || 0);

        // Ranking de congregações
        const { data: rankingData, error: rankingError } = await supabase.rpc('get_top_congregations');
        if (rankingError) throw rankingError;
        setRanking(rankingData || []);
      } catch (error: any) {
        toast.error("Erro ao carregar estatísticas: " + error.message);
      } finally {
        setStatsLoading(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  // Carregar dados dos leitores
  useEffect(() => {
    const fetchReaders = async () => {
      if (!isAdmin) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_user_readings_summary');
        
        if (error) throw error;
        setReaders(data || []);
      } catch (error: any) {
        toast.error("Erro ao carregar dados dos leitores: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchReaders();
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
    } else {
      navigate("/login");
    }
  };

  const filteredReaders = filterCongregation === "all" 
    ? readers 
    : readers.filter(reader => reader.congregation_name === filterCongregation);

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Acesso Restrito</h2>
          <p className="text-slate-600">
            Você não tem permissão para acessar esta área. Entre em contato com o administrador.
          </p>
          <Button 
            onClick={() => navigate("/")} 
            className="mt-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
          >
            Voltar para o Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg">
                <BarChart3 className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Dashboard Administrativo</h1>
                <p className="text-xs text-slate-500">Jornada Bíblica 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">{profile.first_name}</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-200"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total de Leitores</CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-800">{totalReaders}</div>
                  <p className="text-xs text-slate-400 mt-1">Registrados no sistema</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Engajamento Semanal</CardTitle>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-800">{weeklyActive}</div>
                  <p className="text-xs text-slate-400 mt-1">Leitores ativos nos últimos 7 dias</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Progresso Médio</CardTitle>
              <BookOpen className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-800">
                    {totalReaders > 0 ? Math.round((readers.reduce((sum, r) => sum + r.weekly_progress, 0) / totalReaders)) : 0}%
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Média de conclusão</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ranking de Congregações */}
        <Card className="border-none shadow-sm bg-white rounded-2xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Ranking de Congregações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : ranking.length > 0 ? (
              <div className="space-y-3">
                {ranking.map((item, index) => (
                  <div 
                    key={item.congregation_name} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.congregation_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-600">{item.reader_count} leitores</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, (item.total_progress / (item.reader_count * 47)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {index === 0 && <Trophy className="w-5 h-5 text-amber-500" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                Nenhuma congregação com atividade registrada.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Detalhes */}
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Detalhes dos Leitores
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <Select value={filterCongregation} onValueChange={setFilterCongregation}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="Filtrar por congregação" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Todas as Congregações</SelectItem>
                  {congregations.map((cong) => (
                    <SelectItem key={cong.id} value={cong.name}>
                      {cong.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : filteredReaders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-500 text-sm">Leitor</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500 text-sm">Congregação</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500 text-sm">Progresso</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500 text-sm">Última Leitura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReaders.map((reader) => (
                      <tr key={reader.user_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800">{reader.first_name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-slate-600">{reader.congregation_name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(reader.weekly_progress / 47) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-600 min-w-[40px]">
                              {reader.weekly_progress}/47
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 text-sm">
                              {reader.last_reading_date 
                                ? new Date(reader.last_reading_date).toLocaleDateString('pt-BR') 
                                : 'Nenhuma leitura'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Nenhum leitor encontrado com os filtros aplicados.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;