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
          .map(r => parseInt(r.book_name.replace("Semana ", "")))
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

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isAdding) {
        const { error } = await supabase
          .from("readings")
          .insert({ user_id: user.id, book_name: weekLabel });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("readings")
          .delete()
          .eq("user_id", user.id)
          .eq("book_name", weekLabel);
        if (error) throw error;
      }

      const newWeeks = new Set(completedWeeks);
      if (isAdding) newWeeks.add(week);
      else newWeeks.delete(week);
      
      setCompletedWeeks(newWeeks);
      onProgressUpdate(newWeeks.size);
      toast.success(`${weekLabel} ${isAdding ? 'concluída!' : 'desmarcada.'}`);
    } catch (error: any) {
      toast.error("Erro ao salvar: " + error.message);
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
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
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