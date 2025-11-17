# DevPortfolio E-commerce Platform

## Overview

This is a full-stack e-commerce web application built with a modern tech stack featuring React frontend and Express.js backend with in-memory storage. The application serves as both a professional developer portfolio and a functional e-commerce platform with advanced features like product management, shopping cart, user authentication, and ratings system.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js with TypeScript running on Node.js
- **Storage**: In-memory storage with MemoryStore session management (ready for database integration)
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Authentication**: Migration-ready auth module (supports Firebase, Auth0, or Supabase)
- **Build System**: Vite for frontend, esbuild for backend production builds

## Key Components

### Frontend Architecture
- **React SPA** with modern hooks and context API
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **State Management**: React Query for server state, Context API for client state
- **Routing**: wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system and glassmorphism effects

### Backend Architecture
- **REST API** built with Express.js
- **Storage Layer**: In-memory MemStorage implementation with full IStorage interface
- **Authentication**: Session-based auth with MemoryStore session management
- **File Serving**: Static asset serving for images and media

### Data Schema
The application uses a comprehensive type-safe schema with the following main entities:
- **Products**: Core product information with categories, pricing, and inventory
- **Users**: User profiles and authentication data
- **Cart Items**: Shopping cart functionality with session-based persistence
- **Orders**: Order management and tracking
- **Ratings**: Product review and rating system
- **Favorites**: User wishlist functionality
- **Categories**: Product categorization system

*Note: Data is stored in-memory and will reset on server restart. Ready for database integration when needed.*

### UI/UX Features
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Advanced Search**: Multi-criteria filtering and sorting
- **Product Comparison**: Side-by-side product comparison tool
- **Quick View**: Modal-based product previews
- **Shopping Cart**: Real-time cart updates with quantity management
- **3D Animations**: Three.js powered 3D shopping cart with roll-in, hover, and scroll effects
- **Canvas Animations**: Particle background effects using Canvas API
- **Command Palette**: Global search with ⌘K/Ctrl+K keyboard shortcut

## Data Flow

1. **Client Requests**: React components make API calls using React Query
2. **API Layer**: Express.js routes handle HTTP requests and validation
3. **Business Logic**: Server-side processing with type-safe operations
4. **Storage Operations**: MemStorage executes in-memory CRUD operations
5. **Response Handling**: JSON responses with proper error handling
6. **State Updates**: React Query manages cache invalidation and UI updates

## External Dependencies

### Core Framework Dependencies
- **React 18**: Modern React with concurrent features
- **Express.js**: Web application framework for Node.js
- **Zod**: Schema validation for type-safe data operations

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Fast build tool and development server
- **esbuild**: Fast JavaScript bundler for production

### Additional Features
- **Stripe**: Payment processing integration (configured but not fully implemented)
- **SendGrid**: Email service integration
- **React Hook Form**: Form handling with validation
- **Three.js**: WebGL-powered 3D graphics and animations
- **Recharts**: Data visualization for rating distributions
- **Framer Motion**: Advanced animations and transitions

## Deployment Strategy

The application is platform-agnostic and ready for local development and production deployment:

### Development Environment
- **Dev Server**: `npm run dev` starts both frontend and backend in development mode
- **Hot Reload**: Vite provides instant updates during development
- **TypeScript Checking**: Continuous type checking with `tsc`
- **Local Development**: Works seamlessly in any IDE (VS Code, Cursor, WebStorm, etc.)

### Production Build
- **Frontend Build**: Vite builds optimized React application
- **Backend Bundle**: esbuild creates production server bundle
- **Asset Optimization**: Static assets are properly served and cached
- **Environment Configuration**: Supports both development and production modes

### Storage Management
- **Migration-Ready**: Storage interface abstraction allows easy database integration
- **Current State**: In-memory MemStorage implementation (development)
- **Production Options**: Supabase, PostgreSQL, MySQL, or any SQL database
- **Session Management**: MemoryStore (development) - ready for PostgreSQL sessions in production
- **Data Initialization**: Pre-loaded sample products, categories, and reviews

## Recent Improvements

### Architecture Refactoring (October 2025)
- **Database Removal**: Converted from PostgreSQL to in-memory storage for simplified deployment
- **Type-Safe Schema**: Plain TypeScript interfaces with Zod validation (removed Drizzle ORM)
- **Session Storage**: Switched from PostgreSQL sessions to MemoryStore
- **Performance Focus**: Removed database overhead for faster response times

