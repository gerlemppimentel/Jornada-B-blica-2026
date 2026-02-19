"use client";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Info, Globe, ExternalLink, Trophy, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const Navbar = () => {
  const navigate = useNavigate();
  const [topCongregations, setTopCongregations] = useState<{ congregation: string; reader_count: number }[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const fetchTopCongregations = async () => {
    setLoadingTop(true);
    try {
      const { data, error } = await supabase.rpc('get_top_congregations');
      if (error) throw error;
      setTopCongregations(data || []);
    } catch (error) {
      console.error("Erro ao buscar top congregações:", error);
    } finally {
      setLoadingTop(false);
    }
  };

  const partnerSites = [
    { name: "Timothy School", url: "https://timothyschool.org.br/" },
    { name: "SBB - Sociedade Bíblica do Brasil", url: "https://www.sbb.com.br/" },
    { name: "Canal AD Jaraguá do Sul no Youtube", url: "https://www.youtube.com/@adjaraguadosul" },
    { name: "Canal Sintonize Gospel no Youtube", url: "https://www.youtube.com/@sintonizegospel" },
  ];

  return (
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4"
                  onClick={fetchTopCongregations}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">Ranking</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-800">Top 5 Congregações</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-xs text-slate-500 mb-4 font-medium">
                    Congregações com mais leitores ativos nos últimos 7 dias.
                  </p>
                  
                  {loadingTop ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                    </div>
                  ) : topCongregations.length > 0 ? (
                    <div className="space-y-2">
                      {topCongregations.map((item, index) => (
                        <div
                          key={item.congregation}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate">{item.congregation}</p>
                            <p className="text-xs text-slate-500">{item.reader_count} {item.reader_count === 1 ? 'leitor ativo' : 'leitores ativos'}</p>
                          </div>
                          {index === 0 && <Trophy className="w-5 h-5 text-amber-500" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      Nenhuma atividade registrada nos últimos 7 dias.
                    </div>
                  )}
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-xl w-full sm:w-auto">
                      Voltar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Sites</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-800">Sites Parceiros</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  {partnerSites.map((site) => (
                    <a
                      key={site.name}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                    >
                      <span className="text-slate-700 font-medium text-sm sm:text-base">{site.name}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </a>
                  ))}
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-xl w-full sm:w-auto">
                      Voltar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4">
                  <span className="text-lg font-bold leading-none">˂†˃</span>
                  <span className="hidden sm:inline">Software</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-800">Software Cristão</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Todos os nossos aplicativos tem versículos bíblicos incluídos no Código Fonte que, em algum momento, podem ser lidos por outros programadores.
                  </p>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Fornecer soluções digitais eficientes para igrejas é nosso propósito. Assim colaboramos com o crescimento do Reino de Deus.
                  </p>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-xl w-full sm:w-auto">
                      Voltar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 sm:px-4">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Sobre</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-800">Sobre o Aplicativo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-lg">Jornada Bíblica 2026 1.0</p>
                    <p className="text-slate-500 font-medium">Assembleia de Deus em Jaraguá do Sul - Santa Catarina</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desenvolvedor</p>
                    <div>
                      <p className="text-slate-800 font-semibold">Gerlem Pantoja Pimentel</p>
                      <a 
                        href="mailto:gerlem.dev@outlook.com" 
                        className="text-blue-600 hover:text-blue-800 text-sm transition-colors hover:underline"
                      >
                        suporte@gerlem.dev.br
                      </a>
                    </div>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-xl w-full sm:w-auto">
                      Voltar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600 flex items-center gap-2 rounded-xl px-2 sm:px-4"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;