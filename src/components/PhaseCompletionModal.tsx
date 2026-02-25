"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gem, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhaseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  phaseName: string;
  gemName: string;
  gemColor: string;
}

const PhaseCompletionModal = ({ isOpen, onClose, phaseName, gemName, gemColor }: PhaseCompletionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-sm rounded-[2.5rem] border-none bg-white p-8 text-center shadow-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4 relative">
            <div className="p-6 rounded-full relative" style={{ backgroundColor: `${gemColor}15` }}>
              <Gem className="w-16 h-16 animate-pulse" style={{ color: gemColor }} />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 animate-bounce" style={{ color: gemColor }} />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-800 leading-tight">
            Parabéns!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-slate-600 font-medium">
            Você concluiu a leitura de: <span className="font-bold" style={{ color: gemColor }}>{phaseName}</span>, siga firme na Jornada!
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: `${gemColor}30` }} />
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: gemColor }}>
              {gemName} da Perseverança
            </p>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 font-bold shadow-lg"
          >
            Continuar Jornada
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseCompletionModal;