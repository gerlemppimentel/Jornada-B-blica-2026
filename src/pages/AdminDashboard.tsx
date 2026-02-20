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
  UserCheck,
  AlertTriangle
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
import { runDiagnostics } from "@/utils/admin-diagnostics";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { checkAdminAccess, loading: authLoading } = useAuth();
  const [totalReaders, setTotalReaders] = useState(0);
  const [weeklyActive, setWeeklyActive] = useState(0);
  const [users, setUsers] = useState<UserReadingStats[]>([]);
  const [congregationStats, setCongregationStats] = useState<CongregationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCongregation, setFilterCongregation] = useState<string>("all");
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);

  useEffect(() => {
    if (!authLoading) {
      if (checkAdminAccess()) {
        loadDashboardData();
      }
    }
  }, [authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log("[Admin] Iniciando carregamento de dados...");

      // Primeiro, executar diagnóstico
      const diagnostics = await runDiagnostics();
      console.log("[Admin] Resultados do diagnóstico:", diagnostics);
      setDiagnosticResults(diagnostics);

      if (!diagnostics.auth.success) {
        toast.error("Erro de autenticação: " + diagnostics.auth.error);
        return;
      }

      // Se autenticação OK, carregar dados
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

      console.log("[Admin] Dados carregados:", {
        totalReaders: totalReadersCount,
        weeklyActive: weeklyActiveCount,
        users: userStats.length,
        congregations: congStats.length
      });

      setTotalReaders(totalReadersCount);
      setWeeklyActive(weeklyActiveCount);
      setUsers(userStats);
      setCongregationStats(congStats);
    } catch (error: any) {
      console.error("[Admin] Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados: " + error.message);
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

  const toggleDiagnosticMode = () => {
    setDiagnosticMode(!diagnosticMode);
    if (!diagnosticMode) {
      loadDashboardData();
    }
  };

  const filteredUsers = filterCongregation === "all" 
    ? users 
    : users.filter(user => user.congregation === filterCongregation);

  const congregations = Array.from(new Set(users.map(u => u.congregation))).sort();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

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
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDiagnosticMode}
                className="text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:border-yellow-300"
              >
                <AlertTriangle className="w-4 h-4" />
              </Button>
              
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
        {/* Modo Diagnóstico */}
        {diagnosticMode && diagnosticResults && (
          <Card className="border-none shadow-sm bg-white rounded-2xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Diagnóstico do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(diagnosticResults).map(([key, result]: [string, any]) => (
                  <div key={key} className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                      <h3 className="font-medium text-slate-800">{key}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{result.details}</p>
                    {result.error && (
                      <p className="text-sm text-red-500 mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rest of the dashboard content remains the same */}
        {/* ... (previous cards and table code) ... */}
      </main>
    </div>
  );
};

export default AdminDashboard;