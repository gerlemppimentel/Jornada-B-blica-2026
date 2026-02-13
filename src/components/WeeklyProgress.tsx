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
    const isAdding = !completedWeeks.has(week);
    
    // Validação Sequencial
    if (isAdding) {
      // Para marcar a semana N, a semana N-1 deve estar marcada (exceto para a semana 1)
      if (week > 1 && !completedWeeks.has(week - 1)) {
        toast.error(`Você precisa concluir a Semana ${week - 1} antes de marcar a Semana ${week}.`);
        return;
      }
    } else {
      // Para desmarcar a semana N, a semana N+1 não deve estar marcada (para não criar buracos)
      if (completedWeeks.has(week + 1)) {
        toast.error(`Desmarque as semanas seguintes antes de desmarcar a Semana ${week}.`);
        return;
      }
    }

    setSyncing(week);
    const weekLabel = `Semana ${week}`;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isAdding) {
        const { error } = await supabase
          .from("readings")
          .upsert(
            { user_id: user.id, book_name: weekLabel },
            { onConflict: 'user_id,book_name' }
          );
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("readings")
          .delete()
          .eq("user_id", user.id)
          .eq("book_name", weekLabel);
        
        if (error) throw error;
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