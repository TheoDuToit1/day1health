# Comprehensive Plan Detail Content

Source: `src/components/ComprehensivePlanDetailPage.tsx`

## Page Structure

The comprehensive detail page is not a shared content block like day-to-day. It is a single component with three distinct tier content sets:

- `value`
- `platinum`
- `executive`

The displayed page title is built from:

- `Comprehensive - Value Plus - Single`
- `Comprehensive - Value Plus - Couple`
- `Comprehensive - Value Plus - Family`
- `Comprehensive - Platinum - Single`
- `Comprehensive - Platinum - Couple`
- `Comprehensive - Platinum - Family`
- `Comprehensive - Executive - Single`
- `Comprehensive - Executive - Couple`
- `Comprehensive - Executive - Family`

Each tier has:

- its own cover highlights
- its own benefit cards
- its own pricing ladder
- its own brochure PDF

## Plan Variants

The route supports the same member variants as day-to-day:

- `single`
- `couple`
- `family`

For `family`, the page allows `1` or `2` adults and `1` to `4` children.

## Tier Summary

### Value Plus

- Lowest comprehensive tier
- Shares the base day-to-day medical benefits plus hospital cover
- Does not include the extra Platinum or Executive upgrades

### Platinum

- Adds stronger catastrophic and disability-style benefits over Value Plus
- Keeps the same core outpatient and hospital structure

### Executive

- Highest comprehensive tier
- Adds illness top-up and higher hospital/accident-style limits
- Uses the most expensive pricing ladder

## Cover Highlights

### Value Plus

- Private Managed Doctor Visits
- Acute/Chronic Medication
- Dentistry / Optometry
- Private Hospital Benefits
- Illness
- Accident
- Ambulance

### Platinum

- Private Managed Doctor Visits
- Acute/Chronic Medication
- Dentistry / Optometry
- Private Hospital Benefits
- Illness
- Accident
- Critical Illness
- Ambulance

### Executive

- Private Managed Doctor Visits
- Acute/Chronic Medication
- Dentistry / Optometry
- Private Hospital Benefits
- Illness
- Illness Top-Up
- Accident
- Critical Illness
- Ambulance

## Pricing

The page uses tier-specific pricing ladders.

### Value Plus

| Variant | 0 Children | 1 Child | 2 Children | 3 Children | 4 Children |
| --- | ---: | ---: | ---: | ---: | ---: |
| Single | R750 | R1,050 | R1,350 | R1,650 | R1,950 |
| Couple | R1,275 | R1,575 | R1,875 | R2,175 | R2,475 |
| Family (1 adult) | R750 | R1,050 | R1,350 | R1,650 | R1,950 |
| Family (2 adults) | R1,275 | R1,575 | R1,875 | R2,175 | R2,475 |

### Platinum

| Variant | 0 Children | 1 Child | 2 Children | 3 Children | 4 Children |
| --- | ---: | ---: | ---: | ---: | ---: |
| Single | R980 | R1,372 | R1,764 | R2,156 | R2,548 |
| Couple | R1,764 | R2,156 | R2,548 | R2,940 | R3,332 |
| Family (1 adult) | R980 | R1,372 | R1,764 | R2,156 | R2,548 |
| Family (2 adults) | R1,764 | R2,156 | R2,548 | R2,940 | R3,332 |

### Executive

| Variant | 0 Children | 1 Child | 2 Children | 3 Children | 4 Children |
| --- | ---: | ---: | ---: | ---: | ---: |
| Single | R1,050 | R1,470 | R1,890 | R2,310 | R2,730 |
| Couple | R1,890 | R2,310 | R2,730 | R3,160 | R3,570 |
| Family (1 adult) | R1,050 | R1,470 | R1,890 | R2,310 | R2,730 |
| Family (2 adults) | R1,890 | R2,310 | R2,730 | R3,160 | R3,570 |

Pricing notes:

- The page renders the selected price through `RollingNumber`
- The displayed range text is tier-specific
- The page also keeps fallback per-adult and per-child constants in code, but the visible pricing for these tiers is driven by the explicit ladders above

## Benefit Cards

### Value Plus

| Benefit | Summary |
| --- | --- |
| Private Managed Doctor Visits | Consultations through a registered Day1 Health Network Partner. Limited to 5 doctor visits per member per annum. A Pay-as-you-Go Virtual Doctor consultation platform is available thereafter. Pre-authorisation is required. A 1 month waiting period applies. |
| Pathology | Basic diagnostic blood tests on referral by a 1Doctor Health Network GP and subject to a list of basic pathology tests approved by Day1 Health. A 1 month waiting period applies. |
| Specialist Benefit | Up to R1,000 per family per annum. Subject to pre-authorisation and referral from a 1Doctor Health Network GP. A 3 month waiting period applies. |
| Basic Dentistry | Preventative cleaning, fillings, extractions, and emergency pain and sepsis control via a Day1 Health Network Dentist. 2 visits per member per annum. Pre-authorisation is required for each visit. A 3 month waiting period applies. |
| Acute & Chronic Medication | Acute and chronic medication are covered according to the Day1 Health formulary. Acute medication has a 1 month waiting period. Chronic medication is limited to R500 per member per month and up to R6000 per member per annum, with a 3 month waiting period for unknown conditions and 12 months for pre-existing conditions. Pre-authorisation applies. |
| Optometry (Iso Leso Optics) | One eye test and one set of glasses every 24 months per the agreed protocol range. A 12 month waiting period applies. |
| Radiology | Basic radiology according to the 1Doctor Health formulary via a 1Doctor Health network GP. Black and white diagnostic x-rays only. A 1 month waiting period applies. |
| Out-of-Area Visits | 3 out-of-area visits per family per annum to an alternative Network GP or GP of choice, subject to pre-authorisation. A 1 month waiting period applies. |
| In-hospital Illness Benefit | Up to R10,000 after the first 24 hours in hospital, up to R10,000 for the second day, up to R10,000 for the third day, then R1,500 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing exclusion applies. |
| Accident/Trauma Benefit | Up to R150,000 per single member per incident and up to R300,000 per family incident. Immediate cover. Sports injuries excluded. |
| 24 Hour Emergency Services | Ambulance and pre-authorisation provided by Africa Assist. Immediate cover with preference to major private hospitals. |
| Maternity Benefit | Up to R20,000 for birth in hospital. 12 month waiting period applies. Available to plan members 16 years and older. |
| Funeral Benefit | Principal member R20,000. Spouse and child > 14 years R10,000. Child > 6 years R5,000. Child > 0 years R2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies. |
| 1st Day in Hospital | Not less than 24 hours from admission to discharge. Up to R10,000. |
| 2nd Day in Hospital | Payable in units of R2,500 for every quarter day. Up to R10,000. |
| 3rd Day in Hospital | Payable in units of R2,500 for every quarter day. Up to R10,000. |
| Every subsequent day thereafter | R1,500. |
| Maximum Benefit payable for 21 day period | Up to R57,000. |

