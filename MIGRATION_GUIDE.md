# Trellis Migration Guide: Replit → Local Development

This guide walks you through migrating the Trellis e-commerce platform from Replit to local development (Cursor IDE) with production-ready authentication and database.

## ✅ Completed Migration Prep

The following changes have already been made to prepare for migration:

- ✅ Removed Replit-specific npm packages (`@replit/vite-plugin-cartographer`, `@replit/vite-plugin-runtime-error-modal`)
- ✅ Created migration-ready auth module (`server/auth.ts`) with Firebase/Auth0/Supabase templates
- ✅ Updated `server/routes.ts` to import from new auth module
- ✅ Documented platform-agnostic architecture in `replit.md`

## 📋 Prerequisites

Before starting the migration, ensure you have:

- [ ] Node.js 20+ installed locally
- [ ] Git installed
- [ ] Cursor IDE (or VS Code) installed
- [ ] Account created on your chosen services:
  - Firebase/Auth0 for authentication
  - Supabase/Neon/Railway for PostgreSQL database
  - OpenAI account with API credits (for AI features)

---

## 🚀 Migration Steps

### Step 1: Clone Repository to Local

```bash
# Download your code from Replit
# Option A: Use Replit's download feature
# Option B: If you have Git configured in Replit:
git clone <your-replit-git-url> trellis-local
cd trellis-local

# Install dependencies
npm install
```

### Step 2: Fix Vite Configuration

Update `vite.config.ts` to remove Replit plugin references:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],  // ← Simplified, removed Replit plugins
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
```

### Step 3: Set Up Authentication

Choose ONE authentication provider and follow the corresponding setup:

#### Option A: Firebase Authentication (Recommended for Quick Setup)

1. **Install Firebase Admin SDK:**
   ```bash
   npm install firebase-admin
   ```

2. **Create Firebase Project:**
   - Go to https://console.firebase.google.com/
   - Create a new project
   - Enable Authentication → Sign-in methods → Enable Email/Password, Google, etc.
   - Go to Project Settings → Service Accounts
   - Generate new private key (downloads JSON file)

3. **Add Environment Variables:**
   Create `.env` file in project root:
   ```env
   # Firebase
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   
   # Session
   SESSION_SECRET=your-random-secret-min-32-chars
   
   # Database (see Step 4)
   DATABASE_URL=postgresql://...
   
   # OpenAI (existing)
   OPENAI_API_KEY=sk-...
   
   # Stripe (optional)
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   
   # SendGrid (optional)
   SENDGRID_API_KEY=SG...
   ```

4. **Update `server/auth.ts`:**
   Uncomment the Firebase implementation section (lines ~100-120) in `server/auth.ts`

5. **Create Frontend Auth Component:**
   ```typescript
   // client/src/lib/firebase.ts
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   };

   export const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

   Add to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

#### Option B: Auth0 (Recommended for Enterprise)

1. **Install Auth0 SDK:**
   ```bash
   npm install express-openid-connect
   ```

2. **Create Auth0 Application:**
   - Go to https://auth0.com/ → Create account → Applications
   - Create "Regular Web Application"
   - Note: Domain, Client ID, Client Secret
   - Allowed Callback URLs: `http://localhost:5000/callback`
   - Allowed Logout URLs: `http://localhost:5000`

3. **Add Environment Variables:**
   ```env
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_BASE_URL=http://localhost:5000
   SESSION_SECRET=your-random-secret
   ```

4. **Update `server/auth.ts`:**
   Uncomment the Auth0 implementation section (lines ~125-145)

#### Option C: Supabase Auth (If Using Supabase Database)

1. **Install Supabase Client:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Get Supabase Credentials:**
   - Create project at https://supabase.com/
   - Go to Settings → API
   - Copy URL and anon/public key

