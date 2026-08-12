-- Removes Senior Day-To-Day CMS rows that no longer appear on the plan detail page.
-- Run this in Supabase SQL editor while signed in as an IT manager/admin.

delete from public.cms_plan_benefits
where page_id in (
  select id
  from public.cms_plan_pages
  where plan_family = 'senior'
    and senior_category = 'day-to-day'
)
and lower(trim(benefit_title)) in (
  'basic dentistry',
  'optometry (iso leso optics)',
  'chronic medication'
);

delete from public.cms_plan_cover_highlights
where page_id in (
  select id
  from public.cms_plan_pages
  where plan_family = 'senior'
    and senior_category = 'day-to-day'
)
and lower(trim(highlight_text)) in (
  'acute/chronic medication',
  'dentistry / optometry',
  'funeral cover'
);

with ordered_benefits as (
  select
    id,
    row_number() over (
      partition by page_id
      order by sort_order asc, benefit_title asc, id asc
    ) as next_sort_order
  from public.cms_plan_benefits
  where page_id in (
    select id
    from public.cms_plan_pages
    where plan_family = 'senior'
      and senior_category = 'day-to-day'
  )
)
update public.cms_plan_benefits as benefits
set sort_order = ordered_benefits.next_sort_order
from ordered_benefits
where benefits.id = ordered_benefits.id;

with ordered_highlights as (
  select
    id,
    row_number() over (
      partition by page_id
      order by sort_order asc, highlight_text asc, id asc
    ) as next_sort_order
  from public.cms_plan_cover_highlights
  where page_id in (
    select id
    from public.cms_plan_pages
    where plan_family = 'senior'
      and senior_category = 'day-to-day'
  )
)
update public.cms_plan_cover_highlights as highlights
set sort_order = ordered_highlights.next_sort_order
from ordered_highlights
where highlights.id = ordered_highlights.id;
