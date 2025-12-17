import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Provider } from '../types';

interface ProviderTableProps {
  providers: Provider[];
  isDark: boolean;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
}

type SortField = 'DOCTOR SURNAME' | 'PRNO' | 'SUBURB' | 'PROVINCE';
type SortOrder = 'asc' | 'desc';

const ProviderTable: React.FC<ProviderTableProps> = ({
  providers,
  isDark,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('DOCTOR SURNAME');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAndSortedProviders = useMemo(() => {
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

    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [providers, searchTerm, sortField, sortOrder, filterStatus]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

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

      {/* Table */}
      <div className={`rounded-lg border overflow-hidden shadow-sm ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
          <table className="w-full">
            <thead className="sticky top-0 z-30">
              <tr className={`border-b ${
                isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('DOCTOR SURNAME')}
                    className={`flex items-center gap-2 text-sm font-semibold hover:text-green-600 transition-colors ${
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    Doctor Name
                    <SortIcon field="DOCTOR SURNAME" />
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('PRNO')}
                    className={`flex items-center gap-2 text-sm font-semibold hover:text-green-600 transition-colors ${
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    Provider #
                    <SortIcon field="PRNO" />
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('SUBURB')}
                    className={`flex items-center gap-2 text-sm font-semibold hover:text-green-600 transition-colors ${
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    Suburb
                    <SortIcon field="SUBURB" />
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('PROVINCE')}
                    className={`flex items-center gap-2 text-sm font-semibold hover:text-green-600 transition-colors ${
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    Province
                    <SortIcon field="PROVINCE" />
                  </button>
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  isDark ? 'text-gray-300' : 'text-gray-900'
                }`}>Phone</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  isDark ? 'text-gray-300' : 'text-gray-900'
                }`}>Address</th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${
                  isDark ? 'text-gray-300' : 'text-gray-900'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProviders.map((provider, idx) => (
                <tr
                  key={`${provider.PRNO}-${idx}`}
                  className={`border-b transition-colors ${
                    isDark
                      ? 'border-gray-700 hover:bg-gray-700/50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${idx % 2 === 0 && (isDark ? 'bg-gray-800/50' : 'bg-gray-50/50')}`}
                >
                  <td className={`px-6 py-4 text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className="flex items-center gap-3">
                      {provider.profile_picture ? (
                        <img
                          src={provider.profile_picture}
                          alt={provider['DOCTOR SURNAME']}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', provider.profile_picture);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {!provider.profile_picture && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                          {provider['DOCTOR SURNAME']?.charAt(0) || '?'}
                        </div>
                      )}
                      {provider['DOCTOR SURNAME'] || '—'}
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {provider.PRNO || '—'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {provider.SUBURB || '—'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {provider.PROVINCE || '—'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <a
                      href={`tel:${provider.TEL}`}
                      className="text-green-600 hover:underline"
                    >
                      {provider.TEL || '—'}
                    </a>
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {provider.ADDRESS || '—'}
                  </td>
                  <td className={`px-6 py-4 text-sm sticky right-20 z-10 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                      Active
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm sticky right-0 z-20 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(provider)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? 'hover:bg-gray-600 text-gray-300 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        }`}
                        title="Edit provider"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${provider['DOCTOR SURNAME']}?`)) {
                            onDelete(provider);
                          }
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                            : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                        }`}
                        title="Delete provider"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className={`px-6 py-3 border-t text-sm ${
          isDark
            ? 'border-gray-700 bg-gray-700/30 text-gray-400'
            : 'border-gray-200 bg-gray-50 text-gray-600'
        }`}>
          Showing {filteredAndSortedProviders.length} of {providers.length} providers
        </div>
      </div>
    </div>
  );
};

export default ProviderTable;
