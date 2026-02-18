"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CONGREGATIONS = [
  "Amizade",
  "Barra do Rio Cerro",
  "Barra do Rio Cerro II",
  "Chocoleite",
  "Ebenezer",
  "Estrada Nova",
  "Firenze",
  "Ilha da Figueira",
  "Jaraguá 84",
  "Jaraguazinho",
  "João Pessoa",
  "Loteamento Souza",
  "Monte Sião",
  "Monte Sinai",
  "Nereu Ramos",
  "Nova Jerusalém",
  "Pedra Branca",
  "Rio da Luz",
  "Rio Molha",
  "São Luiz",
  "Sede",
  "Shalon",
  "Três Rios do Norte",
  "Três Rios do Sul",
  "Vieira",
  "Vila Lalau"
  "Vila Rau",
  "Vila Schimidt",
  "Outras"
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [congregation, setCongregation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    // Exatamente 6 dígitos numéricos
    const regex = /^[0-9]{6}$/;
    return regex.test(pass);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (!firstName) {
        toast.error("Por favor, informe seu nome.");
        return;
      }
      if (!congregation) {
        toast.error("Por favor, selecione sua congregação.");
        return;
      }
      if (!validatePassword(password)) {
        toast.error("A senha deve ter exatamente 6 números.");
        return;
      }
    }

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
        toast.success("Cadastro realizado! Verifique seu e-mail.");
        setNeedsConfirmation(true);
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            setNeedsConfirmation(true);
            throw new Error("E-mail não confirmado.");
          }
          if (error.message === "Invalid login credentials") {
            throw new Error("e-mail ou senha incorretos. Tente novamente");
          }
          throw error;
        }
        
        toast.success("Login realizado!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error("Informe seu e-mail.");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      toast.success("E-mail reenviado!");
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
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <CardHeader className="text-center px-8 pb-4">
            <CardTitle className="text-2xl font-black text-slate-800">Recuperar Senha</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={(e) => { e.preventDefault(); toast.info("Funcionalidade em desenvolvimento"); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-2xl h-12 bg-slate-50" />
              </div>
              <Button type="submit" className="w-full bg-slate-900 rounded-2xl h-14 font-bold">Enviar Instruções</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 py-8">
      <Card className="w-full max-w-md border-none shadow-2xl relative overflow-hidden rounded-[2.5rem] bg-white pt-10">
        {(isSignUp || needsConfirmation) && (
          <button 
            onClick={() => { setIsSignUp(false); setNeedsConfirmation(false); }}
            className="absolute left-6 top-8 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex justify-center px-8 mb-4">
          <div className="w-full max-w-[220px] rounded-[2rem] shadow-lg border-2 border-slate-50 aspect-square bg-white overflow-hidden">
            <img src="/app-logo.jpg" alt="Logo Jornada Bíblica" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <CardHeader className="text-center px-8 pb-4">
          <CardTitle className="text-2xl font-black text-slate-800">
            {needsConfirmation ? "Confirme seu E-mail" : isSignUp ? "Criar Conta" : "Entrar na Jornada"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-8 pb-10">
          {needsConfirmation ? (
            <div className="space-y-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">
                  Enviamos um link de ativação para o seu e-mail. Por favor, verifique sua caixa de entrada e a pasta de spam.
                </p>
              </div>
              
              <Button onClick={handleResendConfirmation} disabled={loading} className="w-full bg-slate-900 rounded-2xl h-12 font-bold">
                {loading ? "Reenviando..." : "Reenviar E-mail de Confirmação"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome Completo</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="rounded-2xl h-12 bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="congregation">Congregação</Label>
                    <Select onValueChange={setCongregation} value={congregation} required>
                      <SelectTrigger className="rounded-2xl h-12 bg-slate-50">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl max-h-[300px]">
                        {CONGREGATIONS.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-2xl h-12 bg-slate-50" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  {isSignUp && <span className="text-[10px] text-slate-400 font-bold uppercase">6 números</span>}
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    maxLength={6}
                    inputMode="numeric"
                    className="rounded-2xl h-12 bg-slate-50 pr-12" 
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {!isSignUp && (
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3 pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-slate-900 rounded-2xl h-14 text-lg font-bold shadow-lg">
                  {loading ? "Processando..." : (isSignUp ? "Concluir Cadastro" : "Acessar Agora")}
                </Button>
                
                {!isSignUp && (
                  <Button variant="ghost" type="button" onClick={() => setIsSignUp(true)} className="w-full text-slate-500 rounded-2xl h-12">
                    Ainda não tem conta? <span className="text-slate-900 font-bold ml-1">Cadastre-se</span>
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;