# Deployment Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it: `piano-chords-api` (or your preferred name)
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

2. **Push your code to GitHub**
   Run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/piano-chords-api.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI

1. **Sign in to Netlify**
   - Go to https://app.netlify.com
   - Sign in with GitHub

2. **Import your repository**
   - Click "Add new site" > "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `piano-chords-api` repository

3. **Configure build settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `20`

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

## Important Notes

- The project is configured with `output: 'export'` in `next.config.js` for static export
- Images are set to `unoptimized: true` for static hosting
- The `netlify.toml` file is already configured with the correct build settings

## Troubleshooting

If the build fails:
1. Check that Node.js version is 20+ in Netlify build settings
2. Ensure all dependencies are in `package.json`
3. Check Netlify build logs for specific errors

