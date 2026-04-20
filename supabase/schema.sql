-- Gestia - Schéma base de données
-- À exécuter dans l'éditeur SQL de Supabase

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
  plan text default 'starter' check (plan in ('starter', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  abonnement_actif boolean default false,
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
