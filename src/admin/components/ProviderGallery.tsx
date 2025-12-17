import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, MoreVertical, Search } from 'lucide-react';
import { Provider } from '../types';

interface ProviderGalleryProps {
  providers: Provider[];
  isDark: boolean;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
}

const ProviderGallery: React.FC<ProviderGalleryProps> = ({
  providers,
  isDark,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredProviders = useMemo(() => {
    let filtered = providers.filter((provider) => {
      const matchesSearch = 
        (provider['DOCTOR SURNAME']?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (provider.TEL?.includes(searchTerm)) ||
        (provider.SUBURB?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (provider.ADDRESS?.toLowerCase().includes(searchTerm.toLowerCase()));

      // All CSV providers are considered active
      const matchesStatus = filterStatus === 'all' || filterStatus === 'active';

      return matchesSearch && matchesStatus;
    });

    return filtered;
  }, [providers, searchTerm, filterStatus]);

  if (providers.length === 0) {
    return (
      <div className={`text-center py-12 rounded-lg border ${
        isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
      }`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          No providers found. Add one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-3 w-5 h-5 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search by name, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
            } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-green-600 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredProviders.length === 0 ? (
        <div className={`text-center py-12 rounded-lg border ${
          isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            No providers found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProviders.map((provider) => (
        <div
          key={provider.id}
          className={`rounded-lg border overflow-hidden transition-all hover:shadow-lg ${
            isDark
              ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          {/* Header with status badge */}
          <div className={`px-4 pt-4 pb-2 flex items-start justify-between border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ● Active
            </span>
          </div>

          {/* Profile Image */}
          <div className="px-4 py-6 flex justify-center">
            {provider.profile_picture ? (
              <img
                src={provider.profile_picture}
                alt={provider['DOCTOR SURNAME']}
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                onError={(e) => {
                  console.error('Image failed to load:', provider.profile_picture);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            {!provider.profile_picture && (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                {provider['DOCTOR SURNAME']?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {/* Provider Info */}
          <div className={`px-4 py-4 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold text-center mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {provider['DOCTOR SURNAME'] || '—'}
            </h3>
            <p className={`text-sm text-center mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {provider.PRNO || '—'}
            </p>

            {/* Details */}
            <div className={`space-y-2 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {provider.SUBURB && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">📍</span>
                  <span>{provider.SUBURB}{provider.PROVINCE ? `, ${provider.PROVINCE}` : ''}</span>
                </div>
              )}

              {provider.TEL && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">📞</span>
                  <a
                    href={`tel:${provider.TEL}`}
                    className="text-green-600 hover:underline truncate"
                  >
                    {provider.TEL}
                  </a>
                </div>
              )}

              {provider.ADDRESS && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">🏢</span>
                  <span className="truncate">{provider.ADDRESS}</span>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className={`mt-4 pt-4 border-t text-center ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                <span>✓</span>
                Active
              </span>
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className={`px-4 py-3 border-t flex gap-2 ${
            isDark ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
          }`}>
            <button
              onClick={() => onEdit(provider)}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${provider['DOCTOR SURNAME']}?`)) {
                  onDelete(provider);
                }
              }}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
        </div>
      )}

      {/* Results count */}
      {filteredProviders.length > 0 && (
        <div className={`px-6 py-3 border-t text-sm rounded-lg ${
          isDark
            ? 'border-gray-700 bg-gray-700/30 text-gray-400'
            : 'border-gray-200 bg-gray-50 text-gray-600'
        }`}>
          Showing {filteredProviders.length} of {providers.length} providers
        </div>
      )}
    </div>
  );
};

export default ProviderGallery;
