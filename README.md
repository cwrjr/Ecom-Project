# 🛍️ Trellis E-commerce Platform

A premium, full-stack e-commerce experience designed for the modern web. Built with a focus on high-performance, rich aesthetics, and cutting-edge AI integrations.

## 🌟 Overview

Trellis is more than just a template; it's a sophisticated e-commerce engine that combines a sleek, glassmorphic UI with powerful backend capabilities. It features real-time 3D elements, intelligent product search using vector embeddings, and a dedicated admin suite for seamless catalog management.

## ✨ Core Features

### 🛍️ Experience
- **Fluid UI/UX:** Built with a "premium-first" design philosophy using Glassmorphism, smooth Framer Motion transitions, and responsive layouts.
- **3D Interactive Elements:** Integrated Three.js components, including an interactive 3D shopping cart.
- **Global Command Palette:** Instantly navigate or search products using `⌘K` or `Ctrl+K`.
- **Dynamic Theming:** Seamless dark and light mode support with modern color palettes.

### 🤖 AI-Powered Intelligence
- **Semantic Search:** Natural language search powered by OpenAI embeddings, understanding user intent beyond just keywords.
- **Smart Support Bot:** An integrated AI assistant ready to help users with product inquiries and site navigation.
- **Personalized Recommendations:** Vector-based similarity matching for intelligent "You might also like" suggestions.
- **Automated SEO:** AI-generated meta titles and descriptions for every product in the catalog.

### 🔐 Admin & Management
- **Full Product Lifecycle:** Dedicated admin dashboard to create, update, and delete products and categories.
- **Secure Authentication:** Robust user session management with Passport.js and secure password hashing.
- **Role-Based Access:** Protected routes ensuring only authorized administrators can modify the catalog.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Component-based UI architecture.
- **TypeScript** - For end-to-end type safety.
- **Tailwind CSS & shadcn/ui** - Highly customizable, accessible design system.
- **Framer Motion** - Production-grade animations.
- **TanStack Query** - Efficient server state and cache management.
- **Three.js** - Immersive 3D graphics.

### Backend
- **Node.js & Express.js** - Fast and minimalist server framework.
- **PostgreSQL** - Reliable relational database for production data.
- **Drizzle ORM** - Type-safe database interactions and migrations.
- **OpenAI API** - Powering search embeddings and the support chatbot.
- **Passport.js** - Flexible authentication middleware.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cwrjr/Ecom-Project.git
   cd Ecom-Mock-Website-Project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/trellis
   OPENAI_API_KEY=your_openai_key
   SESSION_SECRET=your_random_secret
   ```

4. **Initialize Database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🔐 Admin Access

The platform comes with a pre-configured admin account (via the seed script):
- **URL:** `/login`
- **Username:** `admin`
- **Password:** `admin123`

Once logged in, navigate to `/admin` to manage your store's inventory.

## 📁 Project Structure

```
trellis/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI primitives
│   │   ├── pages/       # Route-level components
│   │   ├── hooks/       # Custom business logic hooks
│   │   └── lib/         # API clients & utility functions
├── server/           # Express backend
│   ├── db.ts         # Database connection
│   ├── storage.ts    # Drizzle-powered data access layer
│   ├── auth.ts       # Authentication logic
│   └── routes.ts     # API endpoint definitions
├── shared/           # Cross-stack types & Zod schemas
└── attached_assets/  # Static media & optimized assets
```

## 📄 License

This project is licensed under the MIT License.

---

Built with precision and modern web standards.
