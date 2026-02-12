import { createClient } from '@supabase/supabase-js';

// Estas variáveis são preenchidas automaticamente após adicionar a integração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Usamos valores temporários para evitar erro de inicialização se as chaves não estiverem prontas
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);