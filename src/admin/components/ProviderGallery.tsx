import React from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Provider } from '../types';

interface ProviderGalleryProps {
  providers: Provider[];
  isDark: boolean;
  onEdit: (provider: Provider) => void;
  onDeactivate: (provider: Provider) => void;
}

const ProviderGallery: React.FC<ProviderGalleryProps> = ({
  providers,
  isDark,
  onEdit,
  onDeactivate,
}) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {providers.map((provider) => (
        <div
          key={provider.id}
          className={`rounded-lg border overflow-hidden transition-all hover:shadow-lg ${
            isDark
              ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          {/* Header with status badge and menu */}
          <div className={`px-4 pt-4 pb-2 flex items-start justify-between border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              provider.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {provider.is_active ? '● Active' : '● Inactive'}
            </span>
            <div className="relative group">
              <button className={`p-1 rounded transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <MoreVertical className="w-4 h-4" />
              </button>
              <div className={`absolute right-0 mt-1 w-32 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${
                isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={() => onEdit(provider)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    isDark
                      ? 'text-gray-300 hover:bg-gray-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                {provider.is_active && (
                  <button
                    onClick={() => onDeactivate(provider)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 border-t ${
                      isDark
                        ? 'border-gray-600 text-red-400 hover:bg-gray-600'
                        : 'border-gray-200 text-red-600 hover:bg-gray-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="px-4 py-6 flex justify-center">
            {provider.profile_image_url ? (
              <img
                src={provider.profile_image_url}
                alt={provider.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                {provider.full_name.charAt(0)}
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
              {provider.full_name}
            </h3>
            <p className={`text-sm text-center mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {provider.profession}
            </p>

            {/* Details */}
            <div className={`space-y-2 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {provider.practice_name && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">🏥</span>
                  <span className="truncate">{provider.practice_name}</span>
                </div>
              )}

              {provider.city && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">📍</span>
                  <span>{provider.city}{provider.province ? `, ${provider.province}` : ''}</span>
                </div>
              )}

              {provider.phone && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">📞</span>
                  <a
                    href={`tel:${provider.phone}`}
                    className="text-green-600 hover:underline truncate"
                  >
                    {provider.phone}
                  </a>
                </div>
              )}

              {provider.email && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">✉️</span>
                  <a
                    href={`mailto:${provider.email}`}
                    className="text-green-600 hover:underline truncate"
                  >
                    {provider.email}
                  </a>
                </div>
              )}
            </div>

            {/* Verification Badge */}
            <div className={`mt-4 pt-4 border-t text-center ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {provider.verified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 gap-1">
                  <span>✓</span>
                  Verified
                </span>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDark
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Unverified
                </span>
              )}
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
            {provider.is_active && (
              <button
                onClick={() => onDeactivate(provider)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Deactivate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProviderGallery;
