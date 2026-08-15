# Day-to-Day Plan Detail Content

Source: `src/components/PlanDetailPage.tsx`

## Page Heading

- `Day-to-Day - Single`
- `Day-to-Day - Couple`
- `Day-to-Day - Family`

The page title is built from the selected variant in the route query string.

## Plan Variants

The page supports these variants:

- `single`
- `couple`
- `family`

For `family`, the page allows `1` or `2` adults and `1` to `4` children.

## Cover Highlights

- Private Managed Doctor Visits
- Funeral Benefit

## Pricing

The pricing is currently rendered as a ladder on the page.

| Variant | 0 Children | 1 Child | 2 Children | 3 Children | 4 Children |
| --- | ---: | ---: | ---: | ---: | ---: |
| Single | R440 | R660 | R880 | R1,100 | R1,320 |
| Couple | R770 | R990 | R1,210 | R1,430 | R1,650 |
| Family (1 adult) | R440 | R660 | R880 | R1,100 | R1,320 |
| Family (2 adults) | R770 | R990 | R1,210 | R1,430 | R1,650 |

Pricing rules used by the page:

- Per adult: `R440`
- Per child: `R220`
- Couple pricing uses the couple ladder above
- Family pricing follows the selected adult count and child count

## Benefit Cards

The description tab renders the following benefit cards:

| Benefit | Summary |
| --- | --- |
| Private Managed Doctor Visits | Consultations through a registered Day1 Health Network Partner. Limited to 5 doctor visits per member per annum. Pre-authorisation is required. A 1 month waiting period applies. |
| Pathology | Basic diagnostic blood tests on referral by a 1Doctor Health Network GP and subject to a list of basic pathology tests approved by Day1 Health. A 1 month waiting period applies. |
| Specialist Benefit | Specialist Benefit of up to R 1000 per family per annum. Subject to pre-authorisation and referral from a 1Doctor Health Network GP. A 3 month waiting period applies. |
| Acute Medication | Acute medication covered according to the 1Doctor Health formulary. Linked to the 1Doctor consultation dispensed by the 1Doctor Health Network GP or obtained on script from a Network Pharmacy. A 1 month waiting period applies. |
| Out-of-Area Visits | If the member cannot see their Network GP, the plan allows 3 out-of-area visits per family per annum to an alternative Network GP or GP of choice, subject to pre-authorisation. A 1 month waiting period applies. |
| Radiology | Basic radiology according to the 1Doctor Health formulary via a 1Doctor Health network GP. Black and white diagnostic x-rays only. A 1 month waiting period applies. |
| Funeral Benefit | Principal, Spouse and Child > 14 years R10,000. Child > 6 years R5,000. Child > 0 years R2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies. |

## Additional Information Options

The sidebar dropdown exposes these options:

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

## CMS Sheet Mapping

Suggested columns for the next Google Sheet import:

- `plan_category`
- `plan_name`
- `variant`
- `adults`
- `children`
- `price`
- `benefit_title`
- `benefit_summary`
- `cover_highlights`
- `pdf_name`
- `page_heading`

Suggested rows:

- One row per price option
- One row per benefit card
- One row per cover highlight if you want those tracked separately

