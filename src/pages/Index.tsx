"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Book, Calendar, Trophy } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  // Dados fictícios para demonstração da interface
  const progress = 15;
  const todayReading = "Gênesis 1-3";
  const streak = 5;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Olá, Discípulo!</h1>
          <p className="text-slate-500">Continue sua jornada através da Palavra de Deus.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Progresso Total</CardTitle>
              <Trophy className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{progress}%</div>
              <Progress value={progress} className="h-2 mt-2 bg-slate-100" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Leitura de Hoje</CardTitle>
              <Calendar className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{todayReading}</div>
              <p className="text-xs text-slate-400 mt-1">Plano Anual 2026</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Sequência</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{streak} dias</div>
              <p className="text-xs text-slate-400 mt-1">Firme no propósito!</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reading List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Book className="w-5 h-5" />
              Livros da Bíblia
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué"].map((book) => (
                <Card key={book} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-xl">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium text-slate-700">{book}</span>
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar / Daily Verse */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-800 text-white rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">Versículo do Dia</h3>
                <p className="text-lg italic font-serif">
                  "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."
                </p>
                <p className="text-sm text-slate-400">— Salmos 119:105</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-slate-100 mt-auto">
        <div className="text-center text-slate-400 text-sm">
          © 2026 AD Jaraguá do Sul - Jornada Bíblica
        </div>
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;