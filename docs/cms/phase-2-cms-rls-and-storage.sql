-- Phase 2: CMS access control for browser-side anon key + authenticated Supabase users
-- This SQL locks CMS table writes to the IT Manager user and keeps plan documents publicly readable.

create or replace function public.is_day1_it_manager()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'day1healthdeveloper@gmail.com';
$$;

comment on function public.is_day1_it_manager()
is 'Returns true when the authenticated user is the Day1 Health CMS IT Manager.';

grant execute on function public.is_day1_it_manager() to authenticated;

alter table public.cms_plan_pages enable row level security;
alter table public.cms_plan_benefits enable row level security;
alter table public.cms_plan_cover_highlights enable row level security;
alter table public.cms_plan_price_rows enable row level security;
alter table public.cms_plan_assets enable row level security;

drop policy if exists cms_plan_pages_it_manager_select on public.cms_plan_pages;
drop policy if exists cms_plan_pages_it_manager_insert on public.cms_plan_pages;
drop policy if exists cms_plan_pages_it_manager_update on public.cms_plan_pages;
drop policy if exists cms_plan_pages_it_manager_delete on public.cms_plan_pages;

create policy cms_plan_pages_it_manager_select
on public.cms_plan_pages
for select
to authenticated
using (public.is_day1_it_manager());

create policy cms_plan_pages_it_manager_insert
on public.cms_plan_pages
for insert
to authenticated
with check (public.is_day1_it_manager());

create policy cms_plan_pages_it_manager_update
on public.cms_plan_pages
for update
to authenticated
using (public.is_day1_it_manager())
with check (public.is_day1_it_manager());

create policy cms_plan_pages_it_manager_delete
on public.cms_plan_pages
for delete
to authenticated
using (public.is_day1_it_manager());

drop policy if exists cms_plan_benefits_it_manager_select on public.cms_plan_benefits;
drop policy if exists cms_plan_benefits_it_manager_insert on public.cms_plan_benefits;
drop policy if exists cms_plan_benefits_it_manager_update on public.cms_plan_benefits;
drop policy if exists cms_plan_benefits_it_manager_delete on public.cms_plan_benefits;

create policy cms_plan_benefits_it_manager_select
on public.cms_plan_benefits
for select
to authenticated
using (public.is_day1_it_manager());

create policy cms_plan_benefits_it_manager_insert
on public.cms_plan_benefits
for insert
to authenticated
with check (public.is_day1_it_manager());

create policy cms_plan_benefits_it_manager_update
on public.cms_plan_benefits
for update
to authenticated
using (public.is_day1_it_manager())
with check (public.is_day1_it_manager());

create policy cms_plan_benefits_it_manager_delete
on public.cms_plan_benefits
for delete
to authenticated
using (public.is_day1_it_manager());

drop policy if exists cms_plan_cover_highlights_it_manager_select on public.cms_plan_cover_highlights;
drop policy if exists cms_plan_cover_highlights_it_manager_insert on public.cms_plan_cover_highlights;
drop policy if exists cms_plan_cover_highlights_it_manager_update on public.cms_plan_cover_highlights;
drop policy if exists cms_plan_cover_highlights_it_manager_delete on public.cms_plan_cover_highlights;

create policy cms_plan_cover_highlights_it_manager_select
on public.cms_plan_cover_highlights
for select
to authenticated
using (public.is_day1_it_manager());

create policy cms_plan_cover_highlights_it_manager_insert
on public.cms_plan_cover_highlights
for insert
to authenticated
with check (public.is_day1_it_manager());

create policy cms_plan_cover_highlights_it_manager_update
on public.cms_plan_cover_highlights
for update
to authenticated
using (public.is_day1_it_manager())
with check (public.is_day1_it_manager());

create policy cms_plan_cover_highlights_it_manager_delete
on public.cms_plan_cover_highlights
for delete
to authenticated
using (public.is_day1_it_manager());

drop policy if exists cms_plan_price_rows_it_manager_select on public.cms_plan_price_rows;
drop policy if exists cms_plan_price_rows_it_manager_insert on public.cms_plan_price_rows;
drop policy if exists cms_plan_price_rows_it_manager_update on public.cms_plan_price_rows;
drop policy if exists cms_plan_price_rows_it_manager_delete on public.cms_plan_price_rows;

create policy cms_plan_price_rows_it_manager_select
on public.cms_plan_price_rows
for select
to authenticated
using (public.is_day1_it_manager());

create policy cms_plan_price_rows_it_manager_insert
on public.cms_plan_price_rows
for insert
to authenticated
with check (public.is_day1_it_manager());

create policy cms_plan_price_rows_it_manager_update
on public.cms_plan_price_rows
for update
to authenticated
using (public.is_day1_it_manager())
with check (public.is_day1_it_manager());

create policy cms_plan_price_rows_it_manager_delete
on public.cms_plan_price_rows
for delete
to authenticated
using (public.is_day1_it_manager());

drop policy if exists cms_plan_assets_it_manager_select on public.cms_plan_assets;
drop policy if exists cms_plan_assets_it_manager_insert on public.cms_plan_assets;
drop policy if exists cms_plan_assets_it_manager_update on public.cms_plan_assets;
drop policy if exists cms_plan_assets_it_manager_delete on public.cms_plan_assets;

create policy cms_plan_assets_it_manager_select
on public.cms_plan_assets
for select
to authenticated
using (public.is_day1_it_manager());

create policy cms_plan_assets_it_manager_insert
on public.cms_plan_assets
for insert
to authenticated
with check (public.is_day1_it_manager());

create policy cms_plan_assets_it_manager_update
on public.cms_plan_assets
for update
to authenticated
using (public.is_day1_it_manager())
with check (public.is_day1_it_manager());

create policy cms_plan_assets_it_manager_delete
on public.cms_plan_assets
for delete
to authenticated
using (public.is_day1_it_manager());

update storage.buckets
set public = true
where id = 'plan-docs';

drop policy if exists plan_docs_public_read on storage.objects;
drop policy if exists plan_docs_it_manager_select on storage.objects;
drop policy if exists plan_docs_it_manager_insert on storage.objects;
drop policy if exists plan_docs_it_manager_update on storage.objects;
drop policy if exists plan_docs_it_manager_delete on storage.objects;

create policy plan_docs_public_read
on storage.objects
for select
to public
using (bucket_id = 'plan-docs');

create policy plan_docs_it_manager_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'plan-docs'
  and public.is_day1_it_manager()
);

create policy plan_docs_it_manager_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'plan-docs'
  and public.is_day1_it_manager()
);

create policy plan_docs_it_manager_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'plan-docs'
  and public.is_day1_it_manager()
)
with check (
  bucket_id = 'plan-docs'
  and public.is_day1_it_manager()
);

create policy plan_docs_it_manager_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'plan-docs'
  and public.is_day1_it_manager()
);
