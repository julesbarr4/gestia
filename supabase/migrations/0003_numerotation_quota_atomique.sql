-- Migration : numérotation séquentielle des documents + quota IA atomique
-- À exécuter dans l'éditeur SQL de Supabase.

-- ============================================================
-- 1. Numéro de TVA intracommunautaire sur les clients
-- ============================================================
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS numero_tva text;

-- ============================================================
-- 2. Compteurs de numérotation séquentielle (devis / factures)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.compteurs_documents (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  dernier_numero_devis integer DEFAULT 0,
  dernier_numero_facture integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.compteurs_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateur gère ses compteurs" ON public.compteurs_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.prochain_numero_document(
  p_user_id uuid,
  p_type text
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_numero integer;
BEGIN
  INSERT INTO public.compteurs_documents (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  IF p_type = 'facture' THEN
    UPDATE public.compteurs_documents
    SET dernier_numero_facture = dernier_numero_facture + 1, updated_at = now()
    WHERE user_id = p_user_id
    RETURNING dernier_numero_facture INTO v_numero;
  ELSE
    UPDATE public.compteurs_documents
    SET dernier_numero_devis = dernier_numero_devis + 1, updated_at = now()
    WHERE user_id = p_user_id
    RETURNING dernier_numero_devis INTO v_numero;
  END IF;

  RETURN v_numero;
END;
$$;

-- ============================================================
-- 3. Vérification + incrément atomique du quota de générations IA
-- ============================================================
CREATE OR REPLACE FUNCTION public.verifier_et_incrementer_generation(
  p_user_id uuid,
  p_max integer
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_actuel integer;
BEGIN
  SELECT nb_generations_ia INTO v_actuel
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_actuel >= p_max THEN
    RETURN jsonb_build_object('autorise', false, 'nb_generations', v_actuel);
  END IF;

  UPDATE public.profiles
  SET nb_generations_ia = nb_generations_ia + 1
  WHERE id = p_user_id;

  RETURN jsonb_build_object('autorise', true, 'nb_generations', v_actuel + 1);
END;
$$;
