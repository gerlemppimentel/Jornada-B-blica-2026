"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import WeekButton from "./WeekButton";
import { toast } from "sonner";
import { Loader2, Crown, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { playToc, playPo } from "@/utils/audio";
import PhaseCompletionModal from "./PhaseCompletionModal";

const PHASES = [
  { end: 10, name: "Pentateuco" },
  { end: 20, name: "Livros Históricos" },
  { end: 26, name: "Livros Poéticos" },
  { end: 32, name: "Profetas Maiores" },
  { end: 35, name: "Profetas Menores" },
  { end: 39, name: "Evangelhos" },
  { end: 40, name: "História Eclesiástica (Atos)" },
  { end: 46, name: "Epístolas Apostólicas" },
  { end: 47, name: "Livro Profético" }
];

const WeeklyProgress = ({ onProgressUpdate }: { onProgressUpdate: (count: number) => void }) => {
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [currentPhaseName, setCurrentPhaseName] = useState("");

  const totalWeeks = 47;
  const isAllCompleted = completedWeeks.size === totalWeeks;

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (isAllCompleted && !loading) {
      triggerConfetti();
    }
  }, [isAllCompleted, loading]);

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("readings")
        .select("book_name")
        .eq("user_id", user.id);

      if (error) throw error;

      const weeks = new Set(
        data
          .filter(r => r.book_name.startsWith("Semana "))
          .map(r => parseInt(r.book_name.replace("Semana ", "").trim()))
      );

      setCompletedWeeks(weeks);
      onProgressUpdate(weeks.size);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = async (week: number) => {
    setSyncing(week);
    const isAdding = !completedWeeks.has(week);
    const weekLabel = `Semana ${week}`;

    if (isAdding) {
      let lastCompleted = 0;
      for (let i = week - 1; i >= 1; i--) {
        if (completedWeeks.has(i)) {
          lastCompleted = i;
          break;
        }
      }

      if (lastCompleted < week - 1) {
        toast.error(`Você precisa concluir a semana ${week - 1} primeiro!`);
        setSyncing(null);
        return;
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isAdding) {
        const { error } = await supabase
          .from("readings")
          .upsert(
            {
              user_id: user.id,
              book_name: weekLabel
            },
            { onConflict: 'user_id,book_name' }
          );

        if (error) throw error;
        playToc();

        // Verificar se concluiu uma fase
        const phase = PHASES.find(p => p.end === week);
        if (phase) {
          setCurrentPhaseName(phase.name);
          setShowPhaseModal(true);
        }
      } else {
        const maxCompleted = Math.max(...Array.from(completedWeeks));
        if (week !== maxCompleted && completedWeeks.size > 0) {
          toast.error("Você só pode desmarcar a última semana concluída!");
          setSyncing(null);
          return;
        }

        const { error } = await supabase
          .from("readings")
          .delete()
          .eq("user_id", user.id)
          .eq("book_name", weekLabel);

        if (error) throw error;
        playPo();
      }

      setCompletedWeeks(prev => {
        const next = new Set(prev);
        if (isAdding) next.add(week);
        else next.delete(week);
        onProgressUpdate(next.size);
        return next;
      });

      toast.success(`${weekLabel} ${isAdding ? 'concluída!' : 'desmarcada.'}`);
    } catch (error: any) {
      if (error.code === '23505') {
        fetchProgress();
      } else {
        toast.error("Erro ao salvar: " + error.message);
      }
    } finally {
      setSyncing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PhaseCompletionModal 
        isOpen={showPhaseModal} 
        onClose={() => setShowPhaseModal(false)} 
        phaseName={currentPhaseName} 
      />

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 sm:gap-4">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
          <WeekButton 
            key={week} 
            week={week} 
            isCompleted={completedWeeks.has(week)} 
            onClick={toggleWeek} 
            disabled={syncing === week} 
          />
        ))}
      </div>

      {isAllCompleted && (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-amber-50 to-white rounded-[2.5rem] border-2 border-amber-200 animate-in zoom-in duration-500 shadow-xl shadow-amber-100/50">
          <div className="relative">
            <Crown className="w-24 h-24 text-amber-500 animate-bounce" />
            
            {/* Safiras encrustadas na coroa */}
            <div className="absolute top-[42%] left-[18%] w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
            <div className="absolute top-[32%] left-[46%] w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse delay-75" />
            <div className="absolute top-[42%] right-[18%] w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse delay-150" />
            <div className="absolute bottom-[28%] left-[32%] w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
            <div className="absolute bottom-[28%] right-[32%] w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
            
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-amber-300 animate-pulse delay-75" />
          </div>
          <h3 className="text-2xl font-black text-amber-900 mt-4 text-center">Jornada Concluída!</h3>
          <p className="text-amber-700 font-medium text-center mt-2">
            Parabéns! Você completou todas as 47 semanas da Jornada Bíblica 2026.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyProgress;