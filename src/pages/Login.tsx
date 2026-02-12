import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">Jornada Bíblica 2026</CardTitle>
          <CardDescription className="text-slate-500">
            Igreja Evangélica Assembleia de Deus em Jaraguá do Sul
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome Completo</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Seu nome"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="congregation">Congregação</Label>
                  <Input
                    id="congregation"
                    type="text"
                    placeholder="Ex: Central"
                    value={congregation}
                    onChange={(e) => setCongregation(e.target.value)}
                    required
                    className="rounded-xl"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button 
                type="submit"
                disabled={loading} 
                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-12"
              >
                {loading ? "Processando..." : (isSignUp ? "Criar Conta" : "Entrar")}
              </Button>
              <Button 
                variant="ghost" 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-slate-600 rounded-xl"
              >
                {isSignUp ? "Já tenho uma conta" : "Não tenho conta? Cadastre-se"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;