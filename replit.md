# DevPortfolio E-commerce Platform

## Overview

This is a full-stack e-commerce web application built with a modern tech stack featuring React frontend, Express.js backend, and PostgreSQL database. The application serves as both a professional developer portfolio and a functional e-commerce platform with advanced features like product management, shopping cart, user authentication, and ratings system.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Authentication**: Replit-based OAuth integration
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
- **Database Layer**: Drizzle ORM with type-safe schema definitions
- **Authentication**: Session-based auth with PostgreSQL session store
- **File Serving**: Static asset serving for images and media

### Database Schema
The application uses a comprehensive schema with the following main entities:
- **Products**: Core product information with categories, pricing, and inventory
- **Users**: User profiles and authentication data
- **Cart Items**: Shopping cart functionality with session-based persistence
- **Orders**: Order management and tracking
- **Ratings**: Product review and rating system
- **Favorites**: User wishlist functionality
- **Categories**: Product categorization system

### UI/UX Features
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Advanced Search**: Multi-criteria filtering and sorting
- **Product Comparison**: Side-by-side product comparison tool
- **Quick View**: Modal-based product previews
- **Shopping Cart**: Real-time cart updates with quantity management

## Data Flow

1. **Client Requests**: React components make API calls using React Query
2. **API Layer**: Express.js routes handle HTTP requests and validation
3. **Business Logic**: Server-side processing with type-safe operations
4. **Database Operations**: Drizzle ORM executes SQL queries against PostgreSQL
5. **Response Handling**: JSON responses with proper error handling
6. **State Updates**: React Query manages cache invalidation and UI updates

## External Dependencies

### Core Framework Dependencies
- **React 18**: Modern React with concurrent features
- **Express.js**: Web application framework for Node.js
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments

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

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- **Dev Server**: `npm run dev` starts both frontend and backend in development mode
- **Hot Reload**: Vite provides instant updates during development
- **TypeScript Checking**: Continuous type checking with `tsc`

### Production Build
- **Frontend Build**: Vite builds optimized React application
- **Backend Bundle**: esbuild creates production server bundle
- **Asset Optimization**: Static assets are properly served and cached
- **Environment Configuration**: Supports both development and production modes

### Database Management
- **Schema Migrations**: Drizzle Kit handles database schema changes
- **Connection Pooling**: Neon serverless PostgreSQL with connection pooling
- **Session Storage**: PostgreSQL-based session management for authentication

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.