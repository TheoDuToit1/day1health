import React, { useState } from 'react';
import { X, MapPin, Phone, FileText, Download, Copy, Check } from 'lucide-react';
import { Provider } from '../../admin/types';
import ProviderMap from './ProviderMap';

interface ProviderSidebarProps {
  provider: Provider;
  isDark: boolean;
  onClose: () => void;
}

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ provider, isDark, onClose }) => {
  const [copied, setCopied] = useState(false);

  const getInitials = (name: string | undefined) => {
    if (!name) return 'N/A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCopyInfo = () => {
    const info = `
Name: ${provider['DOCTOR SURNAME'] || 'N/A'}
Provider Number: ${provider.PRNO || 'N/A'}
Phone: ${provider.TEL || 'N/A'}
Fax: ${provider.FAX || 'N/A'}
Address: ${provider.ADDRESS || ''} ${provider.SUBURB || ''}, ${provider.PROVINCE || ''}
Region: ${provider.REGION || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;
      
      // Header background
      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PROVIDER DETAILS', 20, 25);
      
      // Reset text color
      doc.setTextColor(17, 24, 39);
      yPosition = 65;
      
      // Provider Name Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(String(provider['DOCTOR SURNAME'] || ''), 20, yPosition);
      yPosition += 8;
      
      // Provider Number
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(34, 197, 94);
      doc.text(String(`Provider #${provider.PRNO || ''}`), 20, yPosition);
      yPosition += 12;
      
      // Section: Contact Information
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTACT INFORMATION', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (provider.TEL) {
        doc.text(String(`Phone: ${provider.TEL}`), 20, yPosition);
        yPosition += 6;
      }
      if (provider.FAX) {
        doc.text(String(`Fax: ${provider.FAX}`), 20, yPosition);
        yPosition += 6;
      }
      yPosition += 6;
      
      // Section: Address
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ADDRESS', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const addressLines = [
        provider.ADDRESS || '',
        provider.SUBURB || '',
        `${provider.REGION || ''}, ${provider.PROVINCE || ''}`,
      ].filter((line): line is string => Boolean(line));
      
      addressLines.forEach((line) => {
        doc.text(String(line || ''), 20, yPosition);
        yPosition += 6;
      });
      
      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} • Day1 Health Provider Directory`,
        20,
        pageHeight - 10
      );
      
      // Download
      doc.save(`${(provider['DOCTOR SURNAME'] || 'Provider').replace(/\s+/g, '_')}_details.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 shadow-2xl overflow-y-auto z-50 transition-all ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className={`sticky top-0 border-b p-4 sm:p-6 ${isDark ? 'border-gray-700 bg-gray-800/95' : 'border-gray-200 bg-white/95'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Provider Details</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-green-500/30"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleCopyInfo}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and Name */}
          <div className="text-center">
            {provider.profile_picture ? (
              <img
                src={provider.profile_picture}
                alt={provider['DOCTOR SURNAME']}
                className="w-24 h-24 rounded-xl object-cover mx-auto mb-4 border-4 border-green-500 shadow-lg"
                onError={(e) => {
                  console.error('Failed to load sidebar image:', provider.profile_picture);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            {!provider.profile_picture && (
              <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 mx-auto mb-4`}>
                {getInitials(provider['DOCTOR SURNAME'])}
              </div>
            )}
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {provider['DOCTOR SURNAME']}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {provider.PRNO}
              </p>
            </div>
          </div>

          {/* Partner ID Info */}
          {provider.PRNO && (
            <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Partner ID
              </p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {provider.PRNO}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Contact Information
            </p>

            {provider.TEL && (
              <a
                href={`tel:${provider.TEL}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {provider.TEL}
                  </p>
                </div>
              </a>
            )}

            {provider.FAX && (
              <a
                href={`tel:${provider.FAX}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Fax</p>
                  <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {provider.FAX}
                  </p>
                </div>
              </a>
            )}
          </div>

          {/* Address */}
          <div className="space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Address
            </p>
            <div className={`flex gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                {provider.ADDRESS && (
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {provider.ADDRESS}
                  </p>
                )}
                {provider.SUBURB && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {provider.SUBURB}
                  </p>
                )}
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {provider.REGION}, {provider.PROVINCE}
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <ProviderMap provider={provider} isDark={isDark} />



          {/* Dispensing Information */}
          {provider['DISPENSE/SCRIPT'] && (
            <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dispensing/Script</p>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {provider['DISPENSE/SCRIPT']}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default ProviderSidebar;
