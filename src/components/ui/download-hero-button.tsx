import React from 'react';
import { HeroCTAButton } from './hero-cta-button';

interface DownloadHeroButtonProps {
  href: string;
  filename?: string;
  className?: string;
  defaultText?: string;
  sentText?: string;
}

// Reuses the Hero CTA styling and toggles to "Downloaded" after click
export const DownloadHeroButton: React.FC<DownloadHeroButtonProps> = ({
  href,
  filename,
  className = '',
  defaultText = 'Download Plan Details',
  sentText = 'Downloaded',
}) => {
  const handleDownload = () => {
    try {
      const a = document.createElement('a');
      a.href = href;
      if (filename) a.download = filename; else a.setAttribute('download', '');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Button remains focused after click, which triggers the "sent" state CSS
    } catch (e) {
      console.error('Failed to trigger download', e);
    }
  };

  return (
    <HeroCTAButton
      onClick={handleDownload}
      className={className}
      defaultText={defaultText}
      sentText={sentText}
    />
  );
};

export default DownloadHeroButton;
