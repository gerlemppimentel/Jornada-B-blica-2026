"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import WeekButton from "./WeekButton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const WeeklyProgress = ({ onProgressUpdate }: { onProgressUpdate: (count: number) => void }) => {
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

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

    // Verificação para marcação sequencial
    if (isAdding) {
      // Encontrar a última semana concluída
      let lastCompleted = 0;
      for (let i = week - 1; i >= 1; i--) {
        if (completedWeeks.has(i)) {
          lastCompleted = i;
          break;
        }
      }

      // Verificar se está tentando marcar uma semana que não é sequencial
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
        // Usamos upsert para evitar erro de duplicata caso o registro já exista no banco
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
      } else {
        // Permitir desmarcar apenas a última semana marcada
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
      }

      // Atualiza o estado local apenas após sucesso no banco
      setCompletedWeeks(prev => {
        const next = new Set(prev);
        if (isAdding) next.add(week);
        else next.delete(week);
        onProgressUpdate(next.size);
        return next;
      });

      toast.success(`${weekLabel} ${isAdding ? 'concluída!' : 'desmarcada.'}`);
    } catch (error: any) {
      // Se for erro de duplicata, apenas sincronizamos o estado local
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
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 sm:gap-4">
      {Array.from({ length: 47 }, (_, i) => i + 1).map((week) => (
        <WeekButton 
          key={week} 
          week={week} 
          isCompleted={completedWeeks.has(week)} 
          onClick={toggleWeek} 
          disabled={syncing === week} 
        />
      ))}
    </div>
  );
};

export default WeeklyProgress;