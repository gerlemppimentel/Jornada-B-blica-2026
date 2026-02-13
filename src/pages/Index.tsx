"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Calendar, Trophy, LayoutGrid } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import WeeklyProgress from "@/components/WeeklyProgress";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [userName, setUserName] = useState("");
  const totalWeeks = 47;
  const progressPercentage = Math.round((completedCount / totalWeeks) * 100);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if (!user) return;

        // Tenta pegar da tabela profiles primeiro
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .maybeSingle();
        
        if (profile?.first_name) {
          setUserName(profile.first_name);
        } else if (user.user_metadata?.first_name) {
          setUserName(user.user_metadata.first_name);
        } else if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Bem-Vindo{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-slate-500">Acompanhe sua jornada semanal através da Palavra.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Progresso Anual</CardTitle>
              <Trophy className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{progressPercentage}%</div>
              <Progress value={progressPercentage} className="h-2 mt-2 bg-slate-100" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Semanas Concluídas</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{completedCount} / {totalWeeks}</div>
              <p className="text-xs text-slate-400 mt-1">Rumo ao alvo!</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Ano da Jornada</CardTitle>
              <Calendar className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">2026</div>
              <p className="text-xs text-slate-400 mt-1">AD Jaraguá do Sul</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="sticky top-16 z-40 bg-slate-50/95 backdrop-blur-sm -mx-4 px-4 py-4 flex items-center justify-between border-b border-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-slate-400" />
              Plano de Leitura Semanal
            </h2>
          </div>
          
          <div className="pt-2">
            <WeeklyProgress onProgressUpdate={setCompletedCount} />
          </div>
        </div>

        <div className="max-w-2xl pt-4">
          <Card className="border-none shadow-sm bg-slate-800 text-white rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">Versículo de Apoio</h3>
              <p className="text-lg italic font-serif">
                "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."
              </p>
              <p className="text-sm text-slate-400">— Salmos 119:105</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 border-t border-slate-100 mt-auto">
        <div className="text-center text-slate-400 text-sm">
          © 2026 AD Jaraguá do Sul - Jornada Bíblica
        </div>
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;