### Newsletter Signup (October 2025)
- **Newsletter Modal**: Auto-triggered modal after 8 seconds on homepage
- **LocalStorage Persistence**: Shows only once per user
- **Email Collection**: Form validation with toast notifications
- **Responsive Design**: Mobile-friendly dialog with Radix UI

### Mobile Menu Enhancements (October 2025)
- **Smooth Animations**: Implemented Framer Motion for slide-down effects
- **Staggered Menu Items**: Each navigation link animates with cascading delay
- **Auto-close on Navigation**: Menu automatically closes after link click or search
- **Dark Mode Support**: Full dark mode support in mobile menu

### SEO Implementation (October 2025)
- **react-helmet-async**: Integrated for dynamic meta tags
- **Page-specific SEO**: Unique titles and descriptions for all pages
- **Open Graph Tags**: Social media sharing optimization
- **Product-specific Meta**: Dynamic SEO for individual product pages

### Performance Optimizations (October 2025)
- **Resource Preloading**: DNS prefetch, preconnect, and preload hints for Google Fonts
- **React Query Caching**: Optimized staleTime (5min) and gcTime (10min) for better performance
- **Lazy Loading**: Native browser lazy loading for all product images
- **Loading States**: Skeleton screens for Shop and ProductDetail pages
- **Stock Indicators**: Real-time inventory badges with "Out of Stock" handling
- **Disabled States**: Non-functional buttons when products unavailable

### AI Features (October 2025)
- **AI Product Recommendations**: Semantic similarity-based product suggestions using OpenAI embeddings (text-embedding-3-small)
- **Semantic AI Search**: Natural language search with vector embeddings and cosine similarity
- **Smart Support Chatbot**: GPT-4o powered customer support with knowledge base about shipping, returns, and policies
- **AI-Powered Product Comparison**: Intelligent product comparison with pros/cons analysis using GPT-4o
- **Automated SEO Meta Generator**: AI-generated meta titles and descriptions for products
- **Floating Chat Widget**: Always-accessible AI assistant with Framer Motion animations

### Interactive UI Enhancements (November 2025)
- **Command Menu (⌘K)**: Global command palette with product search and keyboard navigation
- **Interactive Hover Cards**: Lazy-loaded product previews with performance optimization
- **Canvas Particle Background**: Animated particle effects in hero section with IntersectionObserver
- **Rating Distribution Charts**: Visual rating analytics with recharts and dark mode support
- **Three.js 3D Shopping Cart**: WebGL-powered animated cart with:
  - Roll-in animation on page load (2s easing with wheel rotation)
  - Hover wiggle + glow effects (raycasting-based detection)
  - Scroll-based parallax motion (sinusoidal path)
  - Graceful WebGL fallback for unsupported environments
  - Window-level mousemove with bounds checking (click-through support)

## Changelog
- November 15, 2025: **App Startup Fixed** - Resolved all startup errors (ES module imports, missing Replit plugins, broken image imports), app now running successfully on Replit. Created FINAL_MIGRATION_CHECKLIST.md and README.md for GitHub sync. App is fully migration-ready for Cursor IDE.
- November 12, 2025: **Asset Optimization Complete** - Deleted duplicate images (2.6 MB saved), implemented JavaScript conditional rendering for Smart Home video (12 MB mobile savings), added lazy loading to all product images, created useMediaQuery hook for responsive media loading. Total savings: 14.6 MB for mobile users (25 MB → 10.4 MB effective mobile bundle)
- November 12, 2025: **Security Hardening** - Fixed critical privacy breach (orders endpoint), added authentication to protected routes (products, orders, ratings), created production security checklist with rate limiting, CSRF protection, and session management guidelines
- November 12, 2025: **Asset Optimization Documentation** - Created ASSET_OPTIMIZATION.md guide (identified 25MB bloat, documented image/video compression strategies), added .env.example template for all auth providers
- November 12, 2025: **Migration Preparation** - Removed Replit-specific dependencies, created migration-ready auth module (server/auth.ts) with Firebase/Auth0/Supabase support, updated codebase to be platform-agnostic for local development in Cursor IDE
- November 12, 2025: Added interactive UI enhancements (command menu, hover cards, particle backgrounds, rating charts, Three.js 3D cart animations)
- October 8, 2025: Added comprehensive AI features (product recommendations, semantic search, chatbot, product comparison, SEO generation)
- October 7, 2025: Removed PostgreSQL database, added in-memory storage, performance optimizations (preloading, caching), newsletter signup, mobile menu animations, SEO meta tags, lazy loading, loading states, stock indicators
- June 28, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.