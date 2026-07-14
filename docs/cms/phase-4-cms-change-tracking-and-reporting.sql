-- Phase 4: CMS change tracking and monthly reporting
-- Run this after the existing CMS table and policy setup.

create table if not exists public.cms_change_log (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.cms_plan_pages(id) on delete set null,
  plan_family text not null,
  plan_key text not null default '',
  page_heading text not null default '',
  section_key text not null check (section_key in ('page', 'benefits', 'coverHighlights', 'priceRows', 'assets')),
  action_type text not null check (action_type in ('update', 'replace_file', 'revert')),
  table_name text not null,
  record_id uuid,
  changed_by uuid references auth.users(id) on delete set null,
  changed_by_email text not null default '',
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz not null default timezone('utc', now()),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  change_summary text not null default '',
  previous_values jsonb not null default '{}'::jsonb,
  next_values jsonb not null default '{}'::jsonb,
  changed_fields text[] not null default '{}'::text[],
  file_name_before text,
  file_name_after text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.cms_change_log
  drop constraint if exists cms_change_log_action_type_check;

alter table public.cms_change_log
  add constraint cms_change_log_action_type_check
  check (action_type in ('update', 'replace_file', 'revert'));

create index if not exists cms_change_log_completed_at_idx
  on public.cms_change_log (completed_at desc);

create index if not exists cms_change_log_page_id_idx
  on public.cms_change_log (page_id);

create index if not exists cms_change_log_plan_family_idx
  on public.cms_change_log (plan_family);

create index if not exists cms_change_log_changed_by_email_idx
  on public.cms_change_log (changed_by_email);

alter table public.cms_change_log enable row level security;

drop policy if exists cms_change_log_it_manager_select on public.cms_change_log;
drop policy if exists cms_change_log_it_manager_insert on public.cms_change_log;

create policy cms_change_log_it_manager_select
on public.cms_change_log
for select
to authenticated
using (public.is_day1_it_manager());

create policy cms_change_log_it_manager_insert
on public.cms_change_log
for insert
to authenticated
with check (public.is_day1_it_manager());
