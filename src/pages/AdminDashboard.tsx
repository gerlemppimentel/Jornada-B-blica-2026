"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  UserCheck
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  fetchTotalReaders,
  fetchWeeklyActiveUsers,
  fetchUserReadingStats,
  fetchCongregationStats,
  type UserReadingStats,
  type CongregationStats
} from "@/utils/admin-queries";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalReaders, setTotalReaders] = useState(0);
  const [weeklyActive, setWeeklyActive] = useState(0);
  const [users, setUsers] = useState<UserReadingStats[]>([]);
  const [congregationStats, setCongregationStats] = useState<CongregationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCongregation, setFilterCongregation] = useState<string>("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo para melhor performance
      const [
        totalReadersCount,
        weeklyActiveCount,
        userStats,
        congStats
      ] = await Promise.all([
        fetchTotalReaders(),
        fetchWeeklyActiveUsers(),
        fetchUserReadingStats(),
        fetchCongregationStats()
      ]);

      setTotalReaders(totalReadersCount);
      setWeeklyActive(weeklyActiveCount);
      setUsers(userStats);
      setCongregationStats(congStats);
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
    } else {
      navigate("/login");
    }
  };

  const filteredUsers = filterCongregation === "all" 
    ? users 
    : users.filter(user => user.congregation === filterCongregation);

  const congregations = Array.from(new Set(users.map(u => u.congregation))).sort();

  return (
    <div className="min-h-screen bg-slate-50">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total de Leitores</CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
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
              {loading ? (
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
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-800">
                    {totalReaders > 0 
                      ? Math.round((users.reduce((sum, u) => sum + ((u.completed_weeks / 47) * 100), 0) / totalReaders)) 
                      : 0}%
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
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : congregationStats.length > 0 ? (
              <div className="space-y-3">
                {congregationStats.map((item, index) => (
                  <div 
                    key={item.congregation} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.congregation}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-600">{item.reader_count} leitores</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, (item.total_readings / (item.reader_count * 47)) * 100)}%` }}
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
                    <SelectItem key={cong} value={cong}>
                      {cong}
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
            ) : filteredUsers.length > 0 ? (
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
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800">{user.first_name}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-slate-600">{user.congregation}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(user.completed_weeks / 47) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-600 min-w-[40px]">
                              {user.completed_weeks}/47
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 text-sm">
                              {user.last_reading_date 
                                ? new Date(user.last_reading_date).toLocaleDateString('pt-BR') 
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