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
}

const PhaseCompletionModal = ({ isOpen, onClose, phaseName }: PhaseCompletionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-sm rounded-[2.5rem] border-none bg-white p-8 text-center shadow-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4 relative">
            <div className="bg-blue-50 p-6 rounded-full relative">
              <Gem className="w-16 h-16 text-blue-500 animate-pulse" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-blue-400 animate-bounce" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-800 leading-tight">
            Parabéns!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-slate-600 font-medium">
            Você concluiu a leitura do <span className="text-blue-600 font-bold">{phaseName}</span>, siga firme na Jornada!
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-1.5 bg-blue-100 rounded-full" />
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Safira da Perseverança</p>
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