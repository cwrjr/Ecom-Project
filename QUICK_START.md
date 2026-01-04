# 🚀 Quick Start Guide - macOS

This guide provides step-by-step commands to run your e-commerce app locally on macOS.

## ✅ What's Fixed

- ✅ Server defaults to `127.0.0.1:3000` (macOS-safe)
- ✅ OpenAI API key validation and logging
- ✅ Automatic build before production start
- ✅ Clear debug logging for host/port
- ✅ Environment variables properly configured

## 📋 Prerequisites

1. **Node.js** installed (v18 or higher)
2. **OpenAI API Key** (get one at https://platform.openai.com/api-keys)

## 🎯 Quick Commands

### Option 1: Development Mode (Recommended for Development)

**With hot-reloading and Vite dev server:**

```bash
cd /Users/cwtjr/Documents/Ecom/Ecom-Mock-Website-Project
OPENAI_API_KEY="sk-your-key-here" npm run dev
```

**What this does:**
- ✅ Runs in development mode with hot-reloading
- ✅ Uses `127.0.0.1:3000` automatically
- ✅ No build step needed
- ✅ Fast refresh on code changes

**Then open:** http://127.0.0.1:3000

---

### Option 2: Production Mode (For Testing Production Build)

**Single command that builds and starts:**

```bash
cd /Users/cwtjr/Documents/Ecom/Ecom-Mock-Website-Project
OPENAI_API_KEY="sk-your-key-here" npm run start:prod
```

**What this does:**
- ✅ Builds the frontend (Vite)
- ✅ Bundles the backend (esbuild)
- ✅ Starts production server on `127.0.0.1:3000`

**Then open:** http://127.0.0.1:3000

---

### Option 3: Manual Build + Start (If You Need More Control)

**Step 1: Build the project**
```bash
cd /Users/cwtjr/Documents/Ecom/Ecom-Mock-Website-Project
npm run build
```

**Step 2: Start the server**
```bash
OPENAI_API_KEY="sk-your-key-here" npm start
```

---

## 🔧 Using Environment Variables

### Method 1: Inline (Temporary)
```bash
OPENAI_API_KEY="sk-..." npm run dev
```

### Method 2: .env File (Persistent)

1. Create `.env` file in project root:
```bash
cd /Users/cwtjr/Documents/Ecom/Ecom-Mock-Website-Project
cat > .env << EOF
OPENAI_API_KEY=sk-your-key-here
HOST=127.0.0.1
PORT=3000
EOF
```

2. Then just run:
```bash
npm run dev
```

**Note:** Make sure `.env` is in `.gitignore` (it already is!)

---

## 📊 What You'll See

When the server starts, you'll see:

```
✅ OPENAI_API_KEY is set
Configuration:
  HOST: 127.0.0.1 (default for macOS)
  PORT: 3000 (default)
  NODE_ENV: development
🚀 Server running at http://127.0.0.1:3000
📱 Open http://127.0.0.1:3000 in your browser
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is taken, use a different port:

```bash
PORT=3001 OPENAI_API_KEY="sk-..." npm run dev
```

### OpenAI Key Not Working

1. Verify your key at https://platform.openai.com/api-keys
2. Make sure you have credits in your OpenAI account
3. Check the server logs for API errors

### Build Errors

If `npm run build` fails:
1. Make sure all dependencies are installed: `npm install`
2. Check TypeScript errors: `npm run check`
3. Verify Node.js version: `node --version` (should be 18+)

### Still Getting ENOTSUP Error?

The server now defaults to `127.0.0.1` which should work on macOS. If you still see errors:
1. Make sure you've rebuilt: `npm run build`
2. Check you're using the latest code
3. Try explicitly: `HOST=127.0.0.1 PORT=3000 npm start`

---

## 📝 Available Scripts

- `npm run dev` - Development mode with hot-reloading
- `npm run build` - Build frontend + backend
- `npm start` - Start production server (requires build first)
- `npm run start:prod` - Build + start in one command
- `npm run check` - Type check TypeScript

---

## 🎉 Success!

Once running, you should see:
- ✅ Server logs showing `127.0.0.1:3000`
- ✅ No ENOTSUP errors
- ✅ App accessible at http://127.0.0.1:3000
- ✅ OpenAI API key validated

---

## 💡 Pro Tips

1. **Use `.env` file** for persistent configuration
2. **Development mode** (`npm run dev`) is faster for coding
3. **Production mode** (`npm run start:prod`) tests the real build
4. **Check logs** - they show exactly what host/port is being used

---

**Need help?** Check the server logs - they now show detailed configuration information!

