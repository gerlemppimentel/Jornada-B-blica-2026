"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WeekButtonProps {
  week: number;
  isCompleted: boolean;
  onClick: (week: number) => void;
  disabled?: boolean;
}

const WeekButton = ({ week, isCompleted, onClick, disabled }: WeekButtonProps) => {
  return (
    <button
      onClick={() => onClick(week)}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 border-2",
        "hover:scale-105 active:scale-95",
        isCompleted 
          ? "bg-amber-400 border-amber-500 text-amber-950 shadow-lg shadow-amber-200/50" 
          : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
      )}
    >
      <span className="text-xs font-bold uppercase tracking-tighter opacity-60">Semana</span>
      <span className="text-2xl font-black">{week}</span>
      {isCompleted && (
        <div className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full p-0.5 shadow-sm">
          <Check size={12} strokeWidth={4} />
        </div>
      )}
    </button>
  );
};

export default WeekButton;