-- Migration : support des secteurs d'activité + compteur de générations atomique
-- À exécuter dans l'éditeur SQL de Supabase.

-- ============================================================
-- 1. Secteur d'activité sur le profil
-- ============================================================
-- Utilisé par les agents IA (marketing, stratégie) pour adapter le contenu.
-- Les valeurs autorisées correspondent aux SecteurId de lib/agents/secteurs.ts.
alter table public.profiles
  add column if not exists secteur text;

alter table public.profiles
  drop constraint if exists profiles_secteur_check;

alter table public.profiles
  add constraint profiles_secteur_check
  check (
    secteur is null
    or secteur in (
      'services',
      'artisanat_btp',
      'restauration',
      'sante_bienetre',
      'ecommerce',
      'conseil'
    )
  );

-- ============================================================
-- 2. Incrément atomique du compteur de générations IA
-- ============================================================
-- Évite la race condition (TOCTOU) du read-modify-write applicatif :
-- plusieurs requêtes concurrentes pouvaient toutes lire la même valeur
-- et dépasser le quota du plan starter.
create or replace function public.increment_generations_ia(p_user_id uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.profiles
     set nb_generations_ia = coalesce(nb_generations_ia, 0) + 1
   where id = p_user_id
  returning nb_generations_ia;
$$;
