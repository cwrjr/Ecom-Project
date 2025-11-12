import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

/**
 * MIGRATION-READY AUTH MODULE
 * 
 * This module replaces server/replitAuth.ts for local development.
 * 
 * TODO: Choose your authentication provider:
 * - Firebase Authentication (recommended for quick setup)
 * - Auth0 (recommended for enterprise features)
 * - Supabase Auth (if using Supabase for database)
 * 
 * FIREBASE SETUP:
 * 1. npm install firebase-admin
 * 2. Add environment variables:
 *    - FIREBASE_PROJECT_ID
 *    - FIREBASE_CLIENT_EMAIL
 *    - FIREBASE_PRIVATE_KEY
 * 3. Uncomment Firebase implementation below
 * 
 * AUTH0 SETUP:
 * 1. npm install express-openid-connect
 * 2. Add environment variables:
 *    - AUTH0_DOMAIN
 *    - AUTH0_CLIENT_ID
 *    - AUTH0_CLIENT_SECRET
 *    - AUTH0_BASE_URL (your app URL)
 * 3. Uncomment Auth0 implementation below
 * 
 * SUPABASE AUTH SETUP:
 * 1. npm install @supabase/supabase-js
 * 2. Add environment variables:
 *    - SUPABASE_URL
 *    - SUPABASE_ANON_KEY
 * 3. Uncomment Supabase implementation below
 */

// Session configuration (works with any auth provider)
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // TODO: Replace MemoryStore with persistent storage for production
  // Recommended: PostgreSQL sessions using connect-pg-simple
  // 
  // import { Pool } from '@neondatabase/serverless';
  // import connectPgSimple from 'connect-pg-simple';
  // const PgSession = connectPgSimple(session);
  // const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // 
  // const sessionStore = new PgSession({
  //   pool,
  //   tableName: 'user_sessions'
  // });
  
  // For now, using in-memory store (development only)
  const MemoryStore = require("memorystore")(session);
  const sessionStore = new MemoryStore({
    checkPeriod: sessionTtl,
  });
  
  return session({
    secret: process.env.SESSION_SECRET ?? "dev-secret-key-CHANGE-IN-PRODUCTION",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

// Helper function to sync auth provider user to your database
async function upsertUser(authProviderUser: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}) {
  await storage.upsertUser({
    id: authProviderUser.id,
    email: authProviderUser.email,
    firstName: authProviderUser.firstName ?? "",
    lastName: authProviderUser.lastName ?? "",
    profileImageUrl: authProviderUser.profileImageUrl,
  });
}

/**
 * Setup authentication middleware
 * 
 * IMPORTANT: Uncomment ONE of the implementations below based on your choice
 */
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  
  // ============================================================================
  // OPTION 1: FIREBASE AUTHENTICATION (Recommended)
  // ============================================================================
  
  // import admin from 'firebase-admin';
  // 
  // admin.initializeApp({
  //   credential: admin.credential.cert({
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  //   }),
  // });
  // 
  // // Verify Firebase ID token middleware
  // app.post("/api/auth/verify", async (req, res) => {
  //   const { idToken } = req.body;
  //   try {
  //     const decodedToken = await admin.auth().verifyIdToken(idToken);
  //     const user = await admin.auth().getUser(decodedToken.uid);
  //     
  //     // Sync to your database
  //     await upsertUser({
  //       id: user.uid,
  //       email: user.email!,
  //       firstName: user.displayName?.split(' ')[0],
  //       lastName: user.displayName?.split(' ').slice(1).join(' '),
  //       profileImageUrl: user.photoURL,
  //     });
  //     
  //     // Store in session
  //     req.session.userId = user.uid;
  //     res.json({ success: true, user: { id: user.uid, email: user.email } });
  //   } catch (error) {
  //     res.status(401).json({ error: "Invalid token" });
  //   }
  // });
  
  // ============================================================================
  // OPTION 2: AUTH0 (Enterprise-ready)
  // ============================================================================
  
  // import { auth } from 'express-openid-connect';
  // 
  // app.use(auth({
  //   authRequired: false,
  //   auth0Logout: true,
  //   secret: process.env.SESSION_SECRET,
  //   baseURL: process.env.AUTH0_BASE_URL,
  //   clientID: process.env.AUTH0_CLIENT_ID,
  //   issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  //   afterCallback: async (req, res, session) => {
  //     // Sync to your database
  //     await upsertUser({
  //       id: session.user.sub,
  //       email: session.user.email,
  //       firstName: session.user.given_name,
  //       lastName: session.user.family_name,
  //       profileImageUrl: session.user.picture,
  //     });
  //     return session;
  //   }
  // }));
  
  // ============================================================================
  // OPTION 3: SUPABASE AUTH (If using Supabase for database)
  // ============================================================================
  
  // import { createClient } from '@supabase/supabase-js';
  // 
  // const supabase = createClient(
  //   process.env.SUPABASE_URL!,
  //   process.env.SUPABASE_ANON_KEY!
  // );
  // 
  // app.post("/api/auth/supabase", async (req, res) => {
  //   const { accessToken } = req.body;
  //   try {
  //     const { data, error } = await supabase.auth.getUser(accessToken);
  //     if (error) throw error;
  //     
  //     // Sync to your database
  //     await upsertUser({
  //       id: data.user.id,
  //       email: data.user.email!,
  //       firstName: data.user.user_metadata?.first_name,
  //       lastName: data.user.user_metadata?.last_name,
  //       profileImageUrl: data.user.user_metadata?.avatar_url,
  //     });
  //     
  //     req.session.userId = data.user.id;
  //     res.json({ success: true, user: data.user });
  //   } catch (error) {
  //     res.status(401).json({ error: "Invalid token" });
  //   }
  // });
  
  // ============================================================================
  // TEMPORARY DEVELOPMENT ROUTES (Remove in production)
  // ============================================================================
  
  // Basic stub routes to prevent errors during migration
  app.get("/api/login", (req, res) => {
    res.status(501).json({ 
      error: "Authentication not configured. Please set up Firebase, Auth0, or Supabase auth in server/auth.ts" 
    });
  });
  
  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });
  
  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
  
  app.get("/api/user", (req, res) => {
    if (req.session.userId) {
      res.json({ userId: req.session.userId });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });
}

/**
 * Authentication middleware
 * Checks if user is authenticated before allowing access to protected routes
 * 
 * Usage:
 *   app.get("/api/protected-route", isAuthenticated, (req, res) => { ... });
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // TODO: Update based on your chosen auth provider
  
  // For session-based auth (Firebase, Auth0 with sessions)
  if (req.session?.userId) {
    return next();
  }
  
  // For token-based auth (you'll need to verify the token)
  // const token = req.headers.authorization?.split('Bearer ')[1];
  // if (token) {
  //   // Verify token with your auth provider
  //   // Set req.user if valid
  //   // return next();
  // }
  
  return res.status(401).json({ message: "Unauthorized - Please log in" });
};
