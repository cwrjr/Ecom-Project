# Production Security Checklist

## ✅ Completed Security Improvements

### Authentication & Authorization
- ✅ **Protected Routes**: Added `isAuthenticated` middleware to:
  - `POST /api/products` - Admin-only product creation
  - `POST /api/orders` - Order creation requires login
  - `GET /api/orders` - **CRITICAL FIX**: Now filters orders by user ID (was exposing all orders!)
  - `POST /api/products/:id/ratings` - Ratings require login
  - `POST /api/favorites` - Already protected
  - `DELETE /api/favorites/:productId` - Already protected

### Data Privacy
- ✅ **Orders Privacy Fix**: Changed `storage.getOrders()` to `storage.getUserOrders(userId)` 
  - **Before**: Any logged-in user could see ALL orders (severe breach!)
  - **After**: Users only see their own orders

### Session Management
- ✅ **Current Setup**: Using MemoryStore (development only)
- ⚠️ **Production Required**: PostgreSQL-backed sessions (see MIGRATION_GUIDE.md)

---

## 🚨 Critical Production TODOs

### 1. Session Secret (HIGH PRIORITY)
**Current Issue**: Hard-coded session secret in development
```typescript
// server/index.ts - Line ~40
secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production'
```

**Fix Required**:
```bash
# Generate a strong random secret:
openssl rand -base64 32

# Add to .env:
SESSION_SECRET=your-super-secret-random-string-here
```

**Why This Matters**: Without a strong secret, attackers can forge session cookies and impersonate users!

---

### 2. Rate Limiting (MEDIUM PRIORITY)
**Issue**: AI endpoints have NO rate limiting. Attackers could drain your OpenAI credits!

**Affected Routes**:
- `POST /api/ai/chat` - GPT-4o chatbot (expensive!)
- `POST /api/ai/semantic-search` - Embeddings + GPT search
- `POST /api/ai/product-recommendations` - Embeddings API
- `POST /api/ai/compare-products` - GPT-4o comparison

**Recommended Solution**:
```typescript
import rateLimit from 'express-rate-limit';

// AI endpoints: 10 requests per minute per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many AI requests, please try again later.'
});

app.post("/api/ai/*", aiLimiter, ...);
```

**Install package**:
```bash
npm install express-rate-limit
```

---

### 3. CSRF Protection (MEDIUM PRIORITY)
**Issue**: No CSRF tokens on state-changing endpoints

**Risk**: Attackers can trick logged-in users into making unwanted POST/DELETE requests

**Recommended Solution**:
```bash
npm install csurf
```

```typescript
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

// Apply to all state-changing routes
app.post("/api/*", csrfProtection, ...);
app.put("/api/*", csrfProtection, ...);
app.delete("/api/*", csrfProtection, ...);
```

---

### 4. Input Validation Enhancement (LOW PRIORITY)
**Current**: Using Zod schemas ✅
**Missing**: Sanitization for XSS attacks

**Example**:
```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize user input before storing
const sanitizedContent = DOMPurify.sanitize(userInput);
```

---

### 5. Error Handling & Logging (MEDIUM PRIORITY)
**Issue**: Generic error messages, no error tracking

**Production Requirements**:
1. **Never expose stack traces** to users
2. **Log errors** to a monitoring service (Sentry, LogRocket, etc.)
3. **Alert on critical failures**

**Recommended Setup**:
```bash
npm install @sentry/node
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });

// Error handler middleware
app.use((err, req, res, next) => {
  Sentry.captureException(err);
  res.status(500).json({ 
    error: "Internal server error",
    requestId: req.id // Never expose error details!
  });
});
```

---

### 6. HTTPS/TLS (HIGH PRIORITY)
**Development**: HTTP is fine ✅
**Production**: MUST use HTTPS

**Options**:
- **Firebase Hosting**: Automatic HTTPS
- **Vercel/Netlify**: Automatic HTTPS
- **Self-hosted**: Use Let's Encrypt (certbot)

---

### 7. Environment Variable Validation (LOW PRIORITY)
**Issue**: App might start with missing env vars

**Solution**:
```typescript
// server/config.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  NODE_ENV: z.enum(['development', 'production']),
});

export const config = envSchema.parse(process.env);
```

**Benefit**: App fails fast on startup instead of crashing randomly!

---

## 🔒 Production Deployment Checklist

### Before Going Live:
- [ ] Generate and set `SESSION_SECRET` (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Add rate limiting to AI endpoints
- [ ] Set up error monitoring (Sentry/LogRocket)
- [ ] Enable HTTPS/TLS
- [ ] Switch from MemoryStore to PostgreSQL sessions
- [ ] Review all error messages (no stack traces!)
- [ ] Add CSRF protection to state-changing routes
- [ ] Set up database backups
- [ ] Configure CORS properly (not `*` in production!)

### Optional but Recommended:
- [ ] Add request logging (Morgan + Winston)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure CDN for static assets (Cloudflare, Fastly)
- [ ] Add SQL injection prevention checks
- [ ] Set up automated security scanning (Snyk, Dependabot)
- [ ] Implement user role-based access control (admin vs. regular users)

---

## Current Security Posture: **Development Ready** ✅

**What's Working:**
- Authentication middleware on critical routes
- User data isolation (orders, favorites)
- Type-safe APIs with Zod validation
- Session-based authentication
- Input validation on all endpoints

**What's Missing (for production):**
- Strong session secret
- Rate limiting
- CSRF protection
- Error monitoring
- HTTPS enforcement

**Estimated Time to Production-Ready:** 4-6 hours

---

## Quick Production Setup (30 minutes)

If you need to deploy ASAP, here's the bare minimum:

```bash
# 1. Generate session secret
openssl rand -base64 32

# 2. Add to .env
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env
echo "NODE_ENV=production" >> .env

# 3. Install rate limiter
npm install express-rate-limit

# 4. Add to server/index.ts
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/ai/', limiter);

# 5. Set up Sentry (optional but recommended)
npm install @sentry/node
# Add SENTRY_DSN to .env
```

**That's it!** You'll have basic production security in place. Add the rest over time.

---

## Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Express Security Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **Helmet.js** (security headers): https://helmetjs.github.io/
- **Sentry** (error tracking): https://sentry.io/
- **Let's Encrypt** (free HTTPS): https://letsencrypt.org/