3. **Add Environment Variables:**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   ```

4. **Update `server/auth.ts`:**
   Uncomment the Supabase implementation section (lines ~150-175)

### Step 4: Migrate from In-Memory Storage to PostgreSQL

#### Option A: Supabase (Recommended - Free Tier Available)

1. **Install Supabase Client:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Get Database URL:**
   - In Supabase dashboard → Settings → Database
   - Copy "Connection string" (URI format)
   - Add to `.env`:
     ```env
     DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
     ```

3. **Create PostgreSQL Storage Implementation:**
   Create `server/postgresStorage.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   import type { IStorage, Product, User, CartItem /* ... other types */ } from './storage';

   export class PostgresStorage implements IStorage {
     private supabase;

     constructor(supabaseUrl: string, supabaseKey: string) {
       this.supabase = createClient(supabaseUrl, supabaseKey);
     }

     // Implement all IStorage methods using Supabase client
     async getProducts(): Promise<Product[]> {
       const { data, error } = await this.supabase.from('products').select('*');
       if (error) throw error;
       return data;
     }

     // ... implement remaining methods
   }
   ```

4. **Create Database Tables:**
   Use the Supabase SQL editor to create tables based on your schema in `shared/schema.ts`:
   ```sql
   -- Example: Products table
   CREATE TABLE products (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10, 2) NOT NULL,
     category_id INTEGER,
     image_url TEXT,
     stock INTEGER DEFAULT 0,
     is_featured BOOLEAN DEFAULT false
   );

   -- Create indexes
   CREATE INDEX idx_products_category ON products(category_id);
   
   -- Repeat for all entities in shared/schema.ts
   ```

5. **Update `server/storage.ts`:**
   ```typescript
   import { PostgresStorage } from './postgresStorage';

   // Replace MemStorage with PostgresStorage
   export const storage: IStorage = new PostgresStorage(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_ANON_KEY!
   );
   ```

#### Option B: Neon (Serverless PostgreSQL)

1. **Install Neon Serverless:**
   ```bash
   npm install @neondatabase/serverless  # Already installed
   ```

2. **Create Neon Database:**
   - Go to https://neon.tech/ → Create project
   - Copy connection string
   - Add to `.env`:
     ```env
     DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb
     ```

3. **Use Drizzle ORM (Already Configured):**
   - Update `server/db/schema.ts` if needed
   - Run migrations:
     ```bash
     npm run db:push
     ```

4. **Create Drizzle-based Storage:**
   ```typescript
   // server/drizzleStorage.ts
   import { drizzle } from 'drizzle-orm/neon-serverless';
   import { Pool } from '@neondatabase/serverless';
   import * as schema from './db/schema';

   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   const db = drizzle(pool, { schema });

   export class DrizzleStorage implements IStorage {
     // Implement using Drizzle queries
     async getProducts() {
       return await db.select().from(schema.products);
     }
     // ...
   }
   ```

### Step 5: Update Session Storage for Production

Replace in-memory sessions with PostgreSQL sessions:

1. **Install PostgreSQL Session Store:**
   ```bash
   npm install connect-pg-simple  # Already installed
   ```

2. **Update `server/auth.ts` → `getSession()`:**
   Uncomment the PostgreSQL session store implementation:
   ```typescript
   import { Pool } from '@neondatabase/serverless';
   import connectPgSimple from 'connect-pg-simple';

   export function getSession() {
     const PgSession = connectPgSimple(session);
     const pool = new Pool({ connectionString: process.env.DATABASE_URL });

     return session({
       store: new PgSession({
         pool,
         tableName: 'user_sessions',
         createTableIfMissing: true
       }),
       secret: process.env.SESSION_SECRET!,
       resave: false,
       saveUninitialized: false,
       cookie: {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 7 * 24 * 60 * 60 * 1000
       }
     });
   }
   ```

### Step 6: Test Locally

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Verify:**
   - ✅ App loads at http://localhost:5000
   - ✅ Authentication works (sign up, login, logout)
   - ✅ Database operations work (create/read products, cart, orders)
   - ✅ Sessions persist across server restarts
   - ✅ AI features work (if OpenAI credits available)

3. **Run Tests:**
   ```bash
   npm run check  # TypeScript type checking
   ```

### Step 7: Production Deployment

#### Option A: Vercel (Recommended for Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env`

#### Option B: Railway (Recommended for Full-Stack Apps)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variables:**
   ```bash
   railway variables set DATABASE_URL=postgresql://...
   railway variables set FIREBASE_PROJECT_ID=...
   # ... etc
   ```

#### Option C: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build command: `npm run build`
3. Configure start command: `npm start`
4. Add environment variables in dashboard

---

## 🔧 Troubleshooting

### Issue: TypeScript errors in `vite.config.ts`

**Solution:** Ensure you've removed the Replit plugin imports (see Step 2)

### Issue: "Cannot find module '@replit/...'"

**Solution:** Run `npm install` to ensure Replit packages are removed

### Issue: Authentication not working locally

**Solution:** 
- Verify environment variables are set in `.env`
- Check callback URLs match your localhost
- Ensure `SESSION_SECRET` is set

### Issue: Database connection fails

**Solution:**
- Verify `DATABASE_URL` is correct
- Check firewall rules allow your IP
- Ensure database tables are created

### Issue: OpenAI API quota exceeded

**Solution:**
- Add credits to OpenAI account
- Or disable AI features temporarily by commenting out OpenAI routes in `server/routes.ts`

---

## 📦 Files Modified During Migration

| File | Status | Notes |
|------|--------|-------|
| `package.json` | ✅ Modified | Replit packages removed |
| `vite.config.ts` | ⚠️ Needs Update | Remove Replit plugins (see Step 2) |
| `server/auth.ts` | ✅ Created | Migration-ready auth module |
| `server/routes.ts` | ✅ Modified | Now imports from `./auth` |
| `server/storage.ts` | ⚠️ Needs Update | Replace MemStorage with DB (Step 4) |
| `replit.md` | ✅ Updated | Reflects migration status |
| `.env` | ⚠️ Must Create | Add all environment variables |

---

## ✅ Migration Checklist

- [ ] Step 1: Clone repository to local machine
- [ ] Step 2: Fix `vite.config.ts`
- [ ] Step 3: Choose and configure authentication provider
- [ ] Step 4: Set up PostgreSQL database and migrate storage
- [ ] Step 5: Configure PostgreSQL session store
- [ ] Step 6: Test authentication flow locally
- [ ] Step 7: Test database CRUD operations
- [ ] Step 8: Verify AI features work (if needed)
- [ ] Step 9: Test production build locally (`npm run build && npm start`)
- [ ] Step 10: Deploy to production platform
- [ ] Step 11: Configure production environment variables
- [ ] Step 12: Test production deployment end-to-end

---

## 🎉 Post-Migration

Once migration is complete:

1. **Remove Legacy Files:**
   ```bash
   rm server/replitAuth.ts  # No longer needed
   rm KNOWLEDGE_BASE.md     # Optional cleanup
   ```

2. **Update Documentation:**
   - Update README.md with new setup instructions
   - Document your chosen auth provider
   - Document database schema

3. **Version Control:**
   ```bash
   git add .
   git commit -m "Complete migration from Replit to local development"
   git push origin main
   ```

---

## 📞 Support Resources

- **Firebase Docs:** https://firebase.google.com/docs/auth
- **Auth0 Docs:** https://auth0.com/docs/quickstarts/webapp/express
- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **Neon Docs:** https://neon.tech/docs/introduction
- **Drizzle ORM:** https://orm.drizzle.team/docs/overview

---

**Migration prepared on:** November 12, 2025
**Current status:** ✅ Ready for migration - All Replit dependencies removed
