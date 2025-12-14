import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../admin/supabaseClient';
import { Provider } from '../admin/types';
import ProviderSidebar from './components/ProviderSidebar';

const DirectoryPage: React.FC = () => {
  const { isDark } = useTheme();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [professionFilter, setProfessionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [showStickyFilter, setShowStickyFilter] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky filter when scrolled past hero section (approximately 600px)
      setShowStickyFilter(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch = 
        provider.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.practice_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProfession = 
        professionFilter === 'all' || 
        provider.profession?.toUpperCase() === professionFilter.toUpperCase();

      return matchesSearch && matchesProfession;
    });
  }, [providers, searchQuery, professionFilter]);

  const getProfessionColor = (profession: string) => {
    const prof = profession?.toUpperCase();
    return prof === 'GP' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div 
        className="border-b relative overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/images/doctor-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch relative min-h-screen lg:min-h-auto">
          {/* Left Column - White Background */}
          <div className={`lg:col-span-2 p-4 sm:p-8 lg:p-12 flex flex-col justify-center min-h-screen lg:min-h-96 ${isDark ? 'bg-white/95' : 'bg-white'} relative z-10`}>
              {/* Heading with Logo */}
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Discover A New<br />
                  World Of Doctors with us
                </h1>
                <img 
                  src="/assets/images/Logo.jpg" 
                  alt="Day1 Health Logo" 
                  className="h-12 sm:h-14 lg:h-16 w-auto object-contain flex-shrink-0"
                />
              </div>

              {/* Search Bar and Filters - Sticky */}
              <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
                {/* Search Bar */}
                <div className="mb-4 sm:mb-6">
                  <div className="relative rounded-xl shadow-md overflow-hidden bg-white max-w-sm">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border-0 outline-none transition-all bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Filter Options - Horizontal Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-8 w-full">
                {/* Profession Filter */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Profession</p>
                  <div className="flex flex-col gap-2">
                    {['all', 'GP', 'Dentist'].map((prof) => (
                      <button
                        key={prof}
                        onClick={() => setProfessionFilter(prof)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                          professionFilter === prof
                            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {prof === 'all' ? 'All' : prof}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Status</p>
                  <div className="flex flex-col gap-2">
                    {['All', 'Verified', 'Unverified'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                          statusFilter === status
                            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Cities</p>
                  <div className="flex flex-col gap-2">
                    {['Johannesburg', 'Cape Town', 'Durban'].map((city) => (
                      <button
                        key={city}
                        className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all text-left whitespace-nowrap"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Availability</p>
                  <div className="flex flex-col gap-2">
                    {['All', 'Available', 'Busy'].map((avail) => (
                      <button
                        key={avail}
                        onClick={() => setAvailabilityFilter(avail)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                          availabilityFilter === avail
                            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {avail}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              </div>

              {/* Featured Providers Cards */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3 sm:mb-4">Featured Providers</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {filteredProviders.slice(0, 4).map((provider) => (
                    <div
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider)}
                      className="p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all border border-gray-200 hover:border-green-300"
                    >
                      <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                        <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white bg-gradient-to-br ${getProfessionColor(provider.profession)}`}>
                          {getInitials(provider.full_name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{provider.full_name}</h3>
                            {provider.verified && (
                              <CheckCircle className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">{provider.profession} • {provider.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* Right Column - Doctor Image */}
          <div className="hidden lg:flex items-center justify-center lg:col-span-1 relative">
            {/* Cloud-like Divider */}
            <svg
              className="absolute left-0 top-0 h-full"
              style={{ width: '100px', marginLeft: '-50px' }}
              viewBox="0 0 100 400"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="cloudFilter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
                </filter>
              </defs>
              <path
                d="M 100 0 Q 80 50 100 100 Q 70 150 100 200 Q 80 250 100 300 Q 70 350 100 400 L 0 400 L 0 0 Z"
                fill="white"
                stroke="none"
                filter="url(#cloudFilter)"
              />
            </svg>
            <img
              src="/assets/images/doctor.png"
              alt="Healthcare Provider"
              className="w-full h-full object-contain relative z-10"
              style={{
                transform: 'scale(1.6) rotate(-8deg) translateY(60px) translateX(-80px)',
                transformOrigin: 'center',
              }}
            />
          </div>
        </div>
      </div>

      {/* Sticky Filter Sidebar */}
      {showStickyFilter && (
        <div 
          className={`hidden lg:block fixed left-0 top-0 h-screen w-64 ${isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} shadow-lg overflow-y-auto z-40 pt-6 px-4 transition-all duration-500 ease-out`}
          style={{
            animation: 'fadeInSlide 0.6s ease-out forwards',
          }}
        >
          <div className="space-y-6">
            {/* Search Bar */}
            <div>
              <div className="relative rounded-lg shadow-sm overflow-hidden bg-white">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border-0 outline-none transition-all bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Profession Filter */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Profession</p>
              <div className="flex flex-col gap-2">
                {['all', 'GP', 'Dentist'].map((prof) => (
                  <button
                    key={prof}
                    onClick={() => setProfessionFilter(prof)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                      professionFilter === prof
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {prof === 'all' ? 'All' : prof}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Status</p>
              <div className="flex flex-col gap-2">
                {['All', 'Verified', 'Unverified'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Cities</p>
              <div className="flex flex-col gap-2">
                {['Johannesburg', 'Cape Town', 'Durban'].map((city) => (
                  <button
                    key={city}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                      isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Availability</p>
              <div className="flex flex-col gap-2">
                {['All', 'Available', 'Busy'].map((avail) => (
                  <button
                    key={avail}
                    onClick={() => setAvailabilityFilter(avail)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                      availabilityFilter === avail
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {avail}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-16 ${showStickyFilter ? 'lg:ml-64' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Available Providers
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600 hover:bg-gray-700'
                      : 'bg-white border border-gray-100 hover:border-green-200'
                  }`}
                >
                  {/* Top Section with Avatar and Badge */}
                  <div className={`p-6 pb-4 ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-700/50' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br ${getProfessionColor(provider.profession)} shadow-lg`}>
                        {getInitials(provider.full_name)}
                      </div>
                      {provider.verified && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Name and Title */}
                    <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {provider.full_name}
                    </h3>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {provider.profession}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={`h-px ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`} />

                  {/* Details Section */}
                  <div className="p-6 space-y-4">
                    {/* Practice Name */}
                    {provider.practice_name && (
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Practice
                        </p>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {provider.practice_name}
                        </p>
                      </div>
                    )}

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Location
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {provider.city}, {provider.province}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    {provider.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Contact
                          </p>
                          <a href={`tel:${provider.phone}`} className={`text-sm font-medium hover:underline ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            {provider.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="px-6 pb-6">
                    <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-green-500/30 hover:scale-105">
                      View Full Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-white'}`}>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                No providers found
              </p>
              <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {selectedProvider && (
        <ProviderSidebar
          provider={selectedProvider}
          isDark={isDark}
          onClose={() => setSelectedProvider(null)}
        />
      )}

      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DirectoryPage;
