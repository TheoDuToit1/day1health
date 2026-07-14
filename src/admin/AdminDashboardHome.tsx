import React from 'react';
import { ArrowRight, Building2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const AdminDashboardHome: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`border-b transition-colors duration-300 ${
        isDark ? 'border-gray-800 bg-gradient-to-r from-gray-800 to-gray-800/50' : 'border-gray-200 bg-gradient-to-r from-white to-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pr-32">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Choose which admin panel to open
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/admin/cms')}
            className={`rounded-3xl border p-8 text-left transition-all hover:-translate-y-1 hover:shadow-xl ${
              isDark
                ? 'border-gray-800 bg-gray-800/70 hover:border-green-700'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg">
              <FileText className="w-7 h-7" />
            </div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              CMS
            </h2>
            <p className={`mt-3 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Open the content management panel for website content updates.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-600">
              Open CMS
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/providers')}
            className={`rounded-3xl border p-8 text-left transition-all hover:-translate-y-1 hover:shadow-xl ${
              isDark
                ? 'border-gray-800 bg-gray-800/70 hover:border-green-700'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-lg">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Providers
            </h2>
            <p className={`mt-3 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Open provider directory analytics and provider management tools.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-600">
              Open Providers
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
