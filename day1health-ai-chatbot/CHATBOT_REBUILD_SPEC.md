# Day1 Health Chatbot Rebuild Specification

This document contains the full logic, knowledge base, and system instructions required to rebuild the Day1 Health AI Assistant.

## 1. AI Model Configuration
- **Model**: `gemini-3-flash-preview` (or latest Gemini 3 series)
- **Response Format**: JSON
- **Response Schema**:
```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "description": "The text response to the user"
    },
    "customHtml": {
      "type": "string",
      "description": "Optional HTML/Tailwind string for visual data (tables, cards)"
    },
    "navigation": {
      "type": "string",
      "description": "Optional page ID to redirect the user (home, day-to-day, hospital, comprehensive, claims, network, about, contact)"
    },
    "suggestedActions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of suggested follow-up actions"
    }
  },
  "required": ["message"]
}
```

## 2. System Instructions
The following prompt should be used as the `systemInstruction` for the model:

```text
You are "Day1 Health Assistant", a world-class insurance assistant for Day1 Health (Pty) Ltd.

KNOWLEDGE BASE:
[Insert Content from Section 3 below]

FULL NETWORK PROVIDER DIRECTORY:
[Insert Content from Section 4 below]

CAPABILITIES:
1. You have deep knowledge of all plans (Day-to-Day, Hospital, Comprehensive).
2. You can "navigate" the user to different pages. If the user wants to see a specific page, include a "navigation" field in your JSON response.
   Available pages: "home", "day-to-day", "hospital", "comprehensive", "claims", "network", "about", "contact".
3. You can return "customHtml" which is a string of Tailwind CSS classes and HTML elements to render beautiful cards, tables, or comparisons. 
   ONLY use Tailwind classes. Do NOT use <script> or <style> tags.
4. You can suggest "suggestedActions" as an array of strings.
5. PLAN COMPARISON: When a user asks to compare plans, ask clarifying questions first (e.g., "Are you looking for cover for yourself or your family?", "Do you need hospital cover or just day-to-day?"). Once you have enough info, generate a beautiful comparison table using "customHtml".
6. PROVIDER SEARCH: If a user asks for a doctor or dentist in a specific area, search the "FULL NETWORK PROVIDER DIRECTORY". 
   - ALWAYS provide a detailed response.
   - If multiple providers are found, generate a beautiful, high-density Tailwind table in "customHtml".
   - Table columns should include: Name (Surname), Profession, Suburb, Address, and Telephone.
   - Use a clean, professional design with alternating row colors (zebra stripes) and bold headers.
   - If no providers are found for a specific suburb, search the broader region.
   - If still not found, suggest they check the "Network Search" page or contact the 24/7 emergency line.

GUIDELINES:
- Be professional, empathetic, and extremely accurate.
- If a user asks for "day to day plans", navigate them to "day-to-day".
- If a user asks for "hospital plans", navigate them to "hospital".
- If a user asks for "claims" or "forms", navigate them to "claims" and explain that we only do offline claims via PDF downloads.
- For plan comparisons, use a clean, modern Tailwind table in "customHtml". Include columns like "Benefit", "Single Plan", "Couple Plan", "Family Plan".
- Always use the knowledge base to answer.
- Emphasize that we are an informational site and do not have a member login/portal.
- Mention waiting periods when discussing benefits.
- ONLY RETURN THE JSON OBJECT.
```

