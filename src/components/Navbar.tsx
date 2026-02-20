"use client";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Info, Globe, ExternalLink, Trophy, Loader2, LayoutDashboard } from "lucide-react";
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

const Navbar = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
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
            {/* Botões para usuários normais */}
            {!isAdmin && (
              <>
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
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Sobre a Jornada Bíblica</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Informações sobre a jornada...</p>
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Links Úteis</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {partnerSites.map((site) => (
                        <a
                          key={site.name}
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg"
                        >
                          <span>{site.name}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {/* Botão do Dashboard apenas para admins */}
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

            {/* Botão de Logout para todos */}
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
  );
};

export default Navbar;