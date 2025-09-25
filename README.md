# BD Team Agent - Secure Authentication System

A production-ready Next.js application with Microsoft 365 (Azure AD) authentication and Supabase database integration.

## Features

- 🔐 **Microsoft 365 Authentication** - Users can only log in with their Microsoft 365 accounts
- 🛡️ **JWT Session Management** - Secure HTTP-only cookies for session handling
- 🗄️ **Supabase Database** - User data storage with approval workflow
- 🚫 **Route Protection** - Middleware-based protection for dashboard routes
- ✅ **Admin Approval System** - Users must be approved before accessing the dashboard
- 🔄 **Persistent Approval Status** - Once approved, users remain approved

## Tech Stack

- **Frontend**: Next.js 15.5.4 with App Router, TypeScript, Tailwind CSS
- **Authentication**: Microsoft Identity Platform (Azure AD) with MSAL
- **Database**: Supabase (PostgreSQL)
- **Session Management**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS v4

## Prerequisites

1. **Microsoft Azure AD App Registration**
2. **Supabase Project**
3. **Node.js 18+**

## Setup Instructions

### 1. Microsoft Azure AD Configuration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: BD Team Agent
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: `http://localhost:3000/api/auth/callback` (for development)
5. After creation, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**
6. Go to **Certificates & secrets** > **New client secret**
7. Copy the **Value** (not the Secret ID)
8. Go to **API permissions** > **Add a permission** > **Microsoft Graph** > **Delegated permissions**
9. Add **User.Read** permission
10. Click **Grant admin consent**

### 2. Supabase Configuration

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to **Settings** > **API**
3. Copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (from Service Role section)
4. Go to **SQL Editor** and run the schema from `supabase-schema.sql`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Microsoft Azure AD Configuration
NEXT_PUBLIC_AZURE_CLIENT_ID=your_azure_client_id_here
AZURE_CLIENT_SECRET=your_azure_client_secret_here
AZURE_TENANT_ID=your_azure_tenant_id_here
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
```

### 4. Installation and Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Database Schema

The application uses a single `users` table with the following structure:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  microsoft_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

## Application Flow

1. **User visits the app** → Redirected to `/login`
2. **User clicks "Sign in with Microsoft"** → Azure AD OAuth flow
3. **After successful authentication** → User data sent to `/api/auth/callback`
4. **Backend verifies Microsoft token** → Gets user info from Microsoft Graph
5. **User data stored/updated in Supabase** → JWT token generated
6. **JWT stored in HTTP-only cookie** → User redirected based on approval status
7. **If approved** → Redirected to `/dashboard`
8. **If not approved** → Redirected to `/pending-approval`

## Route Protection

- **`/`** → Redirects to `/login`
- **`/login`** → Public access
- **`/dashboard`** → Requires authentication + approval
- **`/pending-approval`** → Requires authentication but not approval
- **`/api/auth/*`** → Public API endpoints

## Admin Approval Process

1. New users are created with `is_approved = false`
2. Users see a pending approval page
3. Admin can update `is_approved = true` in Supabase
4. Once approved, users remain approved (persistent status)
5. Users can then access the dashboard

## API Endpoints

- **`POST /api/auth/callback`** - Handles Microsoft OAuth callback
- **`POST /api/auth/logout`** - Logs out user and clears session
- **`GET /api/auth/me`** - Returns current user information

## Security Features

- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only cookies (not accessible via JavaScript)
- ✅ Secure cookie settings for production
- ✅ Microsoft token verification on backend
- ✅ Row Level Security (RLS) in Supabase
- ✅ Middleware-based route protection
- ✅ CSRF protection via SameSite cookies

## File Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── callback/route.ts    # Microsoft OAuth callback
│   │   ├── logout/route.ts      # Logout endpoint
│   │   └── me/route.ts          # User info endpoint
│   ├── dashboard/page.tsx       # Protected dashboard
│   ├── login/page.tsx           # Login page
│   ├── pending-approval/page.tsx # Pending approval page
│   ├── layout.tsx               # Root layout with MSAL provider
│   └── page.tsx                 # Home page (redirects to login)
├── components/
│   └── MSALProvider.tsx         # MSAL provider wrapper
├── lib/
│   ├── auth.ts                  # JWT utilities
│   ├── msal-config.ts           # MSAL configuration
│   └── supabase.ts              # Supabase client
└── middleware.ts                # Route protection middleware
```

## Production Deployment

1. Update Azure AD redirect URI to production URL
2. Set `NODE_ENV=production` in environment variables
3. Use secure JWT secret (32+ characters)
4. Configure proper CORS settings
5. Set up SSL/TLS certificates
6. Update Supabase RLS policies as needed

## Troubleshooting

### Common Issues

1. **"Invalid client" error**: Check Azure AD client ID and tenant ID
2. **"Redirect URI mismatch"**: Ensure redirect URI matches exactly in Azure AD
3. **"User not found"**: Check Supabase connection and table schema
4. **"JWT verification failed"**: Verify JWT_SECRET is set correctly

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
```

## License

This project is licensed under the MIT License.