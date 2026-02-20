"use client";

import { supabase } from "@/integrations/supabase/client";

export interface UserReadingStats {
  user_id: string;
  first_name: string;
  congregation: string;
  email: string;
  completed_weeks: number;
  last_reading_date: string | null;
}

export interface CongregationStats {
  congregation: string;
  reader_count: number;
  total_readings: number;
}

// Função segura para buscar total de leitores
export const fetchTotalReaders = async () => {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error("[Admin Query Error] fetchTotalReaders:", error);
      return 0;
    }
    
    return count || 0;
  } catch (err) {
    console.error("[Admin Query Error] fetchTotalReaders:", err);
    return 0;
  }
};

// Função segura para buscar usuários ativos na última semana
export const fetchWeeklyActiveUsers = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('readings')
      .select('user_id')
      .gte('completed_at', sevenDaysAgo.toISOString());
      
    if (error) {
      console.error("[Admin Query Error] fetchWeeklyActiveUsers:", error);
      return 0;
    }
    
    // Retorna número único de usuários ativos (sem duplicatas)
    return new Set(data?.map(r => r.user_id) || []).size;
  } catch (err) {
    console.error("[Admin Query Error] fetchWeeklyActiveUsers:", err);
    return 0;
  }
};

// Função segura para buscar estatísticas de leitura dos usuários
export const fetchUserReadingStats = async () => {
  try {
    // Primeiro, busca todos os perfis
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        congregation,
        email
      `)
      .order('first_name');

    if (profilesError) {
      console.error("[Admin Query Error] fetchUserReadingStats - profiles:", profilesError);
      return [];
    }

    // Depois, busca as leituras para cada usuário
    const { data: readings, error: readingsError } = await supabase
      .from('readings')
      .select('user_id, book_name, completed_at');

    if (readingsError) {
      console.error("[Admin Query Error] fetchUserReadingStats - readings:", readingsError);
      return [];
    }

    // Mapeia as leituras por usuário
    const readingsByUser = readings?.reduce((acc, reading) => {
      if (!acc[reading.user_id]) {
        acc[reading.user_id] = [];
      }
      acc[reading.user_id].push(reading);
      return acc;
    }, {} as Record<string, any[]>) || {};

    // Combina os dados
    return profiles?.map(user => {
      const userReadings = readingsByUser[user.id] || [];
      const completedWeeks = userReadings.filter(r => r.book_name.startsWith('Semana ')).length;
      const lastReading = userReadings.length > 0 
        ? userReadings.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0].completed_at
        : null;

      return {
        user_id: user.id,
        first_name: user.first_name,
        congregation: user.congregation,
        email: user.email,
        completed_weeks: completedWeeks,
        last_reading_date: lastReading
      };
    }) || [];
  } catch (err) {
    console.error("[Admin Query Error] fetchUserReadingStats:", err);
    return [];
  }
};

// Função segura para buscar estatísticas das congregações
export const fetchCongregationStats = async () => {
  try {
    // Primeiro, busca todas as congregações únicas dos perfis
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('congregation');

    if (profilesError) {
      console.error("[Admin Query Error] fetchCongregationStats - profiles:", profilesError);
      return [];
    }

    // Agrupa usuários por congregação
    const congregations = profiles?.reduce((acc, profile) => {
      if (!profile.congregation) return acc;
      
      if (!acc[profile.congregation]) {
        acc[profile.congregation] = {
          congregation: profile.congregation,
          reader_count: 0,
          total_readings: 0
        };
      }
      acc[profile.congregation].reader_count++;
      return acc;
    }, {} as Record<string, CongregationStats>) || {};

    // Busca todas as leituras que começam com "Semana"
    const { data: readings, error: readingsError } = await supabase
      .from('readings')
      .select('user_id, book_name')
      .ilike('book_name', 'Semana%');

    if (readingsError) {
      console.error("[Admin Query Error] fetchCongregationStats - readings:", readingsError);
      return Object.values(congregations);
    }

    // Mapeia as leituras para as congregações
    const { data: readingProfiles, error: readingProfilesError } = await supabase
      .from('profiles')
      .select('id, congregation');

    if (readingProfilesError) {
      console.error("[Admin Query Error] fetchCongregationStats - readingProfiles:", readingProfilesError);
      return Object.values(congregations);
    }

    const profileMap = readingProfiles?.reduce((acc, profile) => {
      acc[profile.id] = profile.congregation;
      return acc;
    }, {} as Record<string, string>) || {};

    readings?.forEach(reading => {
      const congregation = profileMap[reading.user_id];
      if (congregation && congregations[congregation]) {
        congregations[congregation].total_readings++;
      }
    });

    // Ordena por total de leituras
    return Object.values(congregations).sort((a, b) => b.total_readings - a.total_readings);
  } catch (err) {
    console.error("[Admin Query Error] fetchCongregationStats:", err);
    return [];
  }
};