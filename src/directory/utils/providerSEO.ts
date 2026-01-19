import { Provider } from '../../admin/types';
import { SEOMetaTags } from '../../utils/seoHelpers';

/**
 * Generate SEO meta tags for a provider profile page
 */
export function generateProviderProfileSEO(
  provider: Provider,
  baseUrl: string,
  slug: string
): SEOMetaTags {
  const providerName = provider['DOCTOR SURNAME'] || 'Healthcare Provider';
  const suburb = provider.SUBURB || '';
  const province = provider.PROVINCE || '';
  const profession = provider.profession || 'Healthcare Professional';
  const professionLower = profession.toLowerCase();
  
  const locationStr = suburb && province ? `${suburb}, ${province}` : province || suburb || 'South Africa';
  const professionKeyword = professionLower === 'gp' ? 'General Practitioner' : profession;
  
  const providerUrl = `${baseUrl}/directory/${slug}`;
  
  // Generate relevant keywords
  const keywords = [
    `${professionKeyword} ${suburb}`,
    `${professionKeyword} ${province}`,
    `${professionKeyword} near me`,
    professionLower === 'gp' ? 'GP near me' : 'Dentist near me',
    `medical insurance ${suburb}`,
    `healthcare provider ${locationStr}`,
    'medical insurance',
    'health insurance',
    'healthcare',
    'medical aid',
    providerName,
  ];

  const title = `${providerName} - ${professionKeyword} in ${locationStr} | Day1Health`;
  const description = `Find ${providerName}, a ${professionKeyword} in ${locationStr}. Part of Day1Health's network of trusted medical professionals. Contact: ${provider.TEL || 'Available on request'}.`;
  
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
    priceRange: '$',
    image: provider.profile_picture || `${baseUrl}/assets/images/Logo.jpg`,
  };

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: provider.profile_picture || `${baseUrl}/assets/images/Logo.jpg`,
    ogUrl: providerUrl,
    canonicalUrl: providerUrl,
    structuredData,
  };
}
