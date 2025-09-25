# GitHub Pages Deployment Guide

This guide will help you deploy your Next.js application to GitHub Pages.

## Prerequisites

1. A GitHub repository
2. Your application configured for static export
3. Environment variables set up

## Setup Steps

### 1. Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. This will enable GitHub Actions to deploy your site

### 2. Set Up Environment Variables

You need to add the following secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each of the following:

#### Required Secrets:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_MSAL_CLIENT_ID`: Your Azure AD application client ID
- `NEXT_PUBLIC_MSAL_AUTHORITY`: Your Azure AD tenant authority URL
- `NEXT_PUBLIC_MSAL_REDIRECT_URI`: Your GitHub Pages URL (e.g., `https://yourusername.github.io/your-repo-name`)

### 3. Update Azure AD Configuration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Find your application and go to **Authentication**
4. Add your GitHub Pages URL to the **Redirect URIs**:
   - `https://yourusername.github.io/your-repo-name`
   - `https://yourusername.github.io/your-repo-name/`

### 4. Deploy

The deployment will happen automatically when you push to the `main` branch. The GitHub Actions workflow will:

1. Install dependencies
2. Build the application
3. Deploy to GitHub Pages

## Manual Deployment

If you want to deploy manually:

```bash
# Build the application
npm run build

# The static files will be in the 'out' directory
# You can then deploy these files to any static hosting service
```

## Important Notes

### Static Export Limitations

Since GitHub Pages only supports static sites, the following features are **NOT available**:

- **API Routes**: All `/api/*` routes are disabled
- **Server-side rendering (SSR)**: Pages are pre-rendered at build time
- **Server-side features**: No server-side database operations

### Workarounds for API Routes

If you need API functionality, consider:

1. **External API services**: Use services like Vercel, Netlify Functions, or AWS Lambda
2. **Client-side only**: Move logic to the client side
3. **Third-party services**: Use services like Supabase Edge Functions

### Environment Variables

- Only `NEXT_PUBLIC_*` variables are available in the browser
- Server-side environment variables are not available in static export
- Update your `env.template` file with your actual values

## Troubleshooting

### Common Issues

1. **404 errors on refresh**: This is normal for client-side routing. GitHub Pages doesn't support server-side routing.

2. **Authentication not working**: Make sure your redirect URIs are correctly configured in Azure AD.

3. **Build failures**: Check that all environment variables are properly set in GitHub Secrets.

4. **Images not loading**: Images are unoptimized in static export. Consider using a CDN for better performance.

### Checking Deployment Status

1. Go to the **Actions** tab in your GitHub repository
2. Look for the "Deploy to GitHub Pages" workflow
3. Check the logs for any errors

## Local Development

For local development, create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_local_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_supabase_key
NEXT_PUBLIC_MSAL_CLIENT_ID=your_azure_client_id
NEXT_PUBLIC_MSAL_AUTHORITY=https://login.microsoftonline.com/your_tenant_id
NEXT_PUBLIC_MSAL_REDIRECT_URI=http://localhost:3000
```

Then run:
```bash
npm run dev
```

## Production Considerations

1. **Performance**: Static export provides excellent performance
2. **SEO**: Pre-rendered pages are better for SEO
3. **Cost**: GitHub Pages is free for public repositories
4. **Custom Domain**: You can add a custom domain in the Pages settings

## Next Steps

After successful deployment:

1. Test all functionality on the live site
2. Set up monitoring and analytics
3. Consider adding a custom domain
4. Set up automated testing in your CI/CD pipeline
