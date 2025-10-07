
# Trellis E-commerce Platform - Knowledge Base

## Table of Contents
1. [Overview](#overview)
2. [Platform Architecture](#platform-architecture)
3. [Pages & Features](#pages--features)
4. [Components](#components)
5. [User Features](#user-features)
6. [Technical Stack](#technical-stack)
7. [API Documentation](#api-documentation)
8. [Styling & Design](#styling--design)
9. [SEO & Performance](#seo--performance)

## Overview

**Trellis** is a premium e-commerce platform specializing in high-quality electronics, accessories, and innovative tech solutions. The platform combines a modern, responsive design with advanced features to provide an exceptional shopping experience.

### Core Values
- **Quality Guarantee**: Every product is carefully inspected with satisfaction guarantee
- **Fast Delivery**: Free shipping on all orders with expedited options
- **Premium Support**: Dedicated customer service team available to help

### Contact Information
- **Email**: Thoma260@wwu.edu
- **Phone**: +1 (555) 123-4567 (Monday to Friday, 9am to 6pm PST)
- **Location**: Western Washington University, Bellingham, WA 98225

## Platform Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript, Vite build tool
- **Backend**: Express.js with Node.js
- **Storage**: In-memory storage (MemStorage implementation)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, Context API for client state
- **Routing**: wouter for lightweight client-side routing
- **Authentication**: Replit-based OAuth integration

### File Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Backend Express application
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage layer
│   └── replitAuth.ts    # Authentication setup
├── shared/              # Shared types and schemas
└── attached_assets/     # Images and media files
```

## Pages & Features

### 1. Home Page (`/`)

**Hero Section**
- Large banner image with gradient overlay
- Welcome message: "Welcome!"
- Tagline: "Discover premium products designed with care and precision"
- Call-to-action: "Start Shopping" button

**About Trellis Section**
- Company mission and values
- Statistics: 500+ Happy Customers
- Interactive image with reveal-on-hover effect
- "Get in Touch" button linking to contact page

**Featured Products**
- Displays 6 featured products
- Each product card shows:
  - Product image (with lazy loading)
  - Product name and description
  - Price (with original price if on sale)
  - "SALE" badge for discounted items
  - Star ratings and reviews
- "View All Products" button to shop page

**Why Choose Trellis Section**
- Interactive scroll-locked animation (3 seconds)
- Three key benefits:
  1. **Fast Delivery**: Quick shipping with reliable logistics
  2. **Quality Guarantee**: Inspected products with satisfaction guarantee
  3. **Premium Support**: Dedicated customer service team
- Animated cards with bounce effects

**Call to Action Section**
- Gradient background with animation
- "Ready to Experience Excellence?" headline
- Two action buttons:
  - "Shop Now" (primary)
  - "Contact Us" (secondary)

**Newsletter Modal**
- Auto-appears after 8 seconds (once per user via localStorage)
- Email collection form
- Toast notification on submission
- Responsive design with Radix UI

### 2. Shop Page (`/shop`)

**Header Banner**
- Full-width banner image
- "Shop" heading with description
- Overlay with 50% white background

**Search & Filter System**
- **Search Bar**: Real-time product search by name/description
- **Category Tabs**: All Products, Featured, New Arrivals, Best Sellers, + dynamic categories
- **Advanced Filters** (Popover):
  - Price Range Slider ($0 - $1000)
  - Minimum Rating (1-5 stars)
  - In Stock Only checkbox
  - Categories multi-select
  - Clear All / Apply buttons

**Sort Options**
- Name (A-Z)
- Price (Low to High)
- Price (High to Low)

**Recently Viewed Section**
- Horizontal scrollable list
- Shows last 5 viewed products
- Compact card design with image and price

**Product Grid**
- Responsive grid layout (1/2/3 columns)
- Each product card includes:
  - Product image or video
  - Sale/New badges
  - Product name and description
  - Category tag
  - Price display (with strikethrough for original price)
  - Star ratings
  - Stock status badge
  - "Add to Cart" button (disabled if out of stock)
  - Out of stock overlay

**Product Images**
- Premium Wireless Headphones
- Wireless Phone Charger
- Investment Trends
- Smart Home Assistant (video)
- Professional Camera Kit
- Minimalist Desk Lamp
- Monitors

**No Results State**
- Search icon illustration
- "No products found" message
- "Clear Filters" button

**Contact Support CTA**
- Blue background card
- "Can't find what you're looking for?" message
- "Contact Support" button

### 3. Product Detail Page (`/product/:id`)

**Breadcrumb Navigation**
- Home > Shop > Product Name

**Product Image Section**
- Large aspect-square image
- Click to zoom functionality
- Zoom icon indicator

**Product Information**
- Category badge
- Product name (h1)
- Star ratings with reviews
- Price display:
  - Strikethrough original price (if on sale)
  - Current price in large blue text
  - Discount percentage badge

**Product Description**
- Detailed product information
- Tags display (if available)

**Purchase Controls**
- Quantity selector (- / + buttons)
- Stock status badge (In Stock / Out of Stock)
- "Add to Cart" button (full width, disabled if out of stock)
- "Add to Favorites" heart button (authenticated users only)
- "Share" button

**Related Products**
- Grid of 4 related products (same category)
- Hover effects on cards
- Direct links to product pages

### 4. Cart Page (`/cart`)

**Header Section**
- Blue background banner
- "Shopping Cart" heading
- Review message

**Empty Cart State**
- Shopping cart emoji (🛒)
- "Your cart is empty" message
- "Start Shopping" button

**Cart Items List**
- Product image (80x80px)
- Product name, category, and price
- Quantity controls (- / + buttons)
- Item total calculation
- Remove item button (trash icon)

**Cart Actions**
- "Clear Cart" button (red outline)
- "Continue Shopping" button (returns to shop)

**Order Summary (Sticky Sidebar)**
- Subtotal
- Shipping (FREE)
- Tax (8%)
- Total amount (bold, blue)
- "Proceed to Checkout" button
- Benefits list:
  - Free shipping on all orders
  - 30-day return policy
  - Secure checkout

**Checkout Process**
- 2-second simulated checkout
- Cart clearing on success
- Success toast notification

### 5. Contact Page (`/contact`)

**Header Section**
- Blue background with phone icon
- "Contact Us" heading
- "Have questions? We'd love to hear from you" message

**Contact Information Cards**
- **Email Card**: Thoma260@wwu.edu (24-hour response time)
- **Phone Card**: +1 (555) 123-4567 (M-F, 9am-6pm PST)
- **Office Card**: WWU Bellingham, WA 98225

**Contact Form**
- Full Name field (required)
- Email Address field (required)
- Message textarea (required)
- "Send Message" button with loading state
- Success/error toast notifications
- Form validation
- Note: 24-hour response time during business days

**Shipping & Returns Information Section**
- **Three Feature Cards**:
  1. Free Shipping: Free standard shipping, 1-2 day processing
  2. Easy Returns: 30-day return policy, no questions asked
  3. Track Your Order: Real-time tracking updates

- **Shipping Times**:
  - Standard: 3-5 business days
  - Express: 1-2 business days
  - Same-day delivery (Seattle metro area)

- **Return Process**:
  - Contact to initiate return
  - Print prepaid return label
  - Refund within 3-5 business days

## Components

### Navigation Component
- Sticky header with glassmorphism effect
- Logo/Brand name ("Trellis")
- Desktop menu: Home, Shop, Contact
- Shopping cart icon with item count badge
- Mobile hamburger menu with Framer Motion animations
- Staggered animation for menu items
- Auto-close on navigation
- Dark mode support

### Footer Component
- Three-column layout:
  1. **About**: Company description and social links
  2. **Quick Links**: Shop, Contact, Privacy Policy, Terms of Service
  3. **Contact**: Email, phone, address
- Bottom bar: Copyright notice
- Responsive grid layout

### Product Rating Component
- Star display (filled/half/empty)
- Average rating calculation
- Review count
- Individual reviews list with:
  - Username
  - Star rating
  - Comment
  - Timestamp
- "Write a Review" dialog:
  - Star rating selector
  - Comment textarea
  - Submit button
- Toast notifications for success/error

### Cart Context
- Global cart state management
- Session-based cart persistence
- Functions:
  - `addToCart(productId, quantity)`
  - `updateQuantity(cartItemId, quantity)`
  - `removeFromCart(cartItemId)`
  - `clearCart()`
- Automatic cart total calculation
- Toast notifications for cart actions

### SEO Component
- Dynamic meta tags via react-helmet-async
- Configurable:
  - Title (with site suffix)
  - Description
  - Keywords
  - Open Graph tags (image, type, url)
  - Twitter Card tags
- Default values for homepage

### Newsletter Modal
- Dialog component from Radix UI
- Email input field
- Subscribe button
- LocalStorage tracking (shows once)
- Auto-trigger after 8 seconds
- Toast notification on success

### Product Quick View (Mentioned but not shown in files)
- Modal preview of product
- Key product information
- Quick add to cart

### Favorites Button (Mentioned but not shown in files)
- Heart icon toggle
- Add/remove from favorites
- Requires authentication

### Theme Provider
- Dark mode support
- System preference detection
- Persistent theme storage

## User Features

### Shopping Experience
1. **Product Browsing**
   - Category filtering
   - Search functionality
   - Price range filtering
   - Rating-based filtering
   - Multiple sort options

2. **Product Discovery**
   - Featured products
   - Recently viewed history
   - Related products
   - Product comparison (mentioned in routes)

3. **Cart Management**
   - Add to cart from shop/product pages
   - Update quantities
   - Remove items
   - Clear entire cart
   - Persistent cart (session-based)

4. **Checkout Process**
   - Order summary
   - Tax calculation (8%)
   - Free shipping
   - Simulated checkout

5. **User Engagement**
   - Product ratings and reviews
   - Favorites/Wishlist
   - Newsletter subscription
   - Recently viewed products

### Authentication Features
- Replit OAuth integration
- Session management with MemoryStore
- Protected routes for:
  - Favorites
  - User-specific cart
  - Order history

## API Documentation

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category={category}` - Filter by category
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)

### Categories
- `GET /api/categories` - Get all categories

### Cart
- `GET /api/cart/:sessionId` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart/session/:sessionId` - Clear cart

### Ratings & Reviews
- `GET /api/products/:id/ratings` - Get product ratings
- `POST /api/products/:id/ratings` - Submit rating
- `GET /api/products/:id/average-rating` - Get average rating
- `GET /api/ratings/average/:productId` - Alternative average rating endpoint

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders

### Contact
- `POST /api/contact` - Submit contact form

### Authentication
- `GET /api/auth/user` - Get authenticated user (requires auth)

### Favorites (Requires Auth)
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:productId` - Remove from favorites

### Recently Viewed
- `GET /api/recently-viewed` - Get recently viewed products
- `POST /api/recently-viewed` - Add to recently viewed

### Product Comparison
- `GET /api/comparison` - Get comparison list
- `POST /api/comparison` - Save comparison (max 3 products)

### Product Specifications
- `GET /api/product-specs/:productId` - Get product specs
- `POST /api/product-specs` - Add product spec

## Styling & Design

### Design System
- **Primary Color**: `hsl(205 100% 45%)` (#2588bb)
- **Secondary Color**: `hsl(213 87% 51%)` (#3385d6)
- **Font**: Inter (Google Fonts)
- **Border Radius**: 0.5rem

### Glassmorphism Effects
- Background: `rgba(255, 255, 255, 0.15)`
- Border: `rgba(255, 255, 255, 0.2)`
- Backdrop blur: 20px
- Shadow: `0 8px 32px rgba(31, 38, 135, 0.37)`

### Animations
1. **Gradient Animations**
   - `animate-gradient-x`: Horizontal gradient shift (4s)
   - `animate-gradient-x-reverse`: Reverse gradient (6s)
   - `animate-gradient-text`: Text gradient (3s)

2. **Float Animations**
   - `animate-float`: Basic float (6s)
   - `animate-float-delayed`: Delayed float (8s)
   - `animate-float-slow`: Slow float with rotation

3. **Scroll Animations**
   - Fade in effects
   - Slide up effects
   - Reveal on hover

4. **Interactive Elements**
   - Hover scale transformations
   - Card lift effects
   - Button glow effects
   - Smooth transitions (300ms cubic-bezier)

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### Special Effects
- Animated background with gradient shift
- Floating geometric shapes (3 shapes with staggered animations)
- Cursor glow effect following mouse
- Scroll-locked "Why Choose" section with bounce animation
- Shimmer effects on product cards
- Glass morphism on cards and buttons

## SEO & Performance

### SEO Implementation
- Dynamic meta tags per page
- Open Graph protocol for social sharing
- Twitter Card optimization
- Structured page titles with brand suffix
- Descriptive meta descriptions
- Keyword optimization
- Product-specific meta tags

### Performance Optimizations
1. **Resource Loading**
   - DNS prefetch for Google Fonts
   - Preconnect to external domains
   - Font preloading
   - Image lazy loading (native browser)

2. **React Query Caching**
   - staleTime: 5 minutes
   - gcTime: 10 minutes
   - Automatic cache invalidation
   - Optimistic updates

3. **Code Splitting**
   - Route-based code splitting
   - Lazy loading components
   - Dynamic imports

4. **Loading States**
   - Skeleton screens for Shop page
   - Skeleton screens for Product Detail page
   - Loading spinners for async operations
   - Smooth transitions between states

5. **Image Optimization**
   - WebP format support
   - Proper sizing and aspect ratios
   - Lazy loading with native browser API
   - Fallback images for errors

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## Product Catalog

### Featured Products
1. **Premium Wireless Headphones** - $299 (was $399) - Electronics
2. **Wireless Phone Charger** - $49 - Accessories  
3. **Investment Trends** - $29 - Books
4. **Smart Home Assistant** - $149 - Smart Home (video display)
5. **Professional Camera Kit** - $1,299 - Photography
6. **Minimalist Desk Lamp** - $79 - Home & Office
7. **Monitors** - $499 - Electronics

### Product Categories
- Featured
- Electronics
- Accessories
- Books
- Smart Home
- Photography
- Home & Office

### Product Features
- In-stock indicators
- Sale badges
- New arrival tags
- Original price display
- Stock availability checking
- Product specifications
- User ratings and reviews
- Related products suggestions

## Data Models

### Product
- id, name, description, price, originalPrice
- category, image, featured
- inStock, tags
- createdAt, updatedAt

### Cart Item
- id, sessionId, userId, productId, quantity
- createdAt, updatedAt

### Order
- id, userId, sessionId, totalAmount, status
- createdAt, updatedAt

### Rating
- id, productId, userId, userName
- rating (1-5), comment
- createdAt

### Category
- id, name, description

### Contact Submission
- id, name, email, message
- createdAt

### Favorite
- id, userId, productId
- createdAt

### Recently Viewed
- id, userId, sessionId, productId
- viewedAt

### Comparison
- id, userId, sessionId, productIds (array)
- createdAt, updatedAt

## Business Rules

### Pricing
- Free shipping on all orders
- 8% tax applied at checkout
- Sale prices shown with strikethrough original price
- Discount percentage badges on sale items

### Returns & Shipping
- 30-day return policy
- No questions asked returns
- Prepaid return labels
- Standard shipping: 3-5 business days
- Express shipping: 1-2 business days
- Same-day delivery (Seattle metro area)
- Refunds processed within 3-5 business days

### Customer Support
- 24-hour response time for emails
- Phone support: Monday-Friday, 9am-6pm PST
- In-person visits during business hours
- Contact form for inquiries

### Stock Management
- Real-time stock indicators
- "Out of Stock" overlay on unavailable products
- Disabled "Add to Cart" for out-of-stock items
- Stock status badges on product cards

## Development Notes

### In-Memory Storage
- Data resets on server restart
- Session-based cart (ephemeral)
- Pre-loaded sample data
- Ready for database migration

### Environment
- Development: `npm run dev`
- Production build: Vite + esbuild
- Port 5000 for all services
- Replit deployment ready

### Future Enhancements (Mentioned in code)
- Stripe payment integration
- SendGrid email service
- Product comparison feature (partially implemented)
- Advanced search filters
- Order tracking
- User accounts and profiles