## 3. Insurance Knowledge Base
```markdown
# DAY1 HEALTH COMPREHENSIVE KNOWLEDGE BASE
## 1. COMPANY OVERVIEW
- **Name**: Day1 Health (Pty) Ltd.
- **Legal Status**: Authorised Financial Services Provider (FSP 11319).
- **Underwriter**: African Unity Life Ltd (FSP 8447).
- **Accreditation**: Council for Medical Schemes (CMS Ref: 1074).
- **Product Type**: Medical Insurance (NOT a Medical Aid).
- **Core Value**: Practical, affordable healthcare since 2003.

## 2. DAY-TO-DAY PLANS (PRIMARY CARE)
Practical healthcare for everyday needs.
- **Single Plan**: R385 per month.
- **Couple Plan**: R674 per month.
- **Family Plan**: R867 per month (Covers principal, spouse, and up to 4 children).

### 2.1 DETAILED BENEFITS & LIMITS
- **GP Consultations**: 5 visits per member per year. Must use Day1 Health Network Partners. Pre-authorisation required.
- **Acute Medication**: Covered via 1Doctor Health formulary. Dispensed by Network GP or Network Pharmacy.
- **Chronic Medication**: Covered via 1Doctor Health formulary. Subject to pre-authorisation.
- **Basic Dentistry**: 2 visits per member per year. Includes cleaning, fillings, extractions, and emergency pain/sepsis control.
- **Optometry (Iso Leso Optics)**: 1 eye test and 1 set of glasses every 24 months.
- **Pathology**: Basic diagnostic blood tests on referral by Network GP.
- **Radiology**: Black & white diagnostic x-rays via Network GP.
- **Specialist Benefit**: Up to R1,000 per family per year. Requires referral from Network GP and pre-authorisation.
- **Out-of-Area Visits**: 3 visits per family per year allowed to non-network GPs if a network partner is unavailable (requires pre-auth).
- **Funeral Benefit**: 
  - Principal/Spouse/Child > 14: R10,000
  - Child > 6: R5,000
  - Child > 0: R2,500
  - Stillborn > 28 weeks: R1,250

### 2.2 WAITING PERIODS
- **1 Month**: GP Visits, Acute Medication, Pathology, Radiology, Out-of-Area Visits.
- **3 Months**: Specialist Benefit, Basic Dentistry, Chronic Medication (unknown conditions), Funeral Benefit.
- **12 Months**: Optometry, Chronic Medication (pre-existing conditions).
- **Day 1 (Immediate)**: Accident and emergency ambulance services.

## 3. HOSPITAL & EMERGENCY COVER
- **Emergency Hotline**: 0861-144-144 (24/7).
- **Service Provider**: Africa Assist.
- **Coverage**: Includes emergency hospitalisation and accident cover.

## 4. NETWORK PARTNERS
- **GP & Dental**: 1Doctor Health Network.
- **Hospitals**: Life Healthcare, Mediclinic, Africa Health Care, Clinix Health Group.
- **Optics**: Iso Leso Optics.

## 5. CLAIMS & FORMS (OFFLINE PROCESS)
We do not process claims online. Members must download, print, and manually fill out forms.
- **Day-to-Day Application Form**: [Download PDF]
- **Hospital Claim Form**: [Download PDF]
- **Product Brochure**: [Download PDF]
- **GP Directory**: [Link to Directory]

## 6. CONTACT CHANNELS
- **Call Centre**: 0876 100 600 (Mon-Fri 8:00-16:30, Sat 8:00-13:00).
- **Emergency**: 0861-144-144 (24/7).
- **Email**: admin@day1.co.za / sales@day1.co.za.
- **WhatsApp**: +27 72 720 5511.

## 7. AI ASSISTANT GUIDELINES
- If a user asks for a claim form, tell them to go to the "Downloads" section or provide the direct link to the PDF.
- If a user asks to compare plans, use the data in section 2.1.
- Emphasize that we are an informational site and do not have a member login/portal.
- Always mention waiting periods when discussing benefits.

## 8. PROVIDER DIRECTORY
Day1 Health has a vast network of GPs and Dentists across South Africa. Refer to the "FULL NETWORK PROVIDER DIRECTORY" for specific details on names, addresses, and contact numbers.
```

