import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../admin/supabaseClient';
import { Provider } from '../admin/types';
import { generateProviderSEO, setMetaTags } from '../utils/seoHelpers';

const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) {
        setError('Provider ID not found');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('providers')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) {
          setError('Provider not found');
          setLoading(false);
          return;
        }

        setProvider(data);

        // Set SEO meta tags
        const baseUrl = window.location.origin;
        const seo = generateProviderSEO(data, baseUrl);
        setMetaTags(seo);
      } catch (err) {
        console.error('Error fetching provider:', err);
        setError('Failed to load provider information');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading provider information...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {error || 'Provider not found'}
          </p>
          <button
            onClick={() => navigate('/directory')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/directory')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {provider['DOCTOR SURNAME']}
          </h1>
          <p className={`text-lg mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {provider.profession || 'Healthcare Professional'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="md:col-span-1">
            <div className={`rounded-lg overflow-hidden shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              {provider.profile_picture ? (
                <img
                  src={provider.profile_picture}
                  alt={provider['DOCTOR SURNAME']}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">
                    {getInitials(provider['DOCTOR SURNAME'] || '')}
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {provider['DOCTOR SURNAME']}
                </h2>
                
                {/* Contact Information */}
                <div className="space-y-4">
                  {provider.TEL && (
                    <div className="flex items-start gap-3">
                      <Phone className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Phone</p>
                        <a
                          href={`tel:${provider.TEL}`}
                          className="text-green-600 hover:text-green-700 font-semibold"
                        >
                          {provider.TEL}
                        </a>
                      </div>
                    </div>
                  )}

                  {provider.ADDRESS && (
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Address</p>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-700'}>
                          {provider.ADDRESS}
                        </p>
                      </div>
                    </div>
                  )}

                  {provider.SUBURB && (
                    <div className={`pt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p className="text-sm">
                        <span className="font-medium">{provider.SUBURB}</span>
                        {provider.PROVINCE && `, ${provider.PROVINCE}`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Professional Details */}
                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  {provider.PRNO && (
                    <div className="mb-3">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Professional Number
                      </p>
                      <p className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {provider.PRNO}
                      </p>
                    </div>
                  )}

                  {provider.profession && (
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Profession
                      </p>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {provider.profession}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            <div className={`rounded-lg shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                About {provider['DOCTOR SURNAME']}
              </h2>

              <div className="space-y-6">
                {/* Service Type */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    Service Type
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {provider.profession === 'GP'
                      ? 'General Practitioner providing primary healthcare services'
                      : provider.profession === 'Dentist'
                      ? 'Dental professional providing comprehensive dental care'
                      : 'Healthcare professional providing medical services'}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    Location
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {provider.SUBURB && provider.PROVINCE
                      ? `${provider.SUBURB}, ${provider.PROVINCE}, South Africa`
                      : provider.SUBURB || provider.PROVINCE || 'South Africa'}
                  </p>
                </div>

                {/* Day1Health Network */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    Part of Day1Health Network
                  </h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    This healthcare provider is part of the Day1Health medical insurance network. 
                    As a Day1Health member, you can access their services with your insurance coverage.
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Learn About Day1Health Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
