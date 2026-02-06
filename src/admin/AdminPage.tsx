import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, AlertCircle, CheckCircle, Loader, Grid3x3, LayoutGrid, BarChart3, Users, TrendingUp, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from './supabaseClient';
import { Provider, FormData } from './types';
import ProviderTable from './components/ProviderTable';
import ProviderGallery from './components/ProviderGallery';
import ProviderForm from './components/ProviderForm';

type ViewMode = 'grid' | 'gallery';
type TabMode = 'analytics' | 'providers';

const AnalyticsContent: React.FC<{ providers: Provider[]; isDark: boolean }> = ({ providers, isDark }) => {
  const analytics = useMemo(() => {
    const total = providers.length;
    const active = total; // All CSV providers are considered active
    const inactive = 0;
    const verified = total; // All CSV providers are considered verified
    const unverified = 0;
    
    const gps = providers.filter((p) => p.profession?.trim().toUpperCase() === 'GP').length;
    const dentists = providers.filter((p) => p.profession?.trim().toUpperCase() === 'DENTIST').length;
    
    const verificationRate = total > 0 ? Math.round((verified / total) * 100) : 0;
    const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;

    const suburbCount: Record<string, number> = {};
    providers.forEach((p) => {
      if (p.SUBURB) suburbCount[p.SUBURB] = (suburbCount[p.SUBURB] || 0) + 1;
    });
    const topCities = Object.entries(suburbCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return { total, active, inactive, verified, unverified, gps, dentists, verificationRate, activeRate, topCities };
  }, [providers]);

  const StatCard = ({ icon: Icon, label, value, subtext, color, delay = 0 }: { icon: React.ReactNode; label: string; value: number; subtext: string; color: 'green' | 'blue' | 'purple' | 'orange'; delay?: number }) => {
    const colorClasses: Record<'green' | 'blue' | 'purple' | 'orange', string> = {
      green: isDark ? 'bg-gradient-to-br from-green-900/40 to-green-900/20 border-green-700/50' : 'bg-gradient-to-br from-green-50 to-green-50/50 border-green-200',
      blue: isDark ? 'bg-gradient-to-br from-blue-900/40 to-blue-900/20 border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-50/50 border-blue-200',
      purple: isDark ? 'bg-gradient-to-br from-purple-900/40 to-purple-900/20 border-purple-700/50' : 'bg-gradient-to-br from-purple-50 to-purple-50/50 border-purple-200',
      orange: isDark ? 'bg-gradient-to-br from-orange-900/40 to-orange-900/20 border-orange-700/50' : 'bg-gradient-to-br from-orange-50 to-orange-50/50 border-orange-200',
    };
    const accentClasses: Record<'green' | 'blue' | 'purple' | 'orange', string> = { green: 'from-green-500 to-green-600', blue: 'from-blue-500 to-blue-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600' };

    return (
      <div 
        className={`rounded-lg border p-6 transition-all hover:shadow-xl hover:scale-105 ${colorClasses[color]}`}
        style={{ animation: `slideUp 0.6s ease-out ${delay}s both` }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
            <p className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
            {subtext && <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{subtext}</p>}
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-br ${accentClasses[color]} shadow-lg`}>
            <div className="w-6 h-6 text-white">{Icon}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6" />} label="Total Providers" value={analytics.total} subtext={`${analytics.gps} GPs, ${analytics.dentists} Dentists`} color="green" delay={0} />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Active Providers" value={analytics.active} subtext={`${analytics.activeRate}% of total`} color="blue" delay={0.1} />
        <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Verified" value={analytics.verified} subtext={`${analytics.verificationRate}% verified`} color="purple" delay={0.2} />
        <StatCard icon={<AlertCircle className="w-6 h-6" />} label="Inactive" value={analytics.inactive} subtext="Soft deleted" color="orange" delay={0.3} />
      </div>

      {/* Professional Breakdown */}
      <div className={`rounded-xl border p-8 transition-all ${isDark ? 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-800/30' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'}`} style={{ animation: 'slideUp 0.6s ease-out 0.4s both' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Professional Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(() => {
            const professionCounts: Record<string, number> = {};
            providers.forEach((p) => {
              const prof = p.profession?.trim().toUpperCase() || 'UNKNOWN';
              professionCounts[prof] = (professionCounts[prof] || 0) + 1;
            });
            
            return [
              { label: 'General Practitioners', value: professionCounts['GP'] || 0, icon: '👨‍⚕️', color: 'from-blue-500 to-blue-600' },
              { label: 'Dentists', value: professionCounts['DENTIST'] || 0, icon: '🦷', color: 'from-purple-500 to-purple-600' },
            ];
          })().map((item, idx) => (
            <div key={item.label} className="group" style={{ animation: `slideUp 0.6s ease-out ${0.5 + idx * 0.1}s both` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                  </div>
                </div>
                <div className={`text-right px-4 py-2 rounded-lg bg-gradient-to-br ${item.color} text-white font-bold`}>
                  {analytics.total > 0 ? Math.round((item.value / analytics.total) * 100) : 0}%
                </div>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                  style={{
                    width: `${analytics.total > 0 ? (item.value / analytics.total) * 100 : 0}%`,
                    animation: `expandWidth 1s ease-out ${0.6 + idx * 0.1}s both`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div className={`rounded-xl border p-8 transition-all ${isDark ? 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-800/30' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'}`} style={{ animation: 'slideUp 0.6s ease-out 0.5s both' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Locations</h3>
        </div>
        <div className="space-y-4">
          {analytics.topCities.length > 0 ? (
            analytics.topCities.map(([city, count], idx) => (
              <div key={city} className="group" style={{ animation: `slideUp 0.6s ease-out ${0.6 + idx * 0.08}s both` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white transition-transform group-hover:scale-110 ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      idx === 3 ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                      'bg-gradient-to-br from-indigo-400 to-indigo-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{city}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{count} provider{count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0}%
                  </div>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      idx === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                      idx === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                      idx === 3 ? 'bg-gradient-to-r from-pink-400 to-pink-600' :
                      'bg-gradient-to-r from-indigo-400 to-indigo-600'
                    }`}
                    style={{
                      width: `${analytics.total > 0 ? (count / analytics.total) * 100 : 0}%`,
                      animation: `expandWidth 1s ease-out ${0.7 + idx * 0.08}s both`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No location data available</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: var(--width, 100%);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { isDark } = useTheme();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [tabMode, setTabMode] = useState<TabMode>('analytics');

  // Fetch providers on mount
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching providers...');
      
      let allData: Provider[] = [];
      let offset = 0;
      const pageSize = 500;
      let hasMore = true;

      while (hasMore) {
        const { data, error: fetchError, count } = await supabase
          .from('providers')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + pageSize - 1);

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          allData = [...allData, ...data];
          offset += pageSize;
          
          if (count !== null && allData.length >= count) {
            hasMore = false;
          }
        }
      }

      console.log('Fetch response:', { count: allData.length });
      setProviders(allData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch providers';
      console.error('Error fetching providers:', message, err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = () => {
    setEditingProvider(null);
    setIsFormOpen(true);
  };

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider(provider);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const handleSaveProvider = async (formData: FormData) => {
    try {
      setFormLoading(true);
      setError(null);

      console.log('Saving provider:', formData);

      if (editingProvider) {
        // Update existing provider
        console.log('Updating provider with PRNO:', editingProvider.PRNO);
        const { data, error: updateError } = await supabase
          .from('providers')
          .update(formData)
          .eq('PRNO', editingProvider.PRNO)
          .select();

        console.log('Update response:', { data, error: updateError });

        if (updateError) throw updateError;
        setSuccess('Provider updated successfully');
      } else {
        // Insert new provider
        console.log('Inserting new provider');
        const { data, error: insertError } = await supabase
          .from('providers')
          .insert([formData])
          .select();

        console.log('Insert response:', { data, error: insertError });

        if (insertError) throw insertError;
        setSuccess('Provider added successfully');
      }

      handleCloseForm();
      await fetchProviders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save provider';
      console.error('Error saving provider:', message, err);
      setError(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeactivateProvider = async (provider: Provider) => {
    if (!window.confirm(`Deactivate ${provider['DOCTOR SURNAME']}?`)) return;

    try {
      setError(null);
      console.log('Deactivating provider:', provider.PRNO);
      const { data, error: updateError } = await supabase
        .from('providers')
        .update({ is_active: false })
        .eq('PRNO', provider.PRNO)
        .select();

      console.log('Deactivate response:', { data, error: updateError });

      if (updateError) throw updateError;
      setSuccess(`${provider['DOCTOR SURNAME']} deactivated`);
      await fetchProviders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deactivate provider';
      console.error('Error deactivating provider:', message, err);
      setError(message);
    }
  };

  const handleDeleteProvider = async (provider: Provider) => {
    try {
      setError(null);
      console.log('Deleting provider:', provider.PRNO);
      const { error: deleteError } = await supabase
        .from('providers')
        .delete()
        .eq('PRNO', provider.PRNO);

      if (deleteError) throw deleteError;
      setSuccess(`${provider['DOCTOR SURNAME']} deleted successfully`);
      await fetchProviders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete provider';
      console.error('Error deleting provider:', message, err);
      setError(message);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${
        isDark ? 'border-gray-800 bg-gradient-to-r from-gray-800 to-gray-800/50' : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent`}>
                Provider Directory
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage GP and Dentist listings • Real-time analytics
              </p>
            </div>
            <button
              onClick={handleAddProvider}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Provider
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b" style={{
            borderColor: isDark ? '#374151' : '#e5e7eb'
          }}>
            <button
              onClick={() => setTabMode('analytics')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
                tabMode === 'analytics'
                  ? 'border-green-600 text-green-600'
                  : isDark
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setTabMode('providers')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
                tabMode === 'providers'
                  ? 'border-green-600 text-green-600'
                  : isDark
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Providers
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-600 hover:text-green-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Analytics Tab */}
        {tabMode === 'analytics' && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-green-600 animate-spin" />
              </div>
            ) : (
              <AnalyticsContent providers={providers} isDark={isDark} />
            )}
          </div>
        )}

        {/* Providers Tab */}
        {tabMode === 'providers' && (
          <div className="animate-fade-in space-y-6">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                  viewMode === 'grid'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                Grid View
              </button>
              <button
                onClick={() => setViewMode('gallery')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                  viewMode === 'gallery'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Gallery View
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-green-600 animate-spin" />
              </div>
            ) : viewMode === 'grid' ? (
              <ProviderTable
                providers={providers}
                isDark={isDark}
                onEdit={handleEditProvider}
                onDelete={handleDeleteProvider}
              />
            ) : (
              <ProviderGallery
                providers={providers}
                isDark={isDark}
                onEdit={handleEditProvider}
                onDelete={handleDeleteProvider}
              />
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <ProviderForm
          isDark={isDark}
          provider={editingProvider}
          onClose={handleCloseForm}
          onSave={handleSaveProvider}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default AdminPage;
