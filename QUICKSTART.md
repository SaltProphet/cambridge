# Quick Start: Deploy to cam-bridge.vercel.app NOW

This guide will get your Cambridge app deployed to **cam-bridge.vercel.app** as quickly as possible.

## Option 1: Automatic Deployment via GitHub (Recommended)

### Step 1: Create Vercel Project (2 minutes)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select the `SaltProphet/cambridge` repository
4. **IMPORTANT**: Set project name to `cam-bridge` (this determines your URL)
5. Click "Deploy"

### Step 2: Get Your Vercel Tokens (2 minutes)

After your first deployment:

1. **Get VERCEL_TOKEN**:
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Name it "GitHub Actions"
   - Copy the token (you won't see it again!)

2. **Get VERCEL_ORG_ID and VERCEL_PROJECT_ID**:
   - Go to your project settings: https://vercel.com/saltprophet/cam-bridge/settings
   - Scroll down to "Project ID" - copy it
   - Look for "Team ID" or run this command locally:
     ```bash
     npm i -g vercel
     vercel login
     cd /path/to/cambridge
     vercel link
     cat .vercel/project.json
     ```

### Step 3: Add GitHub Secrets (2 minutes)

1. Go to https://github.com/SaltProphet/cambridge/settings/secrets/actions
2. Click "New repository secret"
3. Add these three secrets:
   - `VERCEL_TOKEN`: (from step 2.1)
   - `VERCEL_ORG_ID`: (from step 2.2)
   - `VERCEL_PROJECT_ID`: (from step 2.2)

### Step 4: Deploy! (1 minute)

1. Merge your PR or push to main branch
2. GitHub Actions will automatically deploy
3. Visit https://cam-bridge.vercel.app

**Total time: ~7 minutes**

---

## Option 2: Manual Deployment via CLI (Fastest)

If you just want it deployed RIGHT NOW:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project
cd /path/to/cambridge

# Login to Vercel
vercel login

# Deploy to production
vercel --prod --name cam-bridge
```

When prompted:
- Link to existing project? → Choose "Create new project" 
- Project name? → Enter `cam-bridge`
- Which scope? → Choose your personal account
- Deploy? → Yes

**Total time: ~2 minutes**

---

## Option 3: Use Our Deploy Script

We've created a helper script:

```bash
cd /path/to/cambridge
./deploy.sh
```

Follow the prompts and you're done!

---

## Verifying Your Deployment

After deployment, verify:

1. ✅ https://cam-bridge.vercel.app loads
2. ✅ All pages are accessible
3. ✅ No console errors
4. ✅ Design looks correct

---

## Troubleshooting

### "Project name already taken"
- Someone else has `cam-bridge` - contact Vercel support or use a different name
- Alternative: `cam-bridge-app`, `cambridge-io`, etc.

### "Build failed"
- Check build logs in Vercel dashboard
- Verify `npm run build` works locally
- Check all dependencies are in package.json

### "GitHub Action failing"
- Verify all three secrets are set correctly
- Check GitHub Actions tab for error details
- Ensure you have the right permissions

### "Environment variables not working"
- Add them in Vercel project settings
- Prefix client-side vars with `NEXT_PUBLIC_`
- Redeploy after adding variables

---

## Need Help?

- **Detailed Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Vercel Docs**: https://vercel.com/docs
- **Issues**: https://github.com/SaltProphet/cambridge/issues

---

## What Gets Deployed?

When you deploy to Vercel:

- ✅ All pages and components
- ✅ Optimized production build
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant cache invalidation
- ✅ Environment variables
- ✅ Preview deployments for PRs

**Your app is production-ready!** 🚀
