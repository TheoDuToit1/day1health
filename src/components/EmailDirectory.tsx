import React, { useState } from 'react';
import { ChevronDown, Copy, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface EmailDirectoryProps {
  className?: string;
}

const demoEmails = [
  { label: 'General Inquiries', email: 'info@day1health.co.za' },
  { label: 'Sales Team', email: 'sales@day1health.co.za' },
  { label: 'Admin Support', email: 'admin@day1health.co.za' },
  { label: 'Claims Department', email: 'claims@day1health.co.za' },
  { label: 'Technical Support', email: 'support@day1health.co.za' },
  { label: 'Business Partnerships', email: 'business@day1health.co.za' },
];

export default function EmailDirectory({ className }: EmailDirectoryProps) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
          isDark
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-white'
            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-green-600" />
          <div className="text-left">
            <div className="font-semibold text-sm">Day1Health Email Directory</div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Click to view contact emails
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-10 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="py-2">
            {demoEmails.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  index !== demoEmails.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.email}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(item.email)}
                  className={`ml-3 p-1.5 rounded-lg transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700'
                      : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'
                  }`}
                  title="Copy email address"
                  aria-label={`Copy ${item.email}`}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
