import React, { useState, useEffect } from 'react';
import { X, Loader, Upload, Trash2 } from 'lucide-react';
import { Provider, FormData } from '../types';
import { validatePhone } from '../utils';
import { supabase } from '../supabaseClient';

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
    REGION: '',
    SUBURB: '',
    ADDRESS: '',
    'DOCTOR SURNAME': '',
    PRNO: '',
    TEL: '',
    FAX: '',
    'DISPENSE/SCRIPT': '',
    PROVINCE: '',
    profile_picture: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (provider) {
      setFormData(provider);
      if (provider.profile_picture) {
        setPreviewUrl(provider.profile_picture);
      }
    }
  }, [provider]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };
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

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile_picture: 'File size must be less than 1MB',
      }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        profile_picture: 'Please upload an image file',
      }));
      return;
    }

    try {
      setUploading(true);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profile_picture;
        return newErrors;
      });

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${formData.PRNO || 'provider'}-${timestamp}-${file.name}`;

      // Upload to Supabase bucket
      const { data, error: uploadError } = await supabase.storage
        .from('provider_profile_picture')
        .upload(filename, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('provider_profile_picture')
        .getPublicUrl(filename);

      const publicUrl = publicUrlData.publicUrl;
      console.log('Public URL:', publicUrl);

      // Update form data with the URL
      setFormData((prev) => {
        const updated = {
          ...prev,
          profile_picture: publicUrl,
        };
        console.log('Updated formData:', updated);
        return updated;
      });

      // Set preview
      setPreviewUrl(publicUrl);
      console.log('Preview URL set:', publicUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      console.error('Error uploading profile picture:', message, err);
      setErrors((prev) => ({
        ...prev,
        profile_picture: message,
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProfilePicture = () => {
    setFormData((prev) => ({
      ...prev,
      profile_picture: '',
    }));
    setPreviewUrl('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData['DOCTOR SURNAME']?.trim()) {
      newErrors['DOCTOR SURNAME'] = 'Doctor surname is required';
    }
    if (!formData.TEL?.trim()) {
      newErrors.TEL = 'Phone is required';
    } else if (!validatePhone(formData.TEL)) {
      newErrors.TEL = 'Invalid phone number';
    }
    if (!formData.SUBURB?.trim()) {
      newErrors.SUBURB = 'Suburb is required';
    }
    if (!formData.ADDRESS?.trim()) {
      newErrors.ADDRESS = 'Address is required';
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProfilePictureUpload(e);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
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

          {/* Profile Picture Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Picture
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Preview */}
              <div className="flex-shrink-0">
                <div className={`w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden ${
                  isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                }`}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Upload Image (Max 1MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  disabled={uploading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer ${inputClass}`}
                />
                {errors.profile_picture && <p className={errorClass}>{errors.profile_picture}</p>}
                
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveProfilePicture}
                    disabled={uploading}
                    className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 disabled:opacity-50'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Image
                  </button>
                )}
                
                {uploading && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Loader className="w-4 h-4 animate-spin text-green-600" />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Doctor Info Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Doctor Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Doctor Surname *
                </label>
                <input
                  type="text"
                  name="DOCTOR SURNAME"
                  value={formData['DOCTOR SURNAME'] || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors['DOCTOR SURNAME'] && <p className={errorClass}>{errors['DOCTOR SURNAME']}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  PRNO
                </label>
                <input
                  type="text"
                  name="PRNO"
                  value={formData.PRNO || ''}
                  onChange={handleChange}
                  placeholder="Practice Registration Number"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Dispense/Script
                </label>
                <input
                  type="text"
                  name="DISPENSE/SCRIPT"
                  value={formData['DISPENSE/SCRIPT'] || ''}
                  onChange={handleChange}
                  placeholder="e.g., Dispensing, Non-Dispensing"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Region Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Region
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Region
                </label>
                <input
                  type="text"
                  name="REGION"
                  value={formData.REGION || ''}
                  onChange={handleChange}
                  placeholder="e.g., Gauteng, Western Cape"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
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
                  Telephone *
                </label>
                <input
                  type="tel"
                  name="TEL"
                  value={formData.TEL || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors.TEL && <p className={errorClass}>{errors.TEL}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Fax
                </label>
                <input
                  type="tel"
                  name="FAX"
                  value={formData.FAX || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
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
                  Address *
                </label>
                <input
                  type="text"
                  name="ADDRESS"
                  value={formData.ADDRESS || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors.ADDRESS && <p className={errorClass}>{errors.ADDRESS}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Suburb *
                </label>
                <input
                  type="text"
                  name="SUBURB"
                  value={formData.SUBURB || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
                {errors.SUBURB && <p className={errorClass}>{errors.SUBURB}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
                  Province
                </label>
                <input
                  type="text"
                  name="PROVINCE"
                  value={formData.PROVINCE || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${inputClass}`}
                />
              </div>
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
