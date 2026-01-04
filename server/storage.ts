import {
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type ContactSubmission,
  type InsertContactSubmission,
  type Rating,
  type InsertRating,
  type User,
  type UpsertUser,
  type Favorite,
  type InsertFavorite,
  type RecentlyViewed,
  type InsertRecentlyViewed,
  type Comparison,
  type InsertComparison,
  type EnhancedOrder,
  type InsertEnhancedOrder,
  type OrderItem,
  type InsertOrderItem,
  type ProductSpec,
  type InsertProductSpec,
  type ProductEmbedding,
  type InsertProductEmbedding,
  type SEOMeta,
  type InsertSEOMeta,
  type ChatMessage,
  type InsertChatMessage,
  products,
  categories,
  cartItems,
  orders,
  contactSubmissions,
  ratings,
  users,
  favorites,
  recentlyViewed,
  comparisons,
  enhancedOrders,
  orderItems,
  productSpecs,
  productEmbeddings,
  seoMetas,
  chatMessages
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm"; // Import 'or' here directly to avoid dynamic import issues if not needed

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;

  // Contact operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;

  // Rating operations
  getRatings(productId: number): Promise<Rating[]>;
  addRating(rating: InsertRating): Promise<Rating>;
  getAverageRating(productId: number): Promise<number>;

  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;

  // Favorites operations
  getUserFavorites(userId: string): Promise<Favorite[]>;

  addToFavorites(userId: string, productId: number): Promise<Favorite>;
  removeFromFavorites(userId: string, productId: number): Promise<boolean>;

  // Recently viewed operations
  getRecentlyViewed(userId?: string, sessionId?: string): Promise<RecentlyViewed[]>;
  addToRecentlyViewed(data: InsertRecentlyViewed): Promise<RecentlyViewed>;

  // Product comparison operations
  getComparison(userId?: string, sessionId?: string): Promise<Comparison | undefined>;
  saveComparison(data: InsertComparison): Promise<Comparison>;

  // Product specs operations
  getProductSpecs(productId: number): Promise<ProductSpec[]>;
  addProductSpec(spec: InsertProductSpec): Promise<ProductSpec>;

  // Enhanced order operations
  createEnhancedOrder(order: InsertEnhancedOrder): Promise<EnhancedOrder>;
  getEnhancedOrder(id: number): Promise<EnhancedOrder | undefined>;
  getEnhancedOrderByNumber(orderNumber: string): Promise<EnhancedOrder | undefined>;
  getUserOrders(userId: string): Promise<EnhancedOrder[]>;
  updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<EnhancedOrder | undefined>;

  // Order items operations
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;

  // AI-related operations
  getProductEmbedding(productId: number): Promise<ProductEmbedding | undefined>;
  saveProductEmbedding(embedding: InsertProductEmbedding): Promise<ProductEmbedding>;
  getAllProductEmbeddings(): Promise<ProductEmbedding[]>;

  getSEOMeta(productId: number): Promise<SEOMeta | undefined>;
  saveSEOMeta(meta: InsertSEOMeta): Promise<SEOMeta>;

  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category)).orderBy(desc(products.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products)
      .set(productUpdate)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [deletedProduct] = await db.delete(products)
      .where(eq(products.id, id))
      .returning();
    return !!deletedProduct;
  }


  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId)).orderBy(desc(cartItems.createdAt));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const [existing] = await db.select().from(cartItems).where(
      and(
        eq(cartItems.productId, insertItem.productId),
        eq(cartItems.sessionId, insertItem.sessionId)
      )
    );

    if (existing) {
      const quantityRaw = insertItem.quantity ?? 1;
      const newQuantity = existing.quantity + quantityRaw;
      const [updated] = await db.update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [newItem] = await db.insert(cartItems).values(insertItem).returning();
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const [deleted] = await db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return !!deleted;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return true;
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  // Contact operations
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return submission;
  }

  // Rating operations
  async getRatings(productId: number): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.productId, productId)).orderBy(desc(ratings.createdAt));
  }

  async addRating(insertRating: InsertRating): Promise<Rating> {
    const [rating] = await db.insert(ratings).values(insertRating).returning();
    return rating;
  }

  async getAverageRating(productId: number): Promise<number> {
    const allRatings = await this.getRatings(productId);
    if (allRatings.length === 0) return 0;
    const sum = allRatings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / allRatings.length) * 10) / 10;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: new Date()
      }
    }).returning();
    return user;
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async addToFavorites(userId: string, productId: number): Promise<Favorite> {
    const [favorite] = await db.insert(favorites).values({ userId, productId }).returning();
    return favorite;
  }

  async removeFromFavorites(userId: string, productId: number): Promise<boolean> {
    const [deleted] = await db.delete(favorites).where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.productId, productId)
      )
    ).returning();
    return !!deleted;
  }

  // Recently viewed operations
  async getRecentlyViewed(userId?: string, sessionId?: string): Promise<RecentlyViewed[]> {
    const query = db.select().from(recentlyViewed);

    if (userId && sessionId) {
      return await query.where(or(eq(recentlyViewed.userId, userId), eq(recentlyViewed.sessionId, sessionId)))
        .orderBy(desc(recentlyViewed.viewedAt)).limit(10);
    } else if (userId) {
      return await query.where(eq(recentlyViewed.userId, userId))
        .orderBy(desc(recentlyViewed.viewedAt)).limit(10);
    } else if (sessionId) {
      return await query.where(eq(recentlyViewed.sessionId, sessionId))
        .orderBy(desc(recentlyViewed.viewedAt)).limit(10);
    }

    return [];
  }

  async addToRecentlyViewed(data: InsertRecentlyViewed): Promise<RecentlyViewed> {
    if (data.userId) {
      await db.delete(recentlyViewed).where(
        and(
          eq(recentlyViewed.userId, data.userId),
          eq(recentlyViewed.productId, data.productId)
        )
      );
    } else if (data.sessionId) {
      await db.delete(recentlyViewed).where(
        and(
          eq(recentlyViewed.sessionId, data.sessionId),
          eq(recentlyViewed.productId, data.productId)
        )
      );
    }

    const [viewed] = await db.insert(recentlyViewed).values(data).returning();
    return viewed;
  }

  // Product comparison operations
  async getComparison(userId?: string, sessionId?: string): Promise<Comparison | undefined> {
    const query = db.select().from(comparisons);

    let result: Comparison[] = [];

    if (userId && sessionId) {
      result = await query.where(or(eq(comparisons.userId, userId), eq(comparisons.sessionId, sessionId)))
        .orderBy(desc(comparisons.createdAt));
    } else if (userId) {
      result = await query.where(eq(comparisons.userId, userId))
        .orderBy(desc(comparisons.createdAt));
    } else if (sessionId) {
      result = await query.where(eq(comparisons.sessionId, sessionId))
        .orderBy(desc(comparisons.createdAt));
    }

    return result[0];
  }

  async saveComparison(data: InsertComparison): Promise<Comparison> {
    if (data.userId) {
      await db.delete(comparisons).where(eq(comparisons.userId, data.userId));
    } else if (data.sessionId) {
      await db.delete(comparisons).where(eq(comparisons.sessionId, data.sessionId));
    }

    const [comp] = await db.insert(comparisons).values(data).returning();
    return comp;
  }

  // Product specs operations
  async getProductSpecs(productId: number): Promise<ProductSpec[]> {
    return await db.select().from(productSpecs).where(eq(productSpecs.productId, productId));
  }

  async addProductSpec(spec: InsertProductSpec): Promise<ProductSpec> {
    const [newSpec] = await db.insert(productSpecs).values(spec).returning();
    return newSpec;
  }

  // Enhanced order operations
  async createEnhancedOrder(order: InsertEnhancedOrder): Promise<EnhancedOrder> {
    const [newOrder] = await db.insert(enhancedOrders).values(order).returning();
    return newOrder;
  }

  async getEnhancedOrder(id: number): Promise<EnhancedOrder | undefined> {
    const [order] = await db.select().from(enhancedOrders).where(eq(enhancedOrders.id, id));
    return order;
  }

  async getEnhancedOrderByNumber(orderNumber: string): Promise<EnhancedOrder | undefined> {
    const [order] = await db.select().from(enhancedOrders).where(eq(enhancedOrders.orderNumber, orderNumber));
    return order;
  }

  async getUserOrders(userId: string): Promise<EnhancedOrder[]> {
    return await db.select().from(enhancedOrders).where(eq(enhancedOrders.userId, userId)).orderBy(desc(enhancedOrders.createdAt));
  }

  async updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<EnhancedOrder | undefined> {
    const [order] = await db.update(enhancedOrders)
      .set({
        status,
        updatedAt: new Date(),
        ...(trackingNumber ? { trackingNumber } : {})
      })
      .where(eq(enhancedOrders.id, id))
      .returning();
    return order;
  }

  // Order items operations
  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // AI-related operations
  async getProductEmbedding(productId: number): Promise<ProductEmbedding | undefined> {
    const [embedding] = await db.select().from(productEmbeddings).where(eq(productEmbeddings.productId, productId));
    return embedding;
  }

  async saveProductEmbedding(embedding: InsertProductEmbedding): Promise<ProductEmbedding> {
    const [newEmbedding] = await db.insert(productEmbeddings).values(embedding)
      .onConflictDoUpdate({
        target: productEmbeddings.productId,
        set: { embedding: embedding.embedding }
      }).returning();
    return newEmbedding;
  }

  async getAllProductEmbeddings(): Promise<ProductEmbedding[]> {
    return await db.select().from(productEmbeddings);
  }

  async getSEOMeta(productId: number): Promise<SEOMeta | undefined> {
    const [meta] = await db.select().from(seoMetas).where(eq(seoMetas.productId, productId));
    return meta;
  }

  async saveSEOMeta(meta: InsertSEOMeta): Promise<SEOMeta> {
    const [newMeta] = await db.insert(seoMetas).values(meta).returning();
    return newMeta;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.createdAt);
  }

  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
