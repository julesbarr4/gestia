-- Migration : suppression de compte RGPD complète et transactionnelle
-- À exécuter dans l'éditeur SQL de Supabase.
--
-- Une fonction plpgsql s'exécute dans une transaction unique : si une
-- suppression échoue, tout est annulé et l'utilisateur n'est jamais laissé
-- dans un état partiellement supprimé.
--
-- La fonction s'appuie sur auth.uid() (session de l'appelant) : un
-- utilisateur ne peut supprimer que ses propres données, même si la
-- fonction est SECURITY DEFINER pour contourner les politiques RLS.
--
-- IMPORTANT : toute nouvelle table portant un user_id doit être ajoutée ici
-- (le test tests/rgpd-suppression.test.ts vérifie la couverture).

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

  -- Tables enfants d'abord (les FK vers devis/clients sont en SET NULL,
  -- mais supprimer dans cet ordre évite des écritures intermédiaires).
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

-- Seuls les utilisateurs authentifiés peuvent invoquer la purge.
revoke all on function public.supprimer_compte_utilisateur() from public;
grant execute on function public.supprimer_compte_utilisateur() to authenticated;
