"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  color: string;
}

const PhaseInfoModal = ({ isOpen, onClose, title, description, color }: PhaseInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg rounded-[2.5rem] border-none bg-white p-6 sm:p-8 shadow-2xl overflow-hidden">
        <DialogHeader className="relative pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl shrink-0" style={{ backgroundColor: `${color}15` }}>
              <BookOpen className="w-8 h-8" style={{ color: color }} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Nova Fase</p>
              <DialogTitle className="text-2xl font-black text-slate-800 leading-tight">
                Conheça o {title}
              </DialogTitle>
            </div>
          </div>
          <Sparkles className="absolute top-0 right-0 w-6 h-6 opacity-20 animate-pulse" style={{ color: color }} />
        </DialogHeader>
        
        <div className="space-y-6">
          <ScrollArea className="h-[300px] sm:h-auto max-h-[400px] pr-4">
            <p className="text-slate-600 leading-relaxed font-medium text-sm sm:text-base text-justify">
              {description}
            </p>
          </ScrollArea>
          
          <div className="pt-2">
            <Button 
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 font-bold shadow-lg transition-all active:scale-95"
            >
              Siga com a Leitura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseInfoModal;