"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <div className="w-64 h-64 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-slate-50">
            <img src="/GS.jpeg" alt="Gerlem Software" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
};

export default ProtectedRoute;