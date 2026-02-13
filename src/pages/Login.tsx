"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [congregation, setCongregation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              congregation: congregation,
            }
          }
        });
        if (error) throw error;
        toast.success("Cadastro realizado! Você já pode entrar.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 py-8">
      {/* Imagem de Abertura Oficial - Redimensionada em 50% */}
      <div className="w-full max-w-[220px] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative overflow-hidden rounded-[2rem] shadow-xl border-4 border-white aspect-square bg-white">
          <img 
            src="/nova-jornada.jpg" 
            alt="Jornada Bíblica 2026" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <Card className="w-full max-w-md border-none shadow-xl relative overflow-hidden rounded-[2rem]">
        {isSignUp && (
          <button 
            onClick={() => setIsSignUp(false)}
            className="absolute left-6 top-8 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors z-10"
            title="Voltar para o login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <CardHeader className="space-y-1 text-center pt-10 px-8">
          <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">
            {isSignUp ? "Criar Conta" : "Entrar na Jornada"}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            {isSignUp 
              ? "Preencha seus dados para começar" 
              : "AD Jaraguá do Sul"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-600 font-semibold ml-1">Nome Completo</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Seu nome"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="congregation" className="text-slate-600 font-semibold ml-1">Congregação</Label>
                  <Input
                    id="congregation"
                    type="text"
                    placeholder="Ex: Central"
                    value={congregation}
                    onChange={(e) => setCongregation(e.target.value)}
                    required
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 font-semibold ml-1">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 font-semibold ml-1">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button 
                type="submit"
                disabled={loading} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 text-lg font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
              >
                {loading ? "Processando..." : (isSignUp ? "Concluir Cadastro" : "Acessar Agora")}
              </Button>
              
              {!isSignUp && (
                <Button 
                  variant="ghost" 
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="w-full text-slate-500 rounded-2xl h-12 hover:bg-slate-50 font-medium"
                >
                  Ainda não tem conta? <span className="text-slate-900 font-bold ml-1 hover:underline">Cadastre-se</span>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <footer className="mt-8 text-center space-y-2">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          © 2026 Jornada Bíblica • Assembleia de Deus
        </p>
      </footer>
    </div>
  );
};

export default Login;