### Platinum

Platinum reuses most Value Plus benefits and adds upgrades.

| Benefit | Summary |
| --- | --- |
| Private Managed Doctor Visits | Same structure as Value Plus. |
| Pathology | Same structure as Value Plus. |
| Specialist Benefit | Same structure as Value Plus. |
| Basic Dentistry | Same structure as Value Plus. |
| Acute & Chronic Medication | Same structure as Value Plus. |
| Optometry (Iso Leso Optics) | Same structure as Value Plus. |
| Radiology | Same structure as Value Plus. |
| Out-of-Area Visits | Same structure as Value Plus. |
| In-hospital Illness Benefit | Same benefit ladder as Value Plus. |
| Accident/Trauma Benefit | Up to R150,000 per single member per incident and up to R300,000 per family incident. Immediate cover. |
| 24 Hour Emergency Services | Same structure as Value Plus. |
| Maternity Benefit | Same structure as Value Plus. |
| Funeral Benefit | Same structure as Value Plus. |
| Critical Illness Benefit | 1 incident per family per annum. Critical illness up to R250,000, but limited to R50,000 unless the insured person completes a short medical examination at their own cost. A 3 month waiting period applies. |
| Accidental Permanent Disability Benefit | R250,000 for the principal member only. Single event only. Immediate cover. |

### Executive

Executive uses the strongest benefit set and changes several limits.

| Benefit | Summary |
| --- | --- |
| Private Managed Doctor Visits | Same structure as the other tiers. |
| Pathology | Same structure as the other tiers. |
| Specialist Benefit | Same structure as the other tiers. |
| Basic Dentistry | Same structure as the other tiers. |
| Acute & Chronic Medication | Same structure as the other tiers. |
| Optometry (Iso Leso Optics) | Same structure as the other tiers. |
| Radiology | Same structure as the other tiers. |
| Out-of-Area Visits | Same structure as the other tiers. |
| In-hospital Illness Benefit | Same first three hospital days, but thereafter R2,000 per day up to a maximum of 21 days. |
| Illness Top-Up | Up to R25,000 per insured person per year subject to an overall limit of 2 events per family policy per annum. A 3 month waiting period applies. |
| Accident/Trauma Benefit | Up to R250,000 per single member per incident and up to R500,000 per family incident. Immediate cover. |
| Critical Illness Benefit | Same core critical illness structure as Platinum. |
| Accidental Permanent Disability Benefit | R250,000 for the principal member only. Single event only. Immediate cover. |
| 24 Hour Emergency Services | Same structure as the other tiers. |
| Maternity Benefit | Same structure as the other tiers. |
| Funeral Benefit | Principal member and spouse R30,000. Child > 14 years R10,000. Child > 6 years R5,000. Child > 0 years R2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies. |
| Maximum Benefit payable for 21 day period | Up to R66,000. |

## Additional Information Options

The sidebar dropdown exposes the same option list as day-to-day:

- Single
- Single + 1 Child
- Single + 2 Children
- Single + 3 Children
- Single + 4 Children
- Couple
- Couple + 1 Child
- Couple + 2 Children
- Couple + 3 Children
- Couple + 4 Children

## PDF Mapping

- Value Plus: `Comprehensive Value Plus Plan.pdf`
- Platinum: `Comprehensive Platinum Plan.pdf`
- Executive: `Comprehensive Executive Plan.pdf`

## CMS Sheet Mapping

Suggested columns for the next Google Sheet import:

- `plan_category`
- `tier`
- `plan_name`
- `variant`
- `adults`
- `children`
- `price`
- `cover_highlights`
- `benefit_title`
- `benefit_summary`
- `pdf_name`
- `page_heading`

Recommended row strategy:

- one row per price ladder option
- one row per benefit card
- one row per cover highlight if you want those stored separately

## Notes for CMS Design

- This page should not be modeled as one generic comprehensive plan row set because the tiers have different benefit inventories and different price ladders.
- Platinum and Executive should be distinct content records, not just a label change.
- The Executive tier includes a duplicate `Accidental Permanent Disability Benefit` entry in code; that should be deduplicated in the CMS source of truth.

