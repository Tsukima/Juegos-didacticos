drop policy if exists "admins manage apps" on public.managed_apps;
drop policy if exists "admins manage proposals" on public.content_proposals;
drop policy if exists "admins manage reviews" on public.proposal_reviews;
drop policy if exists "admins manage agent runs" on public.agent_runs;
create policy "admins manage apps" on public.managed_apps for all to authenticated using (exists (select 1 from public.admin_users where user_id=(select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id=(select auth.uid())));
create policy "admins manage proposals" on public.content_proposals for all to authenticated using (exists (select 1 from public.admin_users where user_id=(select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id=(select auth.uid())));
create policy "admins manage reviews" on public.proposal_reviews for all to authenticated using (exists (select 1 from public.admin_users where user_id=(select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id=(select auth.uid())) and reviewer_id=(select auth.uid()));
create policy "admins manage agent runs" on public.agent_runs for all to authenticated using (exists (select 1 from public.admin_users where user_id=(select auth.uid()))) with check (exists (select 1 from public.admin_users where user_id=(select auth.uid())));
drop function if exists public.is_app_admin();
