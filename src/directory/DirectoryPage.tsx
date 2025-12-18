import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, MapPin, Phone, Filter, ArrowUpDown } from 'lucide-react';
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
  const [showMobileFilterBar, setShowMobileFilterBar] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc'>('name-asc');
  const [touchStart, setTouchStart] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllProviders();
  }, []);

  // Handle scroll to show/hide mobile filter bar
  useEffect(() => {
    const handleScroll = () => {
      if (resultsRef.current) {
        const resultsTop = resultsRef.current.getBoundingClientRect().top;
        // Show filter bar when results section is scrolled past (top is negative or very small)
        setShowMobileFilterBar(resultsTop < 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle swipe for mobile slider - Optimized for smooth scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleSwipe(e.changedTouches[0].clientX);
  };

  const handleSwipe = (endX: number) => {
    if (!sliderRef.current) return;
    const diff = touchStart - endX;
    const isLeftSwipe = diff > 30;
    const isRightSwipe = diff < -30;

    if (isLeftSwipe) {
      sliderRef.current.scrollBy({ left: sliderRef.current.clientWidth, behavior: 'smooth' });
    }
    if (isRightSwipe) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.clientWidth, behavior: 'smooth' });
    }
  };



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
      console.log('Sample provider with profile_picture:', allData.find(p => p.profile_picture));
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
    let filtered = allProviders.filter((provider) => {
      const matchesSearch = !searchQuery.trim() || 
        provider['DOCTOR SURNAME']?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.SUBURB?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.ADDRESS?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = !selectedRegion || provider.REGION?.trim() === selectedRegion;
      const matchesProvince = !selectedProvince || provider.PROVINCE?.trim() === selectedProvince;
      const matchesSuburb = !selectedSuburb || provider.SUBURB?.trim() === selectedSuburb;
      const matchesProfession = !selectedProfession || provider.profession?.trim() === selectedProfession;

      return matchesSearch && matchesRegion && matchesProvince && matchesSuburb && matchesProfession;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const nameA = (a['DOCTOR SURNAME'] || '').toLowerCase();
      const nameB = (b['DOCTOR SURNAME'] || '').toLowerCase();
      
      if (sortBy === 'name-asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [allProviders, searchQuery, selectedRegion, selectedProvince, selectedSuburb, selectedProfession, sortBy]);

  // Get unique values for filter dropdowns
  const regions = useMemo(() => {
    const unique = new Set(
      allProviders
        .map(p => p.REGION?.trim())
        .filter(Boolean)
    );
    return Array.from(unique).sort();
  }, [allProviders]);

  const provinces = useMemo(() => {
    const unique = new Set(
      allProviders
        .map(p => p.PROVINCE?.trim())
        .filter(Boolean)
    );
    return Array.from(unique).sort();
  }, [allProviders]);

  const suburbs = useMemo(() => {
    const unique = new Set(
      allProviders
        .map(p => p.SUBURB?.trim())
        .filter(Boolean)
    );
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch relative min-h-auto z-0">
          {/* Left Column - White Background */}
          <div className={`lg:col-span-2 p-2 sm:p-4 lg:p-6 flex flex-col justify-start min-h-auto sm:min-h-screen lg:min-h-96 ${isDark ? 'bg-white/95' : 'bg-white'}`}>
              {/* Heading with Logo */}
              <div className="flex items-center justify-start sm:justify-start gap-4 sm:gap-12 lg:gap-16 mb-4 sm:mb-8 ml-4 sm:ml-0">
                <img 
                  src="/assets/images/Logo.jpg" 
                  alt="Day1 Health Logo" 
                  className="h-20 sm:h-48 lg:h-56 w-auto object-contain flex-shrink-0"
                />
                <h1 className="text-lg sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Our GP & Dentist Network
                </h1>
              </div>

              {/* Search Bar and Filters - Sticky */}
              <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
                {/* Search Bar and Service Filter */}
                <div className="mb-4 sm:mb-6">
                  {/* Mobile: Search bar with toggle buttons inside */}
                  <div className="sm:hidden relative rounded-xl shadow-md overflow-hidden bg-white">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-24 py-2 text-sm border-0 outline-none transition-all bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                    />
                    {/* Service Radio Buttons - Inside search bar on mobile */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <label className="flex items-center gap-0.5 cursor-pointer">
                        <input
                          type="radio"
                          name="service"
                          value=""
                          checked={selectedProfession === ''}
                          onChange={(e) => setSelectedProfession(e.target.value)}
                          className="w-3 h-3 cursor-pointer accent-green-600"
                        />
                        <span className="text-xs font-medium text-gray-700">All</span>
                      </label>
                      <label className="flex items-center gap-0.5 cursor-pointer">
                        <input
                          type="radio"
                          name="service"
                          value="GP"
                          checked={selectedProfession === 'GP'}
                          onChange={(e) => setSelectedProfession(e.target.value)}
                          className="w-3 h-3 cursor-pointer accent-green-600"
                        />
                        <span className="text-xs font-medium text-gray-700">GP</span>
                      </label>
                      <label className="flex items-center gap-0.5 cursor-pointer">
                        <input
                          type="radio"
                          name="service"
                          value="Dentist"
                          checked={selectedProfession === 'Dentist'}
                          onChange={(e) => setSelectedProfession(e.target.value)}
                          className="w-3 h-3 cursor-pointer accent-green-600"
                        />
                        <span className="text-xs font-medium text-gray-700">Dentist</span>
                      </label>
                    </div>
                  </div>

                  {/* Desktop: Search bar with separate toggle buttons below */}
                  <div className="hidden sm:block">
                    <div className="relative rounded-xl shadow-md overflow-hidden bg-white mb-3">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border-0 outline-none transition-all bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* Service Radio Buttons - Desktop */}
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="service"
                          value=""
                          checked={selectedProfession === ''}
                          onChange={(e) => setSelectedProfession(e.target.value)}
                          className="w-4 h-4 cursor-pointer accent-green-600"
                        />
                        <span className="text-sm font-medium text-gray-700">All</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="service"
                          value="GP"
                          checked={selectedProfession === 'GP'}
                          onChange={(e) => setSelectedProfession(e.target.value)}
                          className="w-4 h-4 cursor-pointer accent-green-600"
                        />
                        <span className="text-sm font-medium text-gray-700">GP</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="service"
                          value="Dentist"
                          checked={selectedProfession === 'Dentist'}
                          onChange={(e) => setSelectedProfession(e.target.value)}
                          className="w-4 h-4 cursor-pointer accent-green-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Dentist</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Filter Options - Horizontal Layout */}
                <div className="grid grid-cols-3 gap-3 w-full">
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
              <div className="mb-4 sm:mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 sm:mb-3">Featured Providers</p>
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
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded object-cover border-2 border-white"
                            onError={(e) => {
                              console.error('Failed to load featured image:', provider.profile_picture);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                        {!provider.profile_picture && (
                          <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded flex items-center justify-center text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600`}>
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
          <div className="hidden lg:flex items-center justify-center lg:col-span-1 relative pointer-events-none z-50">
            {/* Cloudy Divider */}
            <svg
              className="absolute left-0 top-0 h-full z-10"
              style={{ width: '80px', marginLeft: '-20px' }}
              viewBox="0 0 80 400"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="cloudDivider">
                  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
                </filter>
              </defs>
              <path
                d="M 80 0 Q 60 40 80 80 Q 50 120 80 160 Q 60 200 80 240 Q 50 280 80 320 Q 60 360 80 400 L 0 400 L 0 0 Z"
                fill="white"
                stroke="none"
                filter="url(#cloudDivider)"
              />
            </svg>
            
            <img
              src="/assets/images/doctor.png"
              alt="Healthcare Provider"
              className="w-full h-full object-contain relative z-20"
              style={{
                transform: 'scale(1.6) rotate(-8deg) translateY(60px) translateX(-80px)',
                transformOrigin: 'center',
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Bar - Sticky on scroll */}
      {showMobileFilterBar && (
        <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300 animate-slideDown ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between px-4 py-3 gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>
              
              {/* Sort Menu */}
              {showSortMenu && (
                <div className={`absolute top-full left-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${
                  isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <button
                    onClick={() => {
                      setSortBy('name-asc');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      sortBy === 'name-asc'
                        ? isDark ? 'bg-gray-600 text-white' : 'bg-green-50 text-green-700'
                        : isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ↑ Name (A-Z)
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('name-desc');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      sortBy === 'name-desc'
                        ? isDark ? 'bg-gray-600 text-white' : 'bg-green-50 text-green-700'
                        : isDark ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ↓ Name (Z-A)
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center gap-2">
              <button className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedProfession === '' ? 'bg-green-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`} onClick={() => setSelectedProfession('')}>
                All
              </button>
              <button className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedProfession === 'GP' ? 'bg-green-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`} onClick={() => setSelectedProfession('GP')}>
                GP
              </button>
              <button className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedProfession === 'Dentist' ? 'bg-green-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`} onClick={() => setSelectedProfession('Dentist')}>
                Dentist
              </button>
            </div>
            
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-8 sm:py-16`} ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-12">
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Available Providers
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters (Hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-1">
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

                {/* Service Filter - Radio Buttons */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Service
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="service-sidebar"
                        value=""
                        checked={selectedProfession === ''}
                        onChange={(e) => setSelectedProfession(e.target.value)}
                        className="w-4 h-4 cursor-pointer accent-green-600"
                      />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>All Services</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="service-sidebar"
                        value="GP"
                        checked={selectedProfession === 'GP'}
                        onChange={(e) => setSelectedProfession(e.target.value)}
                        className="w-4 h-4 cursor-pointer accent-green-600"
                      />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>GP</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="service-sidebar"
                        value="Dentist"
                        checked={selectedProfession === 'Dentist'}
                        onChange={(e) => setSelectedProfession(e.target.value)}
                        className="w-4 h-4 cursor-pointer accent-green-600"
                      />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Dentist</span>
                    </label>
                  </div>
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
            <div className="col-span-1 lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : displayedProviders.length > 0 ? (
            <>
              {/* Mobile Horizontal Slider */}
              <div 
                ref={sliderRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="lg:hidden flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scroll-smooth px-4 mobile-slider-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
              >
                {displayedProviders.map((provider, index) => (
                  <div
                    key={`mobile-provider-${index}`}
                    onClick={() => setSelectedProvider(provider)}
                    className={`flex-shrink-0 w-full sm:w-96 group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 snap-center ${
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
                            className="w-14 h-14 rounded-lg object-cover shadow-lg border-2 border-white"
                          />
                        ) : null}
                        {!provider.profile_picture && (
                          <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg`}>
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

              {/* Desktop Grid */}
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          className="w-14 h-14 rounded-lg object-cover shadow-lg border-2 border-white"
                          onError={(e) => {
                            console.error('Failed to load image:', provider.profile_picture);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {!provider.profile_picture && (
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg`}>
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

              {/* Infinite scroll observer target - Hidden on mobile */}
              <div ref={observerTarget} className="hidden lg:flex justify-center py-8">
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

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 mobile-filter-overlay">
          <div className={`fixed bottom-0 left-0 right-0 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto mobile-filter-modal ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>

            {/* Filters Grid - Side by side on mobile */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Region Filter */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={`w-full px-2 py-2 rounded-lg text-xs border transition-all ${
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
              </div>

              {/* Province Filter */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Province
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className={`w-full px-2 py-2 rounded-lg text-xs border transition-all ${
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
              </div>
            </div>

            {/* Suburb Filter - Full width */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Suburb
              </label>
              <select
                value={selectedSuburb}
                onChange={(e) => setSelectedSuburb(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-sm border transition-all ${
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
      )}

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
