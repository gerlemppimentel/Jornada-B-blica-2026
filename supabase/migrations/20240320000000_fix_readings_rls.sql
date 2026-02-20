-- Primeiro, garantir que RLS está ativado
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: usuários podem ver suas próprias leituras
CREATE POLICY "Usuários podem ver suas próprias leituras"
ON public.readings
FOR SELECT
USING (auth.uid() = user_id);

-- Política para INSERT: usuários podem inserir suas próprias leituras
CREATE POLICY "Usuários podem inserir suas próprias leituras"
ON public.readings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: usuários podem deletar suas próprias leituras
CREATE POLICY "Usuários podem deletar suas próprias leituras"
ON public.readings
FOR DELETE
USING (auth.uid() = user_id);

-- Política especial para admin ver todas as leituras
CREATE POLICY "Admins podem ver todas as leituras"
ON public.readings
FOR SELECT
TO authenticated
USING (
  (SELECT user_role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);