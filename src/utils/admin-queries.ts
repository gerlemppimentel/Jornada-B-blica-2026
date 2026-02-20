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

export const fetchTotalReaders = async () => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  if (error) throw error;
  return count || 0;
};

export const fetchWeeklyActiveUsers = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data, error } = await supabase
    .from('readings')
    .select('user_id')
    .gte('completed_at', sevenDaysAgo.toISOString())
    .order('completed_at', { ascending: false });
    
  if (error) throw error;
  
  // Retorna número único de usuários ativos (sem duplicatas)
  return new Set(data.map(r => r.user_id)).size;
};

export const fetchUserReadingStats = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      congregation,
      email,
      readings (
        book_name,
        completed_at
      )
    `)
    .order('first_name');

  if (error) throw error;

  return data.map(user => {
    const readings = user.readings || [];
    const completedWeeks = readings.filter(r => r.book_name.startsWith('Semana ')).length;
    const lastReading = readings.length > 0 
      ? readings.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0].completed_at
      : null;

    return {
      user_id: user.id,
      first_name: user.first_name,
      congregation: user.congregation,
      email: user.email,
      completed_weeks: completedWeeks,
      last_reading_date: lastReading
    };
  });
};

export const fetchCongregationStats = async () => {
  const { data, error } = await supabase.rpc('get_top_congregations');
  
  if (error) throw error;
  return data || [];
};