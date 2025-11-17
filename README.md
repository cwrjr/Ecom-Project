# 🛍️ Trellis E-commerce Platform

A modern, full-stack e-commerce web application built with React, TypeScript, and Express.js featuring AI-powered product recommendations, semantic search, and interactive 3D animations.

## ✨ Features

### Core E-commerce
- 🛒 Shopping cart with real-time updates
- 📦 Product catalog with advanced filtering and search
- ⭐ Product ratings and reviews with distribution charts
- ❤️ Wishlist/favorites functionality
- 🔐 User authentication (migration-ready for Firebase/Auth0/Supabase)
- 📱 Fully responsive mobile-first design

### AI-Powered Features (OpenAI Integration)
- 🤖 **Smart Chatbot** - GPT-4o powered customer support
- 🔍 **Semantic Search** - Natural language product search using embeddings
- 💡 **AI Recommendations** - Personalized product suggestions
- 📊 **Product Comparison** - Intelligent side-by-side analysis
- ✍️ **Auto SEO** - AI-generated meta titles and descriptions

### Interactive UI/UX
- 🎨 **Glassmorphism Design** - Modern, frosted glass aesthetic
- 🎭 **3D Animations** - Three.js powered shopping cart with physics
- ✨ **Particle Backgrounds** - Canvas API animated particles
- ⌨️ **Command Palette** - Global search with ⌘K/Ctrl+K
- 🔮 **Hover Cards** - Interactive product previews
- 🌓 **Dark Mode** - Full dark/light theme support

### Performance & Security
- ⚡ **14.6 MB Mobile Savings** - Smart video loading + lazy images
- 🔒 **Protected Routes** - Authentication middleware on sensitive endpoints
- 🛡️ **Server-side Validation** - Secure order processing
- 📈 **Optimized Caching** - TanStack Query with intelligent cache management

## 🚀 Quick Start (Replit)

Your app is currently configured to run on Replit with in-memory storage:

```bash
npm run dev
```

Visit the preview URL shown in the console.

## 📦 Migration to Local Development

**This app is migration-ready!** Follow these guides to move to Cursor IDE:

1. **Start here:** [`FINAL_MIGRATION_CHECKLIST.md`](./FINAL_MIGRATION_CHECKLIST.md) - Quick 30-60 minute guide
2. **Detailed instructions:** [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md) - Complete step-by-step walkthrough
3. **Security setup:** [`PRODUCTION_SECURITY.md`](./PRODUCTION_SECURITY.md) - Pre-production checklist
4. **Performance tips:** [`ASSET_OPTIMIZATION.md`](./ASSET_OPTIMIZATION.md) - Image/video compression

### What You'll Need

- **Database:** Supabase/Neon/Railway PostgreSQL (free tiers available)
- **Authentication:** Firebase/Auth0/Supabase (choose one)
- **AI Features:** OpenAI API key (requires credits)
- **Optional:** Stripe (payments), SendGrid (emails)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing
- **shadcn/ui** - Accessible component library
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics and WebGL

### Backend
- **Express.js** - Web application framework
- **TypeScript** - End-to-end type safety
- **Zod** - Runtime schema validation
- **In-memory Storage** - Development (migration-ready for PostgreSQL)
- **MemoryStore** - Session management (migration-ready for PostgreSQL sessions)

### AI & APIs
- **OpenAI** - GPT-4o and text-embedding-3-small models
- **Stripe** - Payment processing (optional)
- **SendGrid** - Email service (optional)

## 📁 Project Structure

```
trellis/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages (Home, Shop, ProductDetail, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express application
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data storage interface
│   ├── auth.ts            # Migration-ready auth module
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # TypeScript interfaces + Zod schemas
├── attached_assets/       # Images, videos, and media files
└── [migration guides]     # Documentation for moving to production
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Required
OPENAI_API_KEY=sk-...
SESSION_SECRET=your-random-secret
DATABASE_URL=postgresql://...

# Choose ONE auth provider
FIREBASE_PROJECT_ID=...
# OR
AUTH0_DOMAIN=...
# OR
SUPABASE_URL=...

# Optional
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
```

See `.env.example` for complete list with descriptions.

## 🎯 Key Optimizations

### Asset Performance
- **Smart Video Loading:** 12 MB video only loads on desktop (≥768px)
- **Lazy Loading:** All product images load on scroll
- **Deleted Duplicates:** Removed 2.6 MB of duplicate assets
- **Total Mobile Savings:** 14.6 MB (25 MB → 10.4 MB effective bundle)

### Security Hardening
- ✅ Fixed orders privacy breach (user-filtered queries)
- ✅ Added server-side userId validation
- ✅ Protected routes with authentication middleware
- ✅ Input validation with Zod schemas

## 📊 Recent Updates

**November 15, 2025:**
- ✅ Fixed all startup errors (ES module imports, missing dependencies)
- ✅ App now running successfully with all features
- ✅ Created comprehensive migration documentation

**November 12, 2025:**
- ✅ Security hardening completed
- ✅ Asset optimization implemented (14.6 MB mobile savings)
- ✅ Migration preparation finalized

See [`replit.md`](./replit.md) for complete changelog.

## 🧪 Testing

The application includes:
- Type-safe API contracts with Zod validation
- React Hook Form with client-side validation
- Error boundaries and loading states
- Responsive design testing (mobile/tablet/desktop)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a personal project prepared for migration to local development. For collaboration after migration, please reach out!

## 📞 Support

- **Migration Help:** See [`FINAL_MIGRATION_CHECKLIST.md`](./FINAL_MIGRATION_CHECKLIST.md)
- **Security Questions:** Review [`PRODUCTION_SECURITY.md`](./PRODUCTION_SECURITY.md)
- **Performance Issues:** Check [`ASSET_OPTIMIZATION.md`](./ASSET_OPTIMIZATION.md)

---

Built with ❤️ using modern web technologies and AI assistance.
