"use client";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Info, Globe, ExternalLink, LayoutDashboard, Mail, Trophy, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import CongregationRankingModal from "./CongregationRankingModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showRankingModal, setShowRankingModal] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const partnerSites = [
    { name: "Timothy School", url: "https://timothyschool.org.br/" },
    { name: "SBB - Sociedade Bíblica do Brasil", url: "https://www.sbb.com.br/" },
    { name: "Canal AD Jaraguá do Sul no Youtube", url: "https://www.youtube.com/@adjaraguadosul" },
    { name: "Canal Sintonize Gospel no Youtube", url: "https://www.youtube.com/@sintonizegospel" },
  ];

  return (
    <>
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-slate-800 p-2 rounded-lg shrink-0">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800 hidden xs:block text-sm sm:text-base">
                Jornada Bíblica 2026
              </span>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Botão de Ranking - VISÍVEL PARA TODOS */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRankingModal(true)}
                className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Ranking</span>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4"
                  >
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline">Sobre</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-black text-slate-800">
                      Sobre a Jornada
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-slate-800">Jornada Bíblica - Versão 2026</h3>
                      <div className="mt-4 space-y-4 text-sm text-slate-600">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</p>
                          <a 
                            href="https://adjaraguadosul.com.br/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 font-bold text-blue-600 hover:text-blue-800 transition-colors group"
                          >
                            <span className="text-center underline underline-offset-4 decoration-blue-200 group-hover:decoration-blue-800">
                              AD Jaraguá do Sul
                            </span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                        
                        <div className="border-t border-slate-100 pt-4 space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desenvolvedor</p>
                          <p className="font-semibold text-slate-700">Gerlem Pimentel</p>
                          <a 
                            href="mailto:gerlem.dev@outlook.com"
                            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors group"
                          >
                            <Mail className="w-3 h-3 text-slate-400 group-hover:text-slate-900" />
                            <span className="underline underline-offset-2 decoration-slate-200 group-hover:decoration-slate-900">
                              gerlem.dev@outlook.com
                            </span>
                          </a>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            © 2026 Todos os Direitos Reservados
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full text-slate-500 hover:text-slate-700 flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Voltar
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">Links Úteis</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-md rounded-[2.5rem] p-6 border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800">Links Úteis</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    {partnerSites.map((site) => (
                      <a
                        key={site.name}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group"
                      >
                        <span className="font-semibold text-slate-700 group-hover:text-slate-900">{site.name}</span>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </a>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full text-slate-500 hover:text-slate-700 flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Painel Admin</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <CongregationRankingModal 
        isOpen={showRankingModal} 
        onClose={() => setShowRankingModal(false)} 
      />
    </>
  );
};

export default Navbar;