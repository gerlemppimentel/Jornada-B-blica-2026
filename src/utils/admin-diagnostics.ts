"use client";

import { supabase } from "@/integrations/supabase/client";

interface DiagnosticResult {
  success: boolean;
  data: any;
  error?: string;
  details?: string;
}

export const runDiagnostics = async () => {
  const results: Record<string, DiagnosticResult> = {};

  // 1. Teste de Autenticação
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    results.auth = {
      success: !!session,
      data: { userId: session?.user?.id },
      error: authError?.message,
      details: session ? 'Usuário autenticado' : 'Sem sessão ativa'
    };
  } catch (e: any) {
    results.auth = {
      success: false,
      data: null,
      error: e.message,
      details: 'Erro ao verificar autenticação'
    };
  }

  // 2. Teste de Acesso ao Perfil
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .single();

    results.profile = {
      success: !!profile,
      data: profile ? { role: profile.user_role } : null,
      error: profileError?.message,
      details: `Perfil ${profile ? 'encontrado' : 'não encontrado'}`
    };
  } catch (e: any) {
    results.profile = {
      success: false,
      data: null,
      error: e.message,
      details: 'Erro ao acessar perfil'
    };
  }

  // 3. Teste de Contagem de Leitores
  try {
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    results.readerCount = {
      success: count !== null,
      data: { count },
      error: countError?.message,
      details: `Total de leitores: ${count}`
    };
  } catch (e: any) {
    results.readerCount = {
      success: false,
      data: null,
      error: e.message,
      details: 'Erro ao contar leitores'
    };
  }

  // 4. Teste de Leituras Recentes
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: readings, error: readingsError } = await supabase
      .from('readings')
      .select('*')
      .gte('completed_at', sevenDaysAgo.toISOString());

    results.recentReadings = {
      success: !!readings,
      data: { count: readings?.length || 0 },
      error: readingsError?.message,
      details: `Leituras nos últimos 7 dias: ${readings?.length || 0}`
    };
  } catch (e: any) {
    results.recentReadings = {
      success: false,
      data: null,
      error: e.message,
      details: 'Erro ao buscar leituras recentes'
    };
  }

  // 5. Teste de Congregações
  try {
    const { data: congregations, error: congError } = await supabase
      .from('profiles')
      .select('congregation')
      .not('congregation', 'is', null);

    results.congregations = {
      success: !!congregations,
      data: { count: congregations?.length || 0 },
      error: congError?.message,
      details: `Congregações encontradas: ${congregations?.length || 0}`
    };
  } catch (e: any) {
    results.congregations = {
      success: false,
      data: null,
      error: e.message,
      details: 'Erro ao buscar congregações'
    };
  }

  return results;
};