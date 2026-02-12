"use client";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
            <Button variant="ghost" size="icon" className="rounded-full text-slate-600">
              <User className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600 flex items-center gap-2"
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