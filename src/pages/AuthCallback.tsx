"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro no callback:", error);
        setStatus("error");
        return;
      }

      if (session) {
        setStatus("success");
        // Pequeno delay para o usuário ver a confirmação
        setTimeout(() => navigate("/"), 1500);
      } else {
        setStatus("error");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white p-8 text-center">
        <CardHeader>
          <div className="flex justify-center mb-6">
            {status === "loading" ? (
              <div className="w-48 h-48 rounded-[2rem] shadow-lg overflow-hidden border-2 border-slate-50 animate-pulse">
                <img src="/GS.jpeg" alt="Gerlem Software" className="w-full h-full object-cover" />
              </div>
            ) : status === "success" ? (
              <div className="relative">
                <div className="w-48 h-48 rounded-[2rem] shadow-lg overflow-hidden border-2 border-slate-50 opacity-50">
                  <img src="/GS.jpeg" alt="Gerlem Software" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-lg animate-bounce" />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl font-bold">!</div>
            )}
          </div>
          <CardTitle className="text-2xl font-black text-slate-800">
            {status === "loading" && "Confirmando seu acesso..."}
            {status === "success" && "Acesso Confirmado!"}
            {status === "error" && "Ops! Algo deu errado"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-500 font-medium">
            {status === "loading" && "Estamos validando sua conta na Jornada Bíblica 2026."}
            {status === "success" && "Sua conta foi ativada com sucesso. Preparando sua jornada..."}
            {status === "error" && "O link de confirmação pode ter expirado ou já foi utilizado. Tente fazer login novamente."}
          </p>
          
          {status === "error" && (
            <Button 
              onClick={() => navigate("/login")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 font-bold"
            >
              Ir para o Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;