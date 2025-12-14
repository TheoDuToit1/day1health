import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { Provider, FormData } from '../types';
import { generateSlug, validateEmail, validatePhone } from '../utils';

interface ProviderFormProps {
  isDark: boolean;
  provider: Provider | null;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  loading: boolean;
}

const ProviderForm: React.FC<ProviderFormProps> = ({
  isDark,
  provider,
  onClose,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    slug: '',
    profile_image_url: '',
    profession: 'GP',
    network_type: '',
    dispensing_status: 'Non-Dispensing',
    practice_name: '',
    practice_code: '',
    description: '',
    phone: '',
    email: '',
    address_line_1: '',
    suburb: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'South Africa',
    is_active: true,
    verified: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (provider) {
      setFormData(provider);
    }
  }, [provider]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      // Auto-generate slug from full_name if not editing
      if (name === 'full_name' && !provider) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Remove id, created_at, updated_at from formData before sending
    const { id, created_at, updated_at, ...dataToSave } = formData as any;
    await onSave(dataToSave as FormData);
  };

  const bgClass = isDark ? 'bg-gray-800' : 'bg-white';
  const inputClass = isDark
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  const labelClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const errorClass = 'text-red-600 text-sm mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full max-w-2xl mx-4 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${bgClass}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X className={isDark ? 'text-gray-300' : 'text-gray-600'} />
        </button>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {provider ? 'Edit Provider' : 'Add Provider'}
          </h2>

          {/* Identity Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors.full_name && <p className={errorClass}>{errors.full_name}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors.slug && <p className={errorClass}>{errors.slug}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Profile Image URL
                </label>
                <input
                  type="url"
                  name="profile_image_url"
                  value={formData.profile_image_url || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Classification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Profession *
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                >
                  <option value="GP">GP</option>
                  <option value="Dentist">Dentist</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Network Type
                </label>
                <input
                  type="text"
                  name="network_type"
                  value={formData.network_type || ''}
                  onChange={handleChange}
                  placeholder="e.g., GP Network"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Dispensing Status
                </label>
                <select
                  name="dispensing_status"
                  value={formData.dispensing_status || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                >
                  <option value="Dispensing">Dispensing</option>
                  <option value="Non-Dispensing">Non-Dispensing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Practice Info Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Practice Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Practice Name
                </label>
                <input
                  type="text"
                  name="practice_name"
                  value={formData.practice_name || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Practice Code
                </label>
                <input
                  type="text"
                  name="practice_code"
                  value={formData.practice_code || ''}
                  onChange={handleChange}
                  placeholder="e.g., PR0537314"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address_line_1"
                  value={formData.address_line_1 || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Suburb
                </label>
                <input
                  type="text"
                  name="suburb"
                  value={formData.suburb || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Admin Flags Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Admin Flags
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className={labelClass}>Active</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className={labelClass}>Verified</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {provider ? 'Update' : 'Add'} Provider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderForm;
