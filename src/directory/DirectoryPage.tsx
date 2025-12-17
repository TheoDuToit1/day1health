import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, MapPin, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../admin/supabaseClient';
import { Provider } from '../admin/types';
import ProviderSidebar from './components/ProviderSidebar';

const ITEMS_PER_PAGE = 30;

const DirectoryPage: React.FC = () => {
  const { isDark } = useTheme();
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [displayedProviders, setDisplayedProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllProviders();
  }, []);



  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      let allData: Provider[] = [];
      let offset = 0;
      const pageSize = 500;
      let hasMore = true;

      while (hasMore) {
        const { data, error, count } = await supabase
          .from('providers')
          .select('*', { count: 'exact' })
          .range(offset, offset + pageSize - 1);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          allData = [...allData, ...data];
          offset += pageSize;
          
          // Stop if we've fetched all records
          if (count !== null && allData.length >= count) {
            hasMore = false;
          }
        }
      }
      
      console.log('Fetched all providers:', allData.length);
      setAllProviders(allData);
      setDisplayedProviders(allData.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setAllProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = useMemo(() => {
    return allProviders.filter((provider) => {
      const matchesSearch = !searchQuery.trim() || 
        provider['DOCTOR SURNAME']?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.SUBURB?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.ADDRESS?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = !selectedRegion || provider.REGION === selectedRegion;
      const matchesProvince = !selectedProvince || provider.PROVINCE === selectedProvince;
      const matchesSuburb = !selectedSuburb || provider.SUBURB === selectedSuburb;
      const matchesProfession = !selectedProfession || provider.profession === selectedProfession;

      return matchesSearch && matchesRegion && matchesProvince && matchesSuburb && matchesProfession;
    });
  }, [allProviders, searchQuery, selectedRegion, selectedProvince, selectedSuburb, selectedProfession]);

  // Get unique values for filter dropdowns
  const regions = useMemo(() => {
    const unique = new Set(allProviders.map(p => p.REGION).filter(Boolean));
    return Array.from(unique).sort();
  }, [allProviders]);

  const provinces = useMemo(() => {
    const unique = new Set(allProviders.map(p => p.PROVINCE).filter(Boolean));
    return Array.from(unique).sort();
  }, [allProviders]);

  const suburbs = useMemo(() => {
    const unique = new Set(allProviders.map(p => p.SUBURB).filter(Boolean));
    return Array.from(unique).sort();
  }, [allProviders]);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIdx = 0;
      const endIdx = nextPage * ITEMS_PER_PAGE;
      const newItems = filteredProviders.slice(startIdx, endIdx);
      
      setDisplayedProviders(newItems);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 300);
  }, [currentPage, loadingMore, filteredProviders]);

  // Reset pagination when filtered results change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedProviders(filteredProviders.slice(0, ITEMS_PER_PAGE));
  }, [filteredProviders]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && displayedProviders.length < filteredProviders.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, loadingMore, displayedProviders.length, filteredProviders.length]);

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
          <div className={`lg:col-span-2 p-2 sm:p-4 lg:p-6 flex flex-col justify-start min-h-screen lg:min-h-96 ${isDark ? 'bg-white/95' : 'bg-white'} relative z-10`}>
              {/* Heading with Logo */}
              <div className="flex items-center justify-start gap-8 sm:gap-12 lg:gap-16 mb-6 sm:mb-8">
                <img 
                  src="/assets/images/Logo.jpg" 
                  alt="Day1 Health Logo" 
                  className="h-32 sm:h-48 lg:h-56 w-auto object-contain flex-shrink-0"
                />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Browse the Full GP and<br />
                  Dentist Network Here
                </h1>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  {/* Region Filter */}
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>

                  {/* Province Filter */}
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Provinces</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>

                  {/* Suburb Filter */}
                  <select
                    value={selectedSuburb}
                    onChange={(e) => setSelectedSuburb(e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Suburbs</option>
                    {suburbs.map((suburb) => (
                      <option key={suburb} value={suburb}>
                        {suburb}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Providers Cards */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3 sm:mb-4">Featured Providers</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {filteredProviders.slice(0, 4).map((provider, index) => (
                    <div
                      key={`featured-${index}`}
                      onClick={() => setSelectedProvider(provider)}
                      className="p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all border border-gray-200 hover:border-green-300"
                    >
                      <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                        {provider.profile_picture ? (
                          <img
                            src={provider.profile_picture}
                            alt={provider['DOCTOR SURNAME']}
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600`}>
                            {getInitials(provider['DOCTOR SURNAME'] || '')}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{provider['DOCTOR SURNAME']}</h3>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">{provider.SUBURB}</p>
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

      {/* Results Section */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Available Providers
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl p-6 sticky top-20 ${isDark ? 'bg-gray-700/50' : 'bg-white'}`}>
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Filters
                </h3>

                {/* Region Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
                      isDark
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Province Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Province
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
                      isDark
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Provinces</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Suburb Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Suburb
                  </label>
                  <select
                    value={selectedSuburb}
                    onChange={(e) => setSelectedSuburb(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
                      isDark
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Suburbs</option>
                    {suburbs.map((suburb) => (
                      <option key={suburb} value={suburb}>
                        {suburb}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profession Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Profession
                  </label>
                  <select
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
                      isDark
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All Professions</option>
                    <option value="GP">GP</option>
                    <option value="Dentist">Dentist</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                {(selectedRegion || selectedProvince || selectedSuburb || selectedProfession) && (
                  <button
                    onClick={() => {
                      setSelectedRegion('');
                      setSelectedProvince('');
                      setSelectedSuburb('');
                      setSelectedProfession('');
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-medium text-sm transition-all hover:shadow-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Right Content - Providers Grid */}
            <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : displayedProviders.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProviders.map((provider, index) => (
                <div
                  key={`provider-${index}`}
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
                      {provider.profile_picture ? (
                        <img
                          src={provider.profile_picture}
                          alt={provider['DOCTOR SURNAME']}
                          className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-white"
                        />
                      ) : (
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg`}>
                          {getInitials(provider['DOCTOR SURNAME'] || '')}
                        </div>
                      )}
                    </div>

                    {/* Name and Title */}
                    <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {provider['DOCTOR SURNAME']}
                    </h3>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {provider.profession || 'GP'}
                    </p>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {provider.PRNO}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={`h-px ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`} />

                  {/* Details Section */}
                  <div className="p-6 space-y-4">
                    {/* PRNO */}
                    {provider.PRNO && (
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Registration
                        </p>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {provider.PRNO}
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
                          {provider.SUBURB}, {provider.PROVINCE}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    {provider.TEL && (
                      <div className="flex items-start gap-3">
                        <Phone className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Contact
                          </p>
                          <a href={`tel:${provider.TEL}`} className={`text-sm font-medium hover:underline ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            {provider.TEL}
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

              {/* Infinite scroll observer target */}
              <div ref={observerTarget} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                )}
                {!loadingMore && displayedProviders.length < filteredProviders.length && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Scroll to load more...
                  </p>
                )}
                {displayedProviders.length >= filteredProviders.length && filteredProviders.length > 0 && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    All {filteredProviders.length} providers loaded
                  </p>
                )}
              </div>
            </>
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
