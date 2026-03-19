# Admin Panel - Doctor & Dentist Directory

## Overview

The admin panel is a dedicated internal tool for managing GP and Dentist directory listings. It's built as a separate module to keep the codebase organized and maintainable.

**Route:** `/admin`

## Features

### Core Functionality
- **View All Providers**: Display all providers (active and inactive) in a sortable table
- **Add Provider**: Create new GP or Dentist listings
- **Edit Provider**: Update existing provider information
- **Deactivate Provider**: Soft delete providers by setting `is_active = false`

### Data Management
- Full CRUD operations on the `providers` table in Supabase
- Respects Row-Level Security (RLS) policies
- Admin-only access (authentication required)

## Setup

### 1. Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project settings.

### 2. Supabase Table Structure

The `providers` table should have the following columns:

```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  profile_image_url TEXT,
  profession TEXT NOT NULL CHECK (profession IN ('GP', 'Dentist')),
  network_type TEXT,
  dispensing_status TEXT CHECK (dispensing_status IN ('Dispensing', 'Non-Dispensing')),
  practice_name TEXT,
  practice_code TEXT,
  description TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address_line_1 TEXT,
  suburb TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'South Africa',
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 3. Row-Level Security (RLS)

Set up RLS policies:

```sql
-- Public: Read-only active records
CREATE POLICY "public_read_active" ON providers
  FOR SELECT USING (is_active = true);

-- Admin: Full CRUD (requires authenticated user with admin role)
CREATE POLICY "admin_all" ON providers
  FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Install Dependencies

```bash
npm install
```

This installs `@supabase/supabase-js` which is required for the admin panel.

## File Structure

```
src/admin/
├── AdminPage.tsx           # Main admin page component
├── supabaseClient.ts       # Supabase client initialization
├── types.ts                # TypeScript interfaces
├── utils.ts                # Utility functions
├── components/
│   ├── ProviderTable.tsx   # Table display component
│   └── ProviderForm.tsx    # Add/Edit form component
└── README.md               # This file
```

## Component Details

### AdminPage.tsx
Main container component that:
- Fetches providers from Supabase
- Manages form modal state
- Handles CRUD operations
- Displays success/error alerts

### ProviderTable.tsx
Displays providers in a table with:
- Columns: Full Name, Profession, City, Province, Phone, Active, Verified
- Edit button for each row
- Deactivate button (only for active providers)
- Responsive design

### ProviderForm.tsx
Modal form for adding/editing providers with:
- Organized sections: Identity, Classification, Practice Info, Contact, Address, Admin Flags
- Auto-generated slug from full name
- Form validation
- Error messages
- Loading states

## Usage

### Accessing the Admin Panel

Navigate to `/admin` in your browser. The page requires authentication (ensure your Supabase auth is configured).

### Adding a Provider

1. Click "Add Provider" button
2. Fill in required fields (Full Name, Phone, Profession)
3. Fill in optional fields as needed
4. Click "Add Provider" to save

### Editing a Provider

1. Click the edit icon (✏️) on any provider row
2. Update the information
3. Click "Update Provider" to save

### Deactivating a Provider

1. Click the delete icon (🗑) on any active provider row
2. Confirm the deactivation
3. The provider will be marked as inactive but not deleted

## Styling

The admin panel matches Day1 Health's design system:
- Uses Tailwind CSS for styling
- Respects dark/light theme from ThemeContext
- Professional, clean medical aesthetic
- No flashy colors or SaaS-style UI
- Consistent with existing Day1 Health components

## Validation

Form validation includes:
- Required field checks
- Email format validation
- Phone number format validation
- Slug uniqueness (handled by Supabase)

## Error Handling

- Network errors are caught and displayed
- Validation errors show inline
- Success/error alerts appear at the top of the page
- Loading states prevent duplicate submissions

## Security Notes

- Admin page is protected by Supabase authentication
- RLS policies ensure only authenticated users can access
- Soft deletes preserve data integrity
- No hard deletes are performed

## Future Enhancements

- Bulk import/export functionality
- Advanced filtering and search
- Provider verification workflow
- Activity logging
- Batch operations
