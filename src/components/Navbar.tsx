"use client";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-2 rounded-lg">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 hidden sm:block">Jornada Bíblica 2026</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-slate-600 flex items-center gap-2 hover:bg-slate-50 rounded-xl">
                  <Info className="w-4 h-4" />
                  <span className="hidden xs:inline">Sobre...</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-800">Sobre o Aplicativo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-lg">Jornada Bíblica 2026 1.0</p>
                    <p className="text-slate-500 font-medium">Assembleia de Deus em Jaraguá do Sul</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desenvolvedor</p>
                    <div>
                      <p className="text-slate-800 font-semibold">Gerlem Pantoja Pimentel</p>
                      <a 
                        href="mailto:gerlem.dev@outlook.com" 
                        className="text-blue-600 hover:text-blue-800 text-sm transition-colors hover:underline"
                      >
                        gerlem.dev@outlook.com
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
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600 flex items-center gap-2 rounded-xl"
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