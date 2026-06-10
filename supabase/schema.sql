-- Gestia - Schéma base de données de RÉFÉRENCE
-- À exécuter dans l'éditeur SQL de Supabase pour une installation neuve.
--
-- Ce fichier reflète l'état réel de la base, migrations incluses :
--   - 0001_add_secteur_and_atomic_generations.sql
--   - 0002_rgpd_suppression_compte.sql
--   - 0003_numerotation_quota_atomique.sql
-- Sur une base existante, exécuter uniquement les migrations, pas ce fichier.
--
-- Toute évolution du schéma doit être faite via une migration dans
-- supabase/migrations/ PUIS reportée ici pour garder la référence alignée.

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- UTILISATEURS / ENTREPRISES
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  nom_entreprise text,
  siret text,
  adresse text,
  code_postal text,
  ville text,
  telephone text,
  logo_url text,

  -- Identité et coordonnées de facturation (Factur-X, PDF)
  numero_tva text,
  iban text,
  bic text,
  site_web text,
  couleur_principale text default '#0E0E0E',

  -- Mentions légales configurables (paramètres / documents)
  mention_rge text,
  mention_assurance text,
  mention_garantie text,
  mention_tva_debits boolean default false,
  -- Nature des opérations facturées (champ Factur-X)
  type_operation text default 'prestations'
    check (type_operation in ('biens', 'prestations', 'mixte')),
  mention_legale_custom text,
  pied_de_page text,

  -- Secteur d'activité (migration 0001) : utilisé par les agents IA.
  -- Les valeurs autorisées correspondent aux SecteurId de lib/agents/secteurs.ts.
  secteur text
    constraint profiles_secteur_check check (
      secteur is null
      or secteur in (
        'services',
        'artisanat_btp',
        'restauration',
        'sante_bienetre',
        'ecommerce',
        'conseil'
      )
    ),

  -- Abonnement : les valeurs correspondent au type Plan de lib/plans/check-plan.ts.
  plan text default 'starter' check (plan in ('starter', 'essentiel', 'pro')),
  -- Compteur de générations IA du plan starter (incrément atomique, migration 0001)
  nb_generations_ia integer default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  abonnement_actif boolean default false,
  abonnement_fin_periode timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Utilisateur voit son profil" on public.profiles
  for all using (auth.uid() = id);

-- ============================================================
-- CLIENTS
-- ============================================================
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  nom text not null,
  email text,
  telephone text,
  adresse text,
  code_postal text,
  ville text,
  siret text,
  -- Numéro de TVA intracommunautaire (migration 0003)
  numero_tva text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.clients enable row level security;
create policy "Utilisateur gère ses clients" on public.clients
  for all using (auth.uid() = user_id);

