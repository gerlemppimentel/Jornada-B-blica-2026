"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Medal, Crown, Users, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface CongregationRanking {
  congregation: string;
  reader_count: number;
}

const CongregationRankingModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [ranking, setRanking] = useState<CongregationRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchRanking();
    }
  }, [isOpen]);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      
      // Usar a função RPC definida no Supabase para buscar as congregações com mais leitores
      const { data, error } = await supabase
        .rpc('get_top_congregations');

      if (error) throw error;
      
      setRanking(data || []);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position: number) => {
    const iconClass = "w-5 h-5";
    
    switch(position) {
      case 1:
        return <Crown className={`${iconClass} text-amber-500`} />;
      case 2:
        return <Medal className={`${iconClass} text-slate-400`} />;
      case 3:
        return <Medal className={`${iconClass} text-amber-700`} />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-400">{position}</span>
        </div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md rounded-[2.5rem] border-none bg-white p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Classificação</p>
              <DialogTitle className="text-xl font-black text-slate-800 leading-tight">
                Top 5 - Congregações
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-800"></div>
            </div>
          ) : ranking.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-200" />
              <p className="font-medium">Nenhum dado disponível ainda</p>
              <p className="text-sm">As congregações aparecerão aqui conforme o progresso das leituras</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ranking.map((item, index) => (
                <div
                  key={item.congregation}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                      {getMedalIcon(index + 1)}
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-slate-900">
                      {item.congregation}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-800">{item.reader_count}</span>
                    <span className="text-xs text-slate-400 font-medium">leitores</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-100">
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-400 font-medium">
              Dados atualizados automaticamente dos últimos 7 dias
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CongregationRankingModal;