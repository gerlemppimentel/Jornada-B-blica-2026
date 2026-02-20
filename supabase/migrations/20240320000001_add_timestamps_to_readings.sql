-- Adicionar coluna created_at com valor padrão e timestamp atual
ALTER TABLE public.readings 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Atualizar registros existentes
UPDATE public.readings 
SET created_at = completed_at 
WHERE created_at IS NULL;