-- Função para contar usuários ativos dos últimos 7 dias
CREATE OR REPLACE FUNCTION public.count_active_users_last_7_days()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_count integer;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO active_count
  FROM readings
  WHERE book_name ILIKE 'Semana%'
    AND completed_at >= NOW() - INTERVAL '7 days';
    
  RETURN COALESCE(active_count, 0);
END;
$$;

-- Conceder permissão para usuários autenticados executarem a função
GRANT EXECUTE ON FUNCTION public.count_active_users_last_7_days() TO authenticated;