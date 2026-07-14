-- Phase 3: public website read access for CMS-managed plan content
-- Public visitors need read access to CMS content because plan detail pages are not authenticated.

drop policy if exists cms_plan_pages_public_select on public.cms_plan_pages;
drop policy if exists cms_plan_benefits_public_select on public.cms_plan_benefits;
drop policy if exists cms_plan_cover_highlights_public_select on public.cms_plan_cover_highlights;
drop policy if exists cms_plan_price_rows_public_select on public.cms_plan_price_rows;
drop policy if exists cms_plan_assets_public_select on public.cms_plan_assets;

create policy cms_plan_pages_public_select
on public.cms_plan_pages
for select
to public
using (true);

create policy cms_plan_benefits_public_select
on public.cms_plan_benefits
for select
to public
using (true);

create policy cms_plan_cover_highlights_public_select
on public.cms_plan_cover_highlights
for select
to public
using (true);

create policy cms_plan_price_rows_public_select
on public.cms_plan_price_rows
for select
to public
using (true);

create policy cms_plan_assets_public_select
on public.cms_plan_assets
for select
to public
using (true);
