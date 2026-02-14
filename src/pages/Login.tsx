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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              first_name: firstName,
              congregation: congregation,
            }
          }
        });
        
        if (error) throw error;
        toast.success("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`
      });
      
      if (error) throw error;
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 py-8">
        <Card className="w-full max-w-md border-none shadow-2xl relative overflow-hidden rounded-[2.5rem] bg-white pt-10">
          <button 
            onClick={() => setIsForgotPassword(false)}
            className="absolute left-6 top-8 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors z-10"
            title="Voltar para o login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center px-8 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-full max-w-[180px] relative overflow-hidden rounded-[2rem] shadow-lg border-2 border-slate-50 aspect-square bg-white">
              <img src="/nova-jornada.jpg" alt="Jornada Bíblica 2026" className="w-full h-full object-contain" />
            </div>
          </div>
          
          <CardHeader className="space-y-1 text-center px-8 pb-4">
            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">
              Recuperar Senha
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Informe seu e-mail para receber instruções
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleForgotPassword} className="space-y-4">
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
              
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 text-lg font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
                >
                  {loading ? "Enviando..." : "Enviar Instruções"}
                </Button>
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
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 py-8">
      <Card className="w-full max-w-md border-none shadow-2xl relative overflow-hidden rounded-[2.5rem] bg-white pt-10">
        {isSignUp && (
          <button 
            onClick={() => setIsSignUp(false)}
            className="absolute left-6 top-8 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors z-10"
            title="Voltar para o login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex justify-center px-8 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-full max-w-[180px] relative overflow-hidden rounded-[2rem] shadow-lg border-2 border-slate-50 aspect-square bg-white">
            <img src="/nova-jornada.jpg" alt="Jornada Bíblica 2026" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <CardHeader className="space-y-1 text-center px-8 pb-4">
          <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">
            {isSignUp ? "Criar Conta" : "Entrar na Jornada"}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            {isSignUp ? "Preencha seus dados para começar" : "AD Jaraguá do Sul"}
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
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              )}
              
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