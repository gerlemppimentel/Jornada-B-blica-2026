"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Trophy, LayoutGrid, Gem } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import WeeklyProgress from "@/components/WeeklyProgress";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Index = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [userName, setUserName] = useState("");
  const totalWeeks = 47;
  const progressPercentage = Math.round((completedCount / totalWeeks) * 100);

  // Definindo os 7 grupos de conquistas
  const achievementGroups = [
    { id: "pentateuco", title: "Pentateuco", end: 10, color: "#E57373", gemName: "Jaspe" },
    { id: "historicos", title: "Históricos", end: 20, color: "#FFB74D", gemName: "Sardônica" },
    { id: "poeticos", title: "Poéticos", end: 26, color: "#D32F2F", gemName: "Sárdio" },
    { id: "profetas", title: "Profetas", end: 35, color: "#9575CD", gemName: "Ametista" },
    { id: "evangelhos_atos", title: "Evangelhos e Atos", end: 40, color: "#FF8A65", gemName: "Jacinto" },
    { id: "epistolas", title: "Epístolas", end: 46, color: "#4DB6AC", gemName: "Berilo" },
    { id: "apocalipse", title: "Apocalipse", end: 47, color: "#64B5F6", gemName: "Safira" },
  ];

  // Definindo as fases da jornada para o texto informativo
  const journeyPhases = [
    { start: 1, end: 10, title: "Pentateuco", description: "Falta XX semanas para conclusão do Pentateuco" },
    { start: 11, end: 20, title: "Livros Históricos", description: "Falta XX semanas para conclusão dos Livros Históricos" },
    { start: 21, end: 26, title: "Livros Poéticos", description: "Falta XX semanas para conclusão dos Livros Poéticos" },
    { start: 27, end: 32, title: "Profetas Maiores", description: "Falta XX semanas para conclusão dos Profetas Maiores" },
    { start: 33, end: 35, title: "Profetas Menores", description: "Falta XX semanas para conclusão dos Profetas Menores" },
    { start: 36, end: 39, title: "Evangelhos", description: "Falta XX semanas para conclusão dos Evangelhos" },
    { start: 40, end: 40, title: "História Eclesiástica (Atos)", description: "Falta XX semanas para conclusão da História Eclesiástica (Atos)" },
    { start: 41, end: 46, title: "Epístolas Apostólicas", description: "Falta XX semanas para conclusão das Epístolas Apostólicas" },
    { start: 47, end: 47, title: "Livro Profético", description: "Falta XX semanas para conclusão do Livro Profético" }
  ];

  // Função para determinar a fase atual com base nas semanas concluídas
  const getCurrentPhase = () => {
    // Encontrar a próxima fase que ainda não foi concluída
    for (const phase of journeyPhases) {
      if (completedCount < phase.end) {
        const weeksRemaining = phase.end - completedCount;
        return {
          title: "Parabéns pelo seu progresso",
          description: phase.description.replace("XX", weeksRemaining.toString())
        };
      }
    }
    
    // Se todas as fases foram concluídas
    return {
      title: "Parabéns pelo seu progresso",
      description: "Você completou toda a jornada bíblica!"
    };
  };

  const currentPhase = getCurrentPhase();

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
            Bem-vindo(a){userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-slate-500">Acompanhe sua jornada semanal através da Palavra.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Suas Conquistas</CardTitle>
              <Trophy className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center py-2">
                {achievementGroups.map((group) => {
                  const isCompleted = completedCount >= group.end;
                  return (
                    <div
                      key={group.id}
                      className="flex flex-col items-center gap-1 group relative"
                      title={group.title}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-xl transition-all duration-500",
                          isCompleted
                            ? "bg-slate-50 shadow-sm scale-110"
                            : "bg-slate-50/50 grayscale opacity-30"
                        )}
                      >
                        <Gem
                          className="w-6 h-6"
                          style={{ color: isCompleted ? group.color : "#94a3b8" }}
                        />
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-tighter transition-colors",
                        isCompleted ? "text-slate-700" : "text-slate-300"
                      )}>
                        {group.gemName}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                  <span>Progresso Geral</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5 bg-slate-100" />
              </div>
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
              <CardTitle className="text-sm font-medium text-slate-500">{currentPhase.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-slate-800 leading-tight">{currentPhase.description}</div>
              <p className="text-xs text-slate-400 mt-2">Continue sua jornada!</p>
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