"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
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
        // Redireciona imediatamente após o sucesso
        navigate("/");
      } else {
        // Se não houver sessão, pode ser que o link expirou ou já foi usado
        setStatus("error");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white p-8 text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="w-16 h-16 text-slate-300 animate-spin" />}
            {status === "success" && <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />}
            {status === "error" && <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl font-bold">!</div>}
          </div>
          <CardTitle className="text-2xl font-black text-slate-800">
            {status === "loading" && "Confirmando seu acesso..."}
            {status === "success" && "E-mail Confirmado!"}
            {status === "error" && "Ops! Algo deu errado"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-500 font-medium">
            {status === "loading" && "Estamos validando sua conta na Jornada Bíblica 2026."}
            {status === "success" && "Sua conta foi ativada com sucesso. Redirecionando..."}
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