# 🚀 Deployment Guide

This guide covers deploying your full-stack Express + React e-commerce app to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] Test `npm run build` locally
- [ ] Set up environment variables (`.env` file)
- [ ] Ensure `attached_assets` folder is included in deployment
- [ ] Test production build locally: `npm run build && npm start`

## 🎯 Recommended Platforms

### Option 1: Render (Recommended for Full-Stack Apps)

**Best for:** Full-stack monoliths, free tier available, easy setup

#### Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Manual Deploy" to upload code

3. **Configure Build Settings:**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=10000` (Render provides port via env)
   - `SESSION_SECRET=your-random-secret-here`
   - `OPENAI_API_KEY=sk-...` (if using AI features)
   - Add any other variables from your `.env`

5. **Deploy!**
   - Render will automatically build and deploy
   - Your app will be available at `your-app.onrender.com`

**Free Tier:** 750 hours/month, spins down after 15 min inactivity

---

### Option 2: Railway

**Best for:** Simple deployments, great developer experience

#### Steps:

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Empty Project"

3. **Add Service:**
   - Click "+ New" → "GitHub Repo"
   - Select your repository

4. **Configure:**
   - Railway auto-detects Node.js
   - Build command: `npm run build`
   - Start command: `npm start`
   - Port: Railway sets `PORT` automatically

5. **Add Environment Variables:**
   - Go to "Variables" tab
   - Add all variables from your `.env` file

6. **Deploy:**
   - Railway auto-deploys on git push
   - Get your URL from the service dashboard

**Free Tier:** $5 credit/month, pay-as-you-go after

---

### Option 3: Fly.io

**Best for:** Global distribution, Docker support

#### Steps:

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up and login:**
   ```bash
   fly auth signup
   fly auth login
   ```

3. **Create `fly.toml` in project root:**
   ```toml
   app = "your-app-name"
   primary_region = "iad"

   [build]
     builder = "paketobuildpacks/builder:base"

   [http_service]
     internal_port = 5000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0

   [[vm]]
     memory_mb = 512
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

5. **Set secrets:**
   ```bash
   fly secrets set SESSION_SECRET=your-secret
   fly secrets set OPENAI_API_KEY=sk-...
   ```

**Free Tier:** 3 shared-cpu VMs, 3GB persistent storage

---

### Option 4: Vercel (Frontend) + Railway/Render (Backend)

**Best for:** Maximum performance, separate scaling

#### Steps:

**Backend (Railway/Render):**
- Deploy Express server as above
- Get your API URL (e.g., `https://api.yourapp.com`)

**Frontend (Vercel):**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`
4. Add Environment Variable:
   - `VITE_API_URL=https://api.yourapp.com`
5. Update your frontend API calls to use `import.meta.env.VITE_API_URL`

**Note:** This requires separating your frontend and backend. You'll need to:
- Update API calls in your React app to use the backend URL
- Configure CORS on your Express server
- Handle authentication across domains

---

## 🔧 Platform-Specific Configuration

### Environment Variables

All platforms need these variables:

```bash
# Required
NODE_ENV=production
PORT=5000  # Most platforms set this automatically
SESSION_SECRET=your-random-32+character-secret

# Optional (if using features)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...  # If you add a database
STRIPE_SECRET_KEY=sk_...
SENDGRID_API_KEY=SG...
```

### Build Configuration

Your `package.json` already has the correct scripts:
```json
{
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js"
}
```

### Static Assets

Your `attached_assets` folder needs to be included. Most platforms include all files by default, but verify:
- ✅ `attached_assets/` is in your repository
- ✅ Not in `.gitignore`
- ✅ Server serves it at `/attached_assets` (already configured)

---

## 🐳 Docker Deployment (Optional)

If you want to use Docker, create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/attached_assets ./attached_assets

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"]
```

Then deploy to:
- **Railway** (supports Docker)
- **Fly.io** (Docker-native)
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**
- **Google Cloud Run**

---

## 🔍 Troubleshooting

### Build Fails

1. **Check Node version:** Most platforms use Node 18-20
2. **Verify build command:** `npm run build` should work locally first
3. **Check logs:** Platform build logs show specific errors

### App Crashes on Start

1. **Check PORT:** Ensure your app uses `process.env.PORT || 5000`
2. **Verify environment variables:** All required vars must be set
3. **Check static files:** Ensure `dist/public` exists after build

### Static Assets Not Loading

1. **Verify path:** `attached_assets` should be in project root
2. **Check server config:** `app.use('/attached_assets', express.static('attached_assets'))`
3. **File permissions:** Ensure files are readable

### Database Connection Issues

If you add a database later:
1. Use connection pooling
2. Set `DATABASE_URL` correctly
3. Enable SSL for production databases

---

## 📊 Performance Tips

1. **Enable Compression:**
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Set Cache Headers:**
   ```typescript
   app.use('/attached_assets', express.static('attached_assets', {
     maxAge: '1y',
     immutable: true
   }));
   ```

3. **Use CDN:** Consider Cloudflare or similar for static assets

4. **Monitor:** Use platform monitoring tools (Render, Railway have built-in)

---

## 🎯 Quick Start: Render (5 minutes)

1. Go to [render.com](https://render.com) → Sign up
2. New → Web Service → Connect GitHub
3. Select your repo
4. Settings:
   - Build: `npm run build`
   - Start: `npm start`
5. Environment → Add variables:
   - `NODE_ENV=production`
   - `SESSION_SECRET=...` (generate random)
   - `OPENAI_API_KEY=...` (if needed)
6. Deploy!

Your app will be live at `your-app.onrender.com` 🎉

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)
- [Vercel Docs](https://vercel.com/docs)

---

**Need help?** Check your platform's logs and error messages. Most deployment issues are environment variable or build configuration problems.

