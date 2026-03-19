import React, { useMemo } from 'react';
import { Users, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Provider } from '../types';

interface AnalyticsDashboardProps {
  providers: Provider[];
  isDark: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ providers, isDark }) => {
  const analytics = useMemo(() => {
    const total = providers.length;
    const active = providers.filter((p) => p.is_active).length;
    const inactive = providers.filter((p) => !p.is_active).length;
    const verified = providers.filter((p) => p.verified).length;
    const unverified = providers.filter((p) => !p.verified).length;

    const gps = providers.filter((p) => p.profession === 'GP').length;
    const dentists = providers.filter((p) => p.profession === 'Dentist').length;

    const verificationRate = total > 0 ? Math.round((verified / total) * 100) : 0;
    const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;

    const cityCount: Record<string, number> = {};
    providers.forEach((p) => {
      if (p.city) {
        cityCount[p.city] = (cityCount[p.city] || 0) + 1;
      }
    });
    const topCities = Object.entries(cityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return {
      total,
      active,
      inactive,
      verified,
      unverified,
      gps,
      dentists,
      verificationRate,
      activeRate,
      topCities,
    };
  }, [providers]);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtext,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subtext?: string;
    color: 'green' | 'blue' | 'purple' | 'orange';
  }) => {
    const colorClasses = {
      green: isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200',
      blue: isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200',
      purple: isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200',
      orange: isDark ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200',
    };

    const iconColorClasses = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };

    return (
      <div className={`rounded-lg border p-6 transition-all hover:shadow-lg ${colorClasses[color]}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {label}
            </p>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {value}
            </p>
            {subtext && (
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {subtext}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
            <div className={`w-6 h-6 ${iconColorClasses[color]}`}>{Icon}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Providers"
          value={analytics.total}
          subtext={`${analytics.gps} GPs, ${analytics.dentists} Dentists`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Active Providers"
          value={analytics.active}
          subtext={`${analytics.activeRate}% of total`}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Verified"
          value={analytics.verified}
          subtext={`${analytics.verificationRate}% verified`}
          color="purple"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Inactive"
          value={analytics.inactive}
          subtext="Soft deleted"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`rounded-lg border p-6 ${
            isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Profession Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  General Practitioners (GP)
                </span>
                <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {analytics.gps}
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              >
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${analytics.total > 0 ? (analytics.gps / analytics.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dentists
                </span>
                <span className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {analytics.dentists}
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              >
                <div
                  className="h-full bg-purple-600 transition-all"
                  style={{
                    width: `${analytics.total > 0 ? (analytics.dentists / analytics.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg border p-6 ${
            isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Top Cities
          </h3>
          <div className="space-y-3">
            {analytics.topCities.length > 0 ? (
              analytics.topCities.map(([city, count], idx) => (
                <div key={city} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        idx === 0
                          ? 'bg-yellow-500'
                          : idx === 1
                            ? 'bg-gray-400'
                            : 'bg-orange-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{city}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isDark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No location data available
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg border p-6 ${
          isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Status Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              {analytics.activeRate}%
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Active Rate
            </p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {analytics.verificationRate}%
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Verified Rate
            </p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {analytics.unverified}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Unverified
            </p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              {analytics.inactive}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Inactive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
