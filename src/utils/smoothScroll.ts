// Global smooth scroll utility with accessibility consideration
export const smoothScrollTo = (elementId: string, options?: {
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
  offset?: number;
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const element = document.getElementById(elementId);
  
  if (element) {
    if (prefersReducedMotion) {
      // Instant scroll for users who prefer reduced motion
      element.scrollIntoView({ 
        block: options?.block || 'start',
        inline: options?.inline || 'nearest'
      });
    } else {
      // Smooth scroll for users who don't mind motion
      element.scrollIntoView({
        behavior: 'smooth',
        block: options?.block || 'start',
        inline: options?.inline || 'nearest'
      });
    }
  }
};

// Smooth scroll to top utility
export const smoothScrollToTop = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    window.scrollTo(0, 0);
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// Smooth scroll by offset utility
export const smoothScrollBy = (offset: number) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    window.scrollBy(0, offset);
  } else {
    window.scrollBy({
      top: offset,
      behavior: 'smooth'
    });
  }
};