## 4. Network Provider Directory (JSON)
```json
[
  { "region": "AKASIA", "suburb": "KARENPARK", "address": "SHOP NO 7 KARENPARK CROSSING", "surname": "DU PLESSIS", "prno": "573280", "tel": "0125493883 / 1083", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "AKASIA", "suburb": "KARENPARK", "address": "SHOP 7 KARENPARK CROSSINGS CNR DOREG & HEINRICH STREET", "surname": "LINGHAM", "prno": "680508", "tel": "0125493883/1083", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "AKASIA", "suburb": "KARENPARK", "address": "SHOP 7 KARENPARK CROSSINGS CNR DOREG & HEINRICH STREET", "surname": "MARAIS", "prno": "680516", "tel": "0125493883/1083", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "AKASIA", "suburb": "ROSSLYN", "address": "SHOP NO 6 ROSSLYN CORNER SHOPPING RAUTENBACH STREET", "surname": "CHETTY", "prno": "5446317", "tel": "125410316", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "CITY CENTRE", "address": "SHOP 1 TRUST BANK CENTRE", "surname": "ABDOOL-MAJID E", "prno": "0104841", "tel": "0110470694", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "THOKOZA", "address": "8013 KHUMALO", "surname": "KANA KMM", "prno": "1464736", "tel": "0119053717", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "EDEN PARK", "address": "55 ABRAHAM STREET", "surname": "MAGAN PC", "prno": "1473980", "tel": "0113850441", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "RANDHART", "address": "36 FUHRI ROAD", "surname": "NGANDEMANDE & PARTNERS", "prno": "0580651", "tel": "0562143213", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "EDEN PARK", "address": "SHOP 4 EDENPARK SHOPPING CENTRE CNR CHRYSLER & ABRAHAM STREET", "surname": "RANCHOD N", "prno": "1434349", "tel": "0113850084", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "BRACKENDOWNS", "address": "11 DE WAAL STREET", "surname": "THOMAS PA", "prno": "1535889", "tel": "0118673533", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "MEYERSDAL", "address": "SHOP UL10 MEYERSDAL MALL CNR HENNIE ALBERTS & MICHELLE AVE", "surname": "VAN ZYL GJ", "prno": "1448706", "tel": "0118671678", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "BRACKENHURST", "address": "3 FISHER STREET", "surname": "KALALA MAKELELE", "prno": "1185721", "tel": "0128172020 OR 0785701557", "profession": "GP", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "BRACKENHURST", "address": "29 VERMOOTEN STREET", "surname": "LEWIS", "prno": "5422035", "tel": "118675970", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "RACEVIEW", "address": "7 PADSTOW ROAD", "surname": "HOLL", "prno": "303526", "tel": "0119078344/55", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "RACEVIEW", "address": "7 PADSTOW STREET", "surname": "OOKA", "prno": "612553", "tel": "119078344", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "RACEVIEW", "address": "7 PADSTOW STREET", "surname": "VOLSCHENK", "prno": "5431778", "tel": "0119078344/55", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "ALBERTON", "suburb": "RANDHART", "address": "34 GENERAL ALBERTS AVENUE", "surname": "BEZUIDENHOUDT", "prno": "55042", "tel": "119076277", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "ALICE", "suburb": "ALICE", "address": "02 OLD TEBA OFFICES GARDEN STREET", "surname": "ANJUM", "prno": "1536117", "tel": "0406531314", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "ALIWAL NORTH", "suburb": "ALIWAL NORTH", "address": "SHOP 5 BRIDGEGATE CENTRE ROBINSON STREET", "surname": "BOTTOMAN MJ", "prno": "0472980", "tel": "0516333777", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "ALIWAL NORTH", "suburb": "ALIWAL NORTH", "address": "9 ROBINSON ROAD", "surname": "JANSSEN T", "prno": "0617997", "tel": "0510040177", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "AMANZIMTOTI", "suburb": "AMANZIMTOTI", "address": "361 KINGSWAY ROAD", "surname": "DADA AT", "prno": "1439502", "tel": "0319037170", "profession": "GP", "province": "KWAZULU-NATAL" },
  { "region": "ATLANTIS", "suburb": "AVONDALE", "address": "5 MARK STREET DOLLIE CENTRE", "surname": "BLEKER HA", "prno": "1439766", "tel": "0215723623", "profession": "GP", "province": "WESTERN CAPE" },
  { "region": "ATLANTIS", "suburb": "ATLANTIS", "address": "ATLANTIS CITY CENTRE WESFLEUR CIRCLE", "surname": "ABRAHAMS", "prno": "5452414", "tel": "215726802", "profession": "Dentist", "province": "WESTERN CAPE" },
  { "region": "ATLANTIS", "suburb": "ATLANTIS", "address": "101 WESFLEUR TOWN CENTRE WESFLEUR CIRCLE", "surname": "VARIAWA", "prno": "5423562", "tel": "215726552", "profession": "Dentist", "province": "WESTERN CAPE" },
  { "region": "BALFOUR", "suburb": "BALFOUR", "address": "SHOP NO 6 1085 JAN VAN RIEBEECK STREET", "surname": "NGWASHENG", "prno": "92816", "tel": "716622012", "profession": "Dentist", "province": "MPUMALANGA" },
  { "region": "BALFOUR", "suburb": "BALFOUR", "address": "15 STATION STREET", "surname": "SULAMAN", "prno": "269379", "tel": "177731826", "profession": "Dentist", "province": "MPUMALANGA" },
  { "region": "BALFOUR", "suburb": "BALFOUR", "address": "138 DYER STREET", "surname": "NIEUWOUDT LF", "prno": "1449079", "tel": "0177732184", "profession": "GP", "province": "MPUMALANGA" },
  { "region": "BALLITO", "suburb": "BALLITO", "address": "16 WOODVIEW WARREN HEIGHTS", "surname": "GEYTENBEEK DA", "prno": "1474820", "tel": "0766052832", "profession": "GP", "province": "KWAZULU-NATAL" },
  { "region": "BARBERTON", "suburb": "BARBERTON", "address": "STAND 1962 SPEARVILLE SITE", "surname": "DLAMINI SMS", "prno": "1556452", "tel": "0137126844", "profession": "GP", "province": "MPUMALANGA" },
  { "region": "BARBERTON", "suburb": "BARBERTON", "address": "281 KWAM HOLA MAKHOBA SUPER VALUE", "surname": "MARAKALLA MP", "prno": "0185620", "tel": "0137126142", "profession": "GP", "province": "MPUMALANGA" },
  { "region": "BARBERTON", "suburb": "BARBERTON", "address": "3 GENERAL STREET", "surname": "MARX AE & MARX CS", "prno": "0076686", "tel": "0137123111", "profession": "GP", "province": "MPUMALANGA" },
  { "region": "BEAUFORT WEST", "suburb": "BEAUFORT WEST", "address": "134 DONKIN STREET", "surname": "SIEBERHAGEN & PARTNERS", "prno": "0079626", "tel": "0234152663", "profession": "GP", "province": "WESTERN CAPE" },
  { "region": "BEDFORDVIEW", "suburb": "BEDFORDVIEW", "address": "23 NICOL ROAD", "surname": "BHABHA", "prno": "0178683", "tel": "0110287000/6157214", "profession": "GP", "province": "GAUTENG" },
  { "region": "BELA BELA", "suburb": "BELA BELA", "address": "37 LUNA ROAD", "surname": "GROBLER GVH", "prno": "1417053", "tel": "0147362220", "profession": "GP", "province": "LIMPOPO" },
  { "region": "BELA BELA", "suburb": "BELA BELA", "address": "37 LUNA ROAD", "surname": "DE VILLIERS AB", "prno": "1545191", "tel": "0147362220", "profession": "GP", "province": "LIMPOPO" },
  { "region": "BELA BELA", "suburb": "WARMBATHS", "address": "271 SEKOMBANE STREET", "surname": "MAHLARE T R S", "prno": "1475010", "tel": "0147377054", "profession": "GP", "province": "LIMPOPO" },
  { "region": "BELA BELA", "suburb": "BELA BELA", "address": "25 CHRIS STREET", "surname": "DIALE AM", "prno": "0685569", "tel": "0838223391", "profession": "GP", "province": "LIMPOPO" },
  { "region": "BELA BELA", "suburb": "BELA BELA", "address": "37 LUNA ROAD", "surname": "MULLA Y H", "prno": "0989428", "tel": "0147362220", "profession": "GP", "province": "LIMPOPO" },
  { "region": "BELA BELA", "suburb": "BELA BELA", "address": "46 CHRIS HANI DRIVE", "surname": "MHLANGA MARTHA", "prno": "1186809", "tel": "0774014835", "profession": "GP", "province": "LIMPOPO" },
  { "region": "BELA BELA", "suburb": "BELA BELA", "address": "16 SUTTER ROAD", "surname": "LETEBELE", "prno": "252492", "tel": "147366396", "profession": "Dentist", "province": "LIMPOPO" },
  { "region": "BENONI", "suburb": "BENONI", "address": "37 VOORTREKKER STREET", "surname": "BAWA & PARTNERS", "prno": "1467026", "tel": "0114215044", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "LAKEFIELD", "address": "49 LAKEFIELD AVENUE", "surname": "BHAM F", "prno": "1528483", "tel": "0119457047", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "BENONI", "address": "20 RUSSEL STREET", "surname": "DRS GOVENDER & MARK INC", "prno": "0699152", "tel": "0114211371", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "NORTHMEAD", "address": "OAKFIELDS CENTRE CNR OAK & HANEKOM", "surname": "DUBERT C", "prno": "0464716", "tel": "0118499199", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "NORTHMEAD", "address": "5-9TH AVENUE", "surname": "ERASMUS P D C & PARTNER", "prno": "1455273", "tel": "0118496511", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "ACTONVILLE", "address": "1536 SINGH STREET", "surname": "ESSOP RR", "prno": "1449591", "tel": "0114217775", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "BENONI", "address": "CNR BUNYAN STREET AND CRANBOURNE AVENUE", "surname": "GOVENDER LA", "prno": "1545809", "tel": "0114211371", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "ACTIONVILLE", "address": "289 SINGH STREET EXT 3", "surname": "LINGOOMIAH I", "prno": "1552708", "tel": "0114214884", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "BENONI", "address": "54 HARPUR AVENUE", "surname": "PILLAY M", "prno": "0097934", "tel": "0118453564", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "CENTRAL", "address": "66 BEDFORD AVENUE", "surname": "SCHOEMAN S H & PARTNER", "prno": "0021431", "tel": "0118452809", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "RYNFIELD", "address": "140 PRETORIA ROAD", "surname": "SIPULA NN", "prno": "1484486", "tel": "0114250699", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "ACTONVILLE", "address": "508 DAJEE STREET EXT 3", "surname": "SURTEE RM", "prno": "1475177", "tel": "0114211267", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "MACKENZIE", "address": "22 HERON ROAD", "surname": "VAN DER LINDE", "prno": "1470728", "tel": "0114216334/5", "profession": "GP", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "BENONI", "address": "BENONI HEALTH CENTRE 54 HARPUR AVENUE", "surname": "AGBENIYI", "prno": "286583", "tel": "118453564", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "BENONI", "address": "64 CRANBOURNE AVENUE ABSA BANK BUILDING", "surname": "HERR", "prno": "5429412", "tel": "0118452063/98", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "BENONI", "address": "18 BIRMINGHAM ROAD", "surname": "MIA", "prno": "462594", "tel": "114200842", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "BENONI", "address": "64 CRANBOURNE AVENUE ABSA BANK BUILDING", "surname": "ROVITHIS", "prno": "5445124", "tel": "118452063", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "DEWALD HATTINGH PARK", "address": "91 REAN STREET", "surname": "ISAT", "prno": "5438934", "tel": "114219569", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "BENONI", "suburb": "NORTHMEAD", "address": "17 WEBB STREET NORTHMEAD", "surname": "FRIEDLANDER", "prno": "5421128", "tel": "118497733", "profession": "Dentist", "province": "GAUTENG" },
  { "region": "BETHAL", "suburb": "BETHAL", "address": "KB MEDICAL CENTRE 43 CHRIS HANI STREET", "surname": "ADIGUN KR", "prno": "0474746", "tel": "0176471128", "profession": "GP", "province": "MPUMALANGA" },
  { "region": "BETHAL", "suburb": "BETHAL", "address": "NO 44A DUPLOOY STREET", "surname": "LEGODI", "prno": "489700", "tel": "176471528", "profession": "Dentist", "province": "MPUMALANGA" },
  { "region": "BETHAL", "suburb": "BETHAL", "address": "51 CHRIS HANI STREET", "surname": "NKOSI", "prno": "5451639", "tel": "176472279", "profession": "Dentist", "province": "MPUMALANGA" },
  { "region": "BETHELSDORP", "suburb": "BLOEMENDAL", "address": "180 WILLIAM SLAMMERT DRIVE CHATTY", "surname": "BAWASA K", "prno": "1462598", "tel": "0414816701", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "BETHELSDORP", "suburb": "BLOEMENDAL", "address": "5 FEMBER STREET", "surname": "MADHOO B", "prno": "1557459", "tel": "0414812255", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "BETHELSDORP", "suburb": "BLOEMENDAL", "address": "5 FEMBER STREET", "surname": "MANGA SM", "prno": "1443925", "tel": "0414812255", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "BETHELSDORP", "suburb": "SANCTOR", "address": "SANCTOR MEDICAL CENTER 48 MAROCK ROAD", "surname": "JAGA P", "prno": "1557432", "tel": "0414812161", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "BETHLEHEM", "suburb": "BETHLEHEM", "address": "BRUWER STREET NO 3", "surname": "MARX", "prno": "5426227", "tel": "583035397", "profession": "GP", "province": "FREE STATE" },
  { "region": "BETHLEHEM", "suburb": "BETHLEHEM", "address": "7B PRESIDENT BOSHOFF STREET", "surname": "MBATHA", "prno": "318159", "tel": "583030325", "profession": "GP", "province": "FREE STATE" },
  { "region": "BETHLEHEM", "suburb": "BETHLEHEM", "address": "7 DE LEEUW STREET", "surname": "BRITS L", "prno": "1460625", "tel": "0583031161", "profession": "GP", "province": "FREE STATE" },
  { "region": "BETHLEHEM", "suburb": "BOHLOKONG", "address": "1124 DE VILLIERS STREET", "surname": "MOTLOUNG M A INC", "prno": "1419544", "tel": "0583042885", "profession": "GP", "province": "FREE STATE" },
  { "region": "BLOEMFONTEIN", "suburb": "BLOEMFONTEIN", "address": "CNR HANGER & BASTION STREET", "surname": "ROOD", "prno": "5414997", "tel": "514480973", "profession": "GP", "province": "FREE STATE" },
  { "region": "BLOEMFONTEIN", "suburb": "WESTDENE", "address": "150 NELSON MANDELA DRIVE", "surname": "JACOBS", "prno": "5440378", "tel": "0514301444/5", "profession": "GP", "province": "FREE STATE" },
  { "region": "BOKSBURG", "suburb": "JANSEN PARK", "address": "SHOP U002 EAST RAND MEDICAL CENTRE NORTH RAND ROAD", "surname": "SMIT LM", "prno": "0026530", "tel": "0118265801", "profession": "GP", "province": "GAUTENG" },
  { "region": "BRITS", "suburb": "BRITS", "address": "18 DE WET STREET", "surname": "RAMAGAGA T", "prno": "1489836", "tel": "0814413080", "profession": "GP", "province": "NORTH WEST" },
  { "region": "CAPE TOWN", "suburb": "CAPE TOWN", "address": "1 ADDERLEY STREET", "surname": "ANNIRUDHRA & PARTNERS", "prno": "0481297", "tel": "0214182009", "profession": "GP", "province": "WESTERN CAPE" },
  { "region": "CENTURION", "suburb": "CENTURION", "address": "2ND FLOOR SOUTHLAKE CENTRE CNR SOUTH & LEACHEN NORTH STREETS", "surname": "BEUKES & ASSOCIATES", "prno": "0785679", "tel": "0126637895", "profession": "GP", "province": "GAUTENG" },
  { "region": "DURBAN", "suburb": "DURBAN", "address": "373 PINE STREET", "surname": "ABDOOLA IA", "prno": "0582735", "tel": "0313019413", "profession": "GP", "province": "KWAZULU-NATAL" },
  { "region": "EAST LONDON", "suburb": "EAST LONDON", "address": "30 ALBANY STREET", "surname": "APPAVOO DN & JONES WP", "prno": "1443615", "tel": "0437222356", "profession": "GP", "province": "EASTERN CAPE" },
  { "region": "JOHANNESBURG", "suburb": "CBD", "address": "86 CNR PLAIN & LOVEDAY STREET", "surname": "AMOD AK", "prno": "1456032", "tel": "0118368435", "profession": "GP", "province": "GAUTENG" },
  { "region": "PRETORIA", "suburb": "CBD", "address": "336 STRUBEN STREET", "surname": "ABOOBAKER A", "prno": "1439545", "tel": "0123255570", "profession": "GP", "province": "GAUTENG" },
  { "region": "RUSTENBURG", "suburb": "RUSTENBURG", "address": "24 FATIMA BHAYAT DRIVE", "surname": "MAFAWALLA R A", "prno": "1433598", "tel": "0145923723", "profession": "GP", "province": "NORTH WEST" },
  { "region": "SOWETO", "suburb": "DOBSONVILLE", "address": "DOBSONVILLE SHOPPING CENTRE, SHOP 66A, ROODEPOORT ROAD", "surname": "FATEYE O", "prno": "0274496", "tel": "0119888380", "profession": "GP", "province": "GAUTENG" }
]
```

### 5. Backend Logic Implementation (TypeScript/Node.js)

The following function handles the interaction with the Gemini API. It includes retry logic for rate limits and enforces the JSON response schema.

```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatResponse {
  message: string;
  customHtml?: string;
  navigation?: string;
  suggestedActions?: string[];
}

export async function getChatResponse(history: { role: string; parts: { text: string }[] }[]): Promise<ChatResponse> {
  const model = "gemini-3-flash-preview"; 
  
  // systemInstruction from Section 2 goes here
  const systemInstruction = \`...\`;

  const maxRetries = 3;
  let retryCount = 0;

  const executeRequest = async (): Promise<ChatResponse> => {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: h.parts
        })),
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              customHtml: { type: Type.STRING },
              navigation: { type: Type.STRING },
              suggestedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["message"]
          }
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      
      return JSON.parse(text);
    } catch (error: any) {
      if (error.status === 429 || error.message?.includes("RESOURCE_EXHAUSTED")) {
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return executeRequest();
        }
      }
      throw error;
    }
  };

  return await executeRequest();
}
```
