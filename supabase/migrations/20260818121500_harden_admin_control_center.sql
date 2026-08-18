create index if not exists content_proposals_app_id_idx on public.content_proposals(app_id);
create index if not exists proposal_reviews_proposal_id_idx on public.proposal_reviews(proposal_id);
create index if not exists proposal_reviews_reviewer_id_idx on public.proposal_reviews(reviewer_id);
create index if not exists agent_runs_app_id_idx on public.agent_runs(app_id);
