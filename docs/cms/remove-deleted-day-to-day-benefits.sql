-- Removes Day-To-Day benefit rows that no longer appear on the plan detail page.
-- Run this in Supabase SQL editor while signed in as an IT manager/admin.

delete from public.cms_plan_benefits
where page_id in (
  select id
  from public.cms_plan_pages
  where plan_family = 'day-to-day'
)
and lower(trim(benefit_title)) in (
  'basic dentistry',
  'optometry (iso leso optics)',
  'chronic medication'
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
    where plan_family = 'day-to-day'
  )
)
update public.cms_plan_benefits as benefits
set sort_order = ordered_benefits.next_sort_order
from ordered_benefits
where benefits.id = ordered_benefits.id;
