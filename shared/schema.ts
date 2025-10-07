import { z } from "zod";

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  image: string;
  tags: string[] | null;
  featured: boolean | null;
  inStock: boolean | null;
  createdAt: Date | null;
}

export const insertProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().nullable().optional(),
  category: z.string(),
  image: z.string(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  inStock: z.boolean().optional(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

// Category types
export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export const insertCategorySchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
  createdAt: Date | null;
}

export const insertCartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().optional(),
  sessionId: z.string(),
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

// Order types
export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string | null;
  createdAt: Date | null;
}

export const insertOrderSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string(),
  total: z.number(),
  status: z.string().optional(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Contact types
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: Date | null;
}

export const insertContactSubmissionSchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

// Rating types
export interface Rating {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  review: string | null;
  createdAt: Date | null;
}

export const insertRatingSchema = z.object({
  productId: z.number(),
  userName: z.string(),
  rating: z.number(),
  review: z.string().nullable().optional(),
});

export type InsertRating = z.infer<typeof insertRatingSchema>;

// User types  
export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const insertUserSchema = z.object({
  id: z.string(),
  email: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
});

export const upsertUserSchema = insertUserSchema;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

// Favorites types
export interface Favorite {
  id: number;
  userId: string | null;
  productId: number | null;
  createdAt: Date | null;
}

export const insertFavoriteSchema = z.object({
  userId: z.string(),
  productId: z.number(),
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

// Recently viewed types
export interface RecentlyViewed {
  id: number;
  userId: string | null;
  sessionId: string | null;
  productId: number | null;
  viewedAt: Date | null;
}

export const insertRecentlyViewedSchema = z.object({
  userId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  productId: z.number(),
});

export type InsertRecentlyViewed = z.infer<typeof insertRecentlyViewedSchema>;

// Comparison types
export interface Comparison {
  id: number;
  userId: string | null;
  sessionId: string | null;
  productIds: number[] | null;
  createdAt: Date | null;
}

export const insertComparisonSchema = z.object({
  userId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  productIds: z.array(z.number()),
});

export type InsertComparison = z.infer<typeof insertComparisonSchema>;

// Enhanced order types
export interface EnhancedOrder {
  id: number;
  userId: string | null;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: any;
  billingAddress: any;
  total: string;
  status: string | null;
  trackingNumber: string | null;
  stripePaymentIntentId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const insertEnhancedOrderSchema = z.object({
  userId: z.string().nullable().optional(),
  orderNumber: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  shippingAddress: z.any(),
  billingAddress: z.any().optional(),
  total: z.string(),
  status: z.string().optional(),
  trackingNumber: z.string().nullable().optional(),
  stripePaymentIntentId: z.string().nullable().optional(),
});

export type InsertEnhancedOrder = z.infer<typeof insertEnhancedOrderSchema>;

// Order item types
export interface OrderItem {
  id: number;
  orderId: number | null;
  productId: number | null;
  quantity: number;
  price: string;
  createdAt: Date | null;
}

export const insertOrderItemSchema = z.object({
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  price: z.string(),
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Product spec types
export interface ProductSpec {
  id: number;
  productId: number | null;
  specName: string;
  specValue: string;
  createdAt: Date | null;
}

export const insertProductSpecSchema = z.object({
  productId: z.number(),
  specName: z.string(),
  specValue: z.string(),
});

export type InsertProductSpec = z.infer<typeof insertProductSpecSchema>;
