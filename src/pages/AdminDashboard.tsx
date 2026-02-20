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
  const navigate = useNavigate();
  const [readers, setReaders] = useState<UserReading[]>([]);
  const [ranking, setRanking] = useState<CongregationRanking[]>([]);
  const [totalReaders, setTotalReaders] = useState(0);
  const [weeklyActive, setWeeklyActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterCongregation, setFilterCongregation] = useState<string>("all");
  const [congregations, setCongregations] = useState<{ id: string; name: string }[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
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
                <p className="text-sm font-medium text-slate-800">Administrador</p>
                <p className="text-xs text-slate-500">Acesso Total</p>
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
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Bem-vindo ao Admin</h2>
          <p className="text-slate-600">Dashboard administrativo da Jornada Bíblica 2026</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;