-- ============================================================
-- DEVIS
-- ============================================================
create table public.devis (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  numero text not null,
  titre text,
  statut text default 'brouillon' check (statut in ('brouillon', 'envoye', 'accepte', 'refuse', 'expire')),
  date_emission date default current_date,
  date_validite date,
  lignes jsonb default '[]'::jsonb,
  total_ht numeric(10,2) default 0,
  taux_tva numeric(5,2) default 20,
  total_tva numeric(10,2) default 0,
  total_ttc numeric(10,2) default 0,
  notes text,
  conditions text,
  genere_par_ia boolean default false,
  prompt_ia text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.devis enable row level security;
create policy "Utilisateur gère ses devis" on public.devis
  for all using (auth.uid() = user_id);

-- ============================================================
-- FACTURES
-- ============================================================
create table public.factures (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  devis_id uuid references public.devis(id) on delete set null,
  numero text not null,
  titre text,
  statut text default 'brouillon' check (statut in ('brouillon', 'envoyee', 'payee', 'en_retard', 'annulee')),
  date_emission date default current_date,
  date_echeance date,
  lignes jsonb default '[]'::jsonb,
  total_ht numeric(10,2) default 0,
  taux_tva numeric(5,2) default 20,
  total_tva numeric(10,2) default 0,
  total_ttc numeric(10,2) default 0,
  notes text,
  conditions text,
  genere_par_ia boolean default false,
  nb_relances integer default 0,
  derniere_relance_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.factures enable row level security;
create policy "Utilisateur gère ses factures" on public.factures
  for all using (auth.uid() = user_id);

-- ============================================================
-- MODÈLES DE DEVIS RÉUTILISABLES
-- ============================================================
create table public.modeles_devis (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  nom text not null,
  description text,
  lignes jsonb default '[]'::jsonb,
  taux_tva numeric(5,2) default 20,
  conditions text,
  notes text,
  utilise_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.modeles_devis enable row level security;
create policy "Utilisateur gère ses modèles" on public.modeles_devis
  for all using (auth.uid() = user_id);

-- ============================================================
-- EMAILS ENTRANTS (SAV)
-- ============================================================
create table public.emails_entrants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  de text not null,
  sujet text,
  corps text,
  reponse_ia text,
  statut text default 'en_attente' check (statut in ('en_attente', 'traite', 'ignore')),
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.emails_entrants enable row level security;
create policy "Utilisateur gère ses emails" on public.emails_entrants
  for all using (auth.uid() = user_id);

-- ============================================================
-- JOURNAL DES AGENTS IA
-- ============================================================
create table public.agents_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  agent text not null,
  action text not null,
  input jsonb,
  output jsonb,
  tokens_utilises integer,
  duree_ms integer,
  statut text default 'succes' check (statut in ('succes', 'erreur')),
  erreur text,
  created_at timestamptz default now()
);

alter table public.agents_logs enable row level security;
create policy "Utilisateur voit ses logs" on public.agents_logs
  for all using (auth.uid() = user_id);

-- ============================================================
-- RAPPORTS CFO HEBDOMADAIRES
-- ============================================================
create table public.rapports_financiers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  semaine date not null,
  ca_semaine numeric(10,2) default 0,
  ca_mois numeric(10,2) default 0,
  factures_impayees integer default 0,
  montant_impaye numeric(10,2) default 0,
  analyse_ia text,
  recommandations jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.rapports_financiers enable row level security;
create policy "Utilisateur voit ses rapports" on public.rapports_financiers
  for all using (auth.uid() = user_id);

-- ============================================================
-- FONCTION : mise à jour updated_at automatique
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger clients_updated_at before update on public.clients
  for each row execute function update_updated_at();
create trigger devis_updated_at before update on public.devis
  for each row execute function update_updated_at();
create trigger factures_updated_at before update on public.factures
  for each row execute function update_updated_at();
create trigger modeles_devis_updated_at before update on public.modeles_devis
  for each row execute function update_updated_at();

-- ============================================================
-- FONCTION : créer profil après inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FONCTION : incrément atomique du compteur de générations IA
-- (migration 0001 — évite la race condition du read-modify-write)
-- ============================================================
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

-- ============================================================
-- COMPTEURS DE NUMÉROTATION SÉQUENTIELLE (migration 0003)
-- ============================================================
create table public.compteurs_documents (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  dernier_numero_devis integer default 0,
  dernier_numero_facture integer default 0,
  updated_at timestamptz default now()
);

alter table public.compteurs_documents enable row level security;
create policy "Utilisateur gère ses compteurs" on public.compteurs_documents
  for all using (auth.uid() = user_id);

create or replace function public.prochain_numero_document(
  p_user_id uuid,
  p_type text
) returns integer
language plpgsql
security definer
as $$
declare
  v_numero integer;
begin
  insert into public.compteurs_documents (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  if p_type = 'facture' then
    update public.compteurs_documents
    set dernier_numero_facture = dernier_numero_facture + 1, updated_at = now()
    where user_id = p_user_id
    returning dernier_numero_facture into v_numero;
  else
    update public.compteurs_documents
    set dernier_numero_devis = dernier_numero_devis + 1, updated_at = now()
    where user_id = p_user_id
    returning dernier_numero_devis into v_numero;
  end if;

  return v_numero;
end;
$$;

-- ============================================================
-- FONCTION : vérification + incrément atomique du quota IA
-- (migration 0003 — corrige le TOCTOU entre check et incrément)
-- ============================================================
create or replace function public.verifier_et_incrementer_generation(
  p_user_id uuid,
  p_max integer
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_actuel integer;
begin
  select nb_generations_ia into v_actuel
  from public.profiles
  where id = p_user_id
  for update;

  if v_actuel >= p_max then
    return jsonb_build_object('autorise', false, 'nb_generations', v_actuel);
  end if;

  update public.profiles
  set nb_generations_ia = nb_generations_ia + 1
  where id = p_user_id;

  return jsonb_build_object('autorise', true, 'nb_generations', v_actuel + 1);
end;
$$;

-- ============================================================
-- FONCTION : suppression de compte RGPD transactionnelle
-- (migration 0002 — purge toutes les données de l'appelant en une
-- transaction unique ; toute nouvelle table user_id doit y être ajoutée)
-- ============================================================
create or replace function public.supprimer_compte_utilisateur()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Non authentifié';
  end if;

  delete from public.emails_entrants where user_id = v_user_id;
  delete from public.rapports_financiers where user_id = v_user_id;
  delete from public.modeles_devis where user_id = v_user_id;
  delete from public.agents_logs where user_id = v_user_id;
  delete from public.factures where user_id = v_user_id;
  delete from public.devis where user_id = v_user_id;
  delete from public.clients where user_id = v_user_id;
  delete from public.profiles where id = v_user_id;
end;
$$;

revoke all on function public.supprimer_compte_utilisateur() from public;
grant execute on function public.supprimer_compte_utilisateur() to authenticated;
