# Vercel Deployment Guide

This guide explains how to deploy the Cambridge application to Vercel at **cam-bridge.vercel.app**.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) (optional, for manual deployments)
3. GitHub repository connected to Vercel

## Automatic Deployment (Recommended)

The repository is configured for automatic deployment via GitHub Actions.

### Setup Steps

1. **Create a Vercel Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import the `SaltProphet/cambridge` repository
   - Set the project name to `cam-bridge` (this will deploy to cam-bridge.vercel.app)
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. **Configure GitHub Secrets**
   
   Add the following secrets to your GitHub repository settings (Settings → Secrets and variables → Actions):
   
   - `VERCEL_TOKEN`: Your Vercel API token
     - Get it from: https://vercel.com/account/tokens
     - Create a new token with full access
   
   - `VERCEL_ORG_ID`: Your Vercel organization/team ID
     - Get it from your Vercel project settings
     - Or run: `vercel project ls` after linking
   
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
     - Get it from your Vercel project settings
     - Or run: `vercel project ls` after linking

3. **Environment Variables**
   
   In your Vercel project settings, add these environment variables:
   - `NEXT_PUBLIC_APP_NAME`: `CamBridge`
   - `NEXT_PUBLIC_APP_URL`: `https://cam-bridge.vercel.app`

4. **Deploy**
   - Push to the `main` or `master` branch
   - GitHub Actions will automatically build and deploy to Vercel
   - Check the Actions tab for deployment status

## Manual Deployment via Vercel CLI

If you prefer manual deployment:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project directory
cd /path/to/cambridge

# Login to Vercel
vercel login

# Link to existing project or create new one
vercel link

# Deploy to production
vercel --prod
```

## Deployment Configuration

The deployment is configured via:

- **vercel.json**: Vercel platform configuration
- **.github/workflows/deploy.yml**: GitHub Actions workflow
- **.vercelignore**: Files to exclude from deployment

## Verifying Deployment

After deployment:

1. Visit https://cam-bridge.vercel.app
2. Check that all pages load correctly
3. Verify the application functions as expected

## Troubleshooting

### Build Fails

- Check the build logs in GitHub Actions or Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify the build works locally: `npm run build`

### Environment Variables Not Working

- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Check they're set in Vercel project settings
- Redeploy after adding/changing environment variables

### Domain Not Working

- Verify the project name in Vercel is set to `cam-bridge`
- Check DNS settings in Vercel domains section
- Custom domains may take time to propagate

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)

## Support

For issues with deployment, check:
1. GitHub Actions workflow logs
2. Vercel deployment logs
3. Repository issues page
