import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(), // using real for float approximation, or numeric for precision
  originalPrice: real("original_price"),
  category: text("category").notNull(),
  image: text("image").notNull(),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  total: real("total").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using text ID for external auth provider IDs
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recentlyViewed = pgTable("recently_viewed", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  sessionId: text("session_id"),
  productId: integer("product_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const comparisons = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  sessionId: text("session_id"),
  productIds: integer("product_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enhancedOrders = pgTable("enhanced_orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  orderNumber: text("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address"),
  total: text("total").notNull(), // Keeping as text to match original string type if needed, or change to numeric
  status: text("status").default("pending"),
  trackingNumber: text("tracking_number"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id"),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: text("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productSpecs = pgTable("product_specs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  specName: text("spec_name").notNull(),
  specValue: text("spec_value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productEmbeddings = pgTable("product_embeddings", {
  productId: integer("product_id").primaryKey(),
  embedding: real("embedding").array().notNull(), // vector extension usually needed for true embeddings, but using array for now or pg-vector if available
  createdAt: timestamp("created_at").defaultNow(),
});

export const seoMetas = pgTable("seo_metas", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  generatedBy: text("generated_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role", { enum: ['user', 'assistant', 'system'] }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertProductSchema = createInsertSchema(products);
export const insertCategorySchema = createInsertSchema(categories);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
export const insertRatingSchema = createInsertSchema(ratings);
export const insertUserSchema = createInsertSchema(users);
export const insertFavoriteSchema = createInsertSchema(favorites);
export const insertRecentlyViewedSchema = createInsertSchema(recentlyViewed);
export const insertComparisonSchema = createInsertSchema(comparisons);
export const insertEnhancedOrderSchema = createInsertSchema(enhancedOrders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertProductSpecSchema = createInsertSchema(productSpecs);
export const insertProductEmbeddingSchema = createInsertSchema(productEmbeddings);
export const insertSEOMetaSchema = createInsertSchema(seoMetas);
export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const upsertUserSchema = insertUserSchema;

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
export type RecentlyViewed = typeof recentlyViewed.$inferSelect;
export type InsertRecentlyViewed = typeof recentlyViewed.$inferInsert;
export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = typeof comparisons.$inferInsert;
export type EnhancedOrder = typeof enhancedOrders.$inferSelect;
export type InsertEnhancedOrder = typeof enhancedOrders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type ProductSpec = typeof productSpecs.$inferSelect;
export type InsertProductSpec = typeof productSpecs.$inferInsert;
export type ProductEmbedding = typeof productEmbeddings.$inferSelect;
export type InsertProductEmbedding = typeof productEmbeddings.$inferInsert;
export type SEOMeta = typeof seoMetas.$inferSelect;
export type InsertSEOMeta = typeof seoMetas.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
