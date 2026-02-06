import { Provider } from '../admin/types';

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  canonicalUrl: string;
  structuredData: Record<string, any>;
}

// Healthcare-focused keywords for medical directory
const HEALTHCARE_KEYWORDS = {
  general: ['medical insurance', 'health insurance', 'healthcare', 'medical aid', 'insurance plans', 'health coverage'],
  gp: ['general practitioner', 'GP', 'family doctor', 'primary care physician', 'doctor near me'],
  dentist: ['dentist', 'dental care', 'dental services', 'teeth cleaning', 'dental treatment'],
  location: ['South Africa', 'medical provider', 'healthcare provider', 'clinic', 'practice'],
};

export function generateProviderSEO(provider: Provider, baseUrl: string): SEOMetaTags {
  const providerName = provider['DOCTOR SURNAME'] || 'Healthcare Provider';
  const suburb = provider.SUBURB || '';
  const province = provider.PROVINCE || '';
  const profession = provider.profession || 'Healthcare Professional';
  const professionLower = profession.toLowerCase();
  
  const locationStr = suburb && province ? `${suburb}, ${province}` : province || suburb || 'South Africa';
  const professionKeyword = professionLower === 'gp' ? 'General Practitioner' : profession;
  
  const providerUrl = `${baseUrl}/provider/${provider.id}`;
  
  // Generate relevant keywords
  const professionSpecificKeywords = professionLower === 'gp' 
    ? HEALTHCARE_KEYWORDS.gp 
    : HEALTHCARE_KEYWORDS.dentist;
  
  const keywords = [
    `${professionKeyword} ${suburb}`,
    `${professionKeyword} ${province}`,
    `${professionKeyword} near me`,
    professionLower === 'gp' ? 'GP near me' : 'Dentist near me',
    `medical insurance ${suburb}`,
    `healthcare provider ${locationStr}`,
    ...HEALTHCARE_KEYWORDS.general,
    ...professionSpecificKeywords,
  ];

  const title = `${providerName} - ${professionKeyword} in ${locationStr} | Day1Health`;
  const description = `Find ${providerName}, a ${professionKeyword} in ${locationStr}. Part of Day1Health's network of trusted medical professionals. Book appointments and access healthcare services.`;
  
  // Structured data for healthcare provider
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: providerName,
    description: `${professionKeyword} providing healthcare services in ${locationStr}`,
    url: providerUrl,
    telephone: provider.TEL || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: provider.ADDRESS || '',
      addressLocality: suburb,
      addressRegion: province,
      addressCountry: 'ZA',
    },
    areaServed: {
      '@type': 'City',
      name: suburb,
    },
    medicalSpecialty: professionLower === 'gp' ? 'GeneralPractice' : 'Dentistry',
    priceRange: '$$',
    image: provider.profile_picture || `${baseUrl}/assets/images/default-provider.jpg`,
    sameAs: [
      `${baseUrl}/directory`,
    ],
  };

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: provider.profile_picture || `${baseUrl}/assets/images/og-default.jpg`,
    ogUrl: providerUrl,
    canonicalUrl: providerUrl,
    structuredData,
  };
}

export function generateDirectorySEO(baseUrl: string, totalProviders: number): SEOMetaTags {
  const title = 'Medical Directory - Find GPs & Dentists | Day1Health';
  const description = `Browse our network of ${totalProviders}+ trusted GPs and dentists across South Africa. Find healthcare providers near you with Day1Health medical insurance.`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Day1Health Medical Directory',
    description,
    url: `${baseUrl}/directory`,
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
    image: `${baseUrl}/assets/images/Logo.jpg`,
  };

  return {
    title,
    description,
    keywords: [
      'medical directory',
      'find doctors',
      'find dentists',
      'healthcare providers South Africa',
      'GP directory',
      'dentist directory',
      'medical insurance network',
      'healthcare professionals',
      ...HEALTHCARE_KEYWORDS.general,
    ],
    ogTitle: title,
    ogDescription: description,
    ogImage: `${baseUrl}/assets/images/Logo.jpg`,
    ogUrl: `${baseUrl}/directory`,
    canonicalUrl: `${baseUrl}/directory`,
    structuredData,
  };
}

export function setMetaTags(seo: SEOMetaTags): void {
  // Set title
  document.title = seo.title;
  
  // Helper to set or update meta tag
  const setMeta = (name: string, content: string, property = false) => {
    const attr = property ? 'property' : 'name';
    let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.content = content;
  };

  // Set standard meta tags
  setMeta('description', seo.description);
  setMeta('keywords', seo.keywords.join(', '));
  setMeta('og:title', seo.ogTitle, true);
  setMeta('og:description', seo.ogDescription, true);
  setMeta('og:image', seo.ogImage, true);
  setMeta('og:url', seo.ogUrl, true);
  setMeta('twitter:title', seo.ogTitle);
  setMeta('twitter:description', seo.ogDescription);
  setMeta('twitter:image', seo.ogImage);

  // Set canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = seo.canonicalUrl;

  // Set structured data
  let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
  if (!structuredDataScript) {
    structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    document.head.appendChild(structuredDataScript);
  }
  structuredDataScript.textContent = JSON.stringify(seo.structuredData);
}

export function generateSitemapEntry(
  loc: string,
  lastmod: string,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'monthly',
  priority: number = 0.5
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}
