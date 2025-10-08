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
  type InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
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
  upsertUser(user: UpsertUser): Promise<User>;
  
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

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private ratings: Map<number, Rating>;
  private users: Map<string, User>;
  private favorites: Map<number, Favorite>;
  private recentlyViewed: Map<number, RecentlyViewed>;
  private comparisons: Map<number, Comparison>;
  private enhancedOrders: Map<number, EnhancedOrder>;
  private orderItems: Map<number, OrderItem>;
  private productSpecs: Map<number, ProductSpec>;
  private productEmbeddings: Map<number, ProductEmbedding>;
  private seoMetas: Map<number, SEOMeta>;
  private chatMessages: Map<number, ChatMessage>;
  
  private currentProductId: number;
  private currentCategoryId: number;
  private currentCartId: number;
  private currentOrderId: number;
  private currentContactId: number;
  private currentRatingId: number;
  private currentFavoriteId: number;
  private currentRecentlyViewedId: number;
  private currentComparisonId: number;
  private currentEnhancedOrderId: number;
  private currentOrderItemId: number;
  private currentProductSpecId: number;
  private currentSEOMetaId: number;
  private currentChatMessageId: number;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.contactSubmissions = new Map();
    this.ratings = new Map();
    this.users = new Map();
    this.favorites = new Map();
    this.recentlyViewed = new Map();
    this.comparisons = new Map();
    this.enhancedOrders = new Map();
    this.orderItems = new Map();
    this.productSpecs = new Map();
    this.productEmbeddings = new Map();
    this.seoMetas = new Map();
    this.chatMessages = new Map();
    
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentCartId = 1;
    this.currentOrderId = 1;
    this.currentContactId = 1;
    this.currentRatingId = 1;
    this.currentFavoriteId = 1;
    this.currentRecentlyViewedId = 1;
    this.currentComparisonId = 1;
    this.currentEnhancedOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentProductSpecId = 1;
    this.currentSEOMetaId = 1;
    this.currentChatMessageId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const sampleCategories: Category[] = [
      { id: this.currentCategoryId++, name: "Featured", description: "Our featured products" },
      { id: this.currentCategoryId++, name: "New Arrivals", description: "Latest products" },
      { id: this.currentCategoryId++, name: "Best Sellers", description: "Most popular items" },
      { id: this.currentCategoryId++, name: "Electronics", description: "Electronic devices and accessories" },
      { id: this.currentCategoryId++, name: "Home & Garden", description: "Home and garden essentials" },
      { id: this.currentCategoryId++, name: "Fashion", description: "Clothing and accessories" },
    ];

    sampleCategories.forEach(category => {
      this.categories.set(category.id, category);
    });

    // Initialize products
    const sampleProducts: Product[] = [
      {
        id: this.currentProductId++,
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
        price: 149.99,
        originalPrice: 199.99,
        category: "Electronics",
        image: "attached_assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg",
        tags: ["sale", "wireless", "audio"],
        featured: true,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Smart Home Assistant",
        description: "Voice-controlled smart home assistant with AI capabilities. Control your home devices with simple voice commands.",
        price: 89.99,
        originalPrice: null,
        category: "Electronics",
        image: "attached_assets/Firefly_realistic and clear glow smart speaker on a Highrise table with Seattle night skyline 787022.jpg",
        tags: ["smart", "home", "ai"],
        featured: true,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Professional Camera Kit",
        description: "Complete photography kit for professionals and enthusiasts. Includes camera body, lenses, and accessories.",
        price: 899.99,
        originalPrice: null,
        category: "Electronics",
        image: "attached_assets/Firefly_Professional Camera Kit 664369.jpg",
        tags: ["photography", "professional", "kit"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Wireless Phone Charger",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
        price: 39.99,
        originalPrice: 49.99,
        category: "Electronics",
        image: "attached_assets/stock_images/wireless_phone_charg_71473ae2.jpg",
        tags: ["sale", "wireless", "charger"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Ergonomic Office Chair",
        description: "Comfortable ergonomic office chair designed for long working hours. Adjustable height and lumbar support.",
        price: 299.99,
        originalPrice: null,
        category: "Home & Garden",
        image: "attached_assets/stock_images/ergonomic_office_cha_b30f2022.jpg",
        tags: ["new", "office", "ergonomic"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Minimalist Desk Lamp",
        description: "Sleek and modern desk lamp with adjustable brightness. Perfect for any workspace or bedside table.",
        price: 79.99,
        originalPrice: null,
        category: "Home & Garden",
        image: "attached_assets/minimalist_expensive_desk_lamp_main_attraction_on.jpg",
        tags: ["lighting", "minimalist", "desk"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "4K Curved Monitor",
        description: "High-resolution curved monitor with professional display quality. Perfect for productivity and creative work.",
        price: 449.99,
        originalPrice: null,
        category: "Electronics",
        image: "attached_assets/minimalist_expensive_desk_with_curved_monitor_that.jpg",
        tags: ["monitor", "display", "productivity"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Fitness Tracker",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and waterproof design. Track your health goals.",
        price: 79.99,
        originalPrice: 99.99,
        category: "Electronics",
        image: "attached_assets/pexels-alesiakozik-6772024.jpg",
        tags: ["sale", "fitness", "health"],
        featured: true,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Luxury Watch",
        description: "Elegant timepiece with premium materials and precision craftsmanship. A perfect accessory for any occasion.",
        price: 459.99,
        originalPrice: null,
        category: "Fashion",
        image: "attached_assets/pexels-n-voitkevich-6214476.jpg",
        tags: ["luxury", "watch", "premium"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Investment Portfolio Kit",
        description: "Comprehensive guide and tools for building and managing your investment portfolio. Professional strategies for wealth building.",
        price: 199.99,
        originalPrice: null,
        category: "Books & Education",
        image: "attached_assets/stock_images/investment_portfolio_6509782d.jpg",
        tags: ["investment", "finance", "education"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize sample ratings
    this.initializeSampleRatings();
  }

  private initializeSampleRatings() {
    const sampleReviews = [
      // Premium Wireless Headphones (Product ID: 1)
      { productId: 1, userName: "Sarah M.", rating: 5, review: "Absolutely amazing headphones! The noise cancellation is incredible and the battery life exceeds expectations. Worth every penny." },
      { productId: 1, userName: "Mike T.", rating: 4, review: "Great sound quality and comfortable for long listening sessions. Only minor complaint is the case could be more compact." },
      { productId: 1, userName: "Jessica L.", rating: 5, review: "Perfect for working from home. The noise cancellation blocks out all distractions and the sound is crystal clear." },
      { productId: 1, userName: "David K.", rating: 4, review: "Excellent build quality and the wireless connection is very stable. Highly recommended for music enthusiasts." },
      { productId: 1, userName: "Amanda R.", rating: 5, review: "Best headphones I've ever owned! The bass is deep but not overwhelming, and the highs are crisp." },
      
      // Smart Home Assistant (Product ID: 2)
      { productId: 2, userName: "Jennifer A.", rating: 5, review: "This smart assistant has transformed our home! Voice recognition is spot-on and it controls all our devices seamlessly." },
      { productId: 2, userName: "Robert C.", rating: 4, review: "Very responsive and easy to set up. The sound quality for music is surprisingly good for the size." },
      { productId: 2, userName: "Maria G.", rating: 5, review: "Love how it integrates with all our smart home devices. The kids enjoy asking it questions and playing games." },
      
      // Professional Camera Kit (Product ID: 3)
      { productId: 3, userName: "Photography Pro", rating: 5, review: "Professional-grade equipment at an amazing price! The image quality is outstanding and the lens variety covers all my needs." },
      { productId: 3, userName: "Lisa Camera", rating: 4, review: "Excellent starter kit for serious photographers. The camera body feels solid and the included lenses are sharp." },
      
      // Other products with varied ratings
      { productId: 4, userName: "Emily J.", rating: 4, review: "Convenient wireless charging pad. Works great with my phone case on." },
      { productId: 5, userName: "Office Worker", rating: 5, review: "Best chair I've ever owned for working from home. My back pain has completely disappeared!" },
      { productId: 6, userName: "Design Lover", rating: 5, review: "Beautiful minimalist design that complements any workspace. The adjustable brightness levels are perfect." },
      { productId: 7, userName: "Tech Enthusiast", rating: 5, review: "Stunning display quality! The color accuracy is exceptional for both work and gaming." },
      { productId: 8, userName: "Fitness Fan", rating: 4, review: "Great fitness tracker. Accurate heart rate monitoring and the battery lasts for days." },
      { productId: 9, userName: "Watch Collector", rating: 5, review: "Absolutely stunning timepiece. The craftsmanship is impeccable and it looks even better in person." },
      { productId: 10, userName: "Investor", rating: 5, review: "Comprehensive investment guide with practical strategies. Has helped me grow my portfolio significantly." },
    ];

    sampleReviews.forEach(reviewData => {
      const rating: Rating = {
        id: this.currentRatingId++,
        productId: reviewData.productId,
        userName: reviewData.userName,
        rating: reviewData.rating,
        review: reviewData.review,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      };
      this.ratings.set(rating.id, rating);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.category === category)
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.featured)
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      originalPrice: insertProduct.originalPrice ?? null,
      tags: insertProduct.tags ?? null,
      featured: insertProduct.featured ?? null,
      inStock: insertProduct.inStock ?? null,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      description: insertCategory.description ?? null,
      id 
    };
    this.categories.set(id, category);
    return category;
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId)
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const existingItem = Array.from(this.cartItems.values())
      .find(item => item.productId === insertItem.productId && item.sessionId === insertItem.sessionId);
    
    if (existingItem) {
      existingItem.quantity += insertItem.quantity ?? 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      const id = this.currentCartId++;
      const cartItem: CartItem = { 
        ...insertItem, 
        quantity: insertItem.quantity ?? 1,
        id,
        createdAt: new Date(),
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItems = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId);
    
    cartItems.forEach(([id, _]) => {
      this.cartItems.delete(id);
    });
    
    return true;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      status: insertOrder.status ?? null,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getRatings(productId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values())
      .filter(rating => rating.productId === productId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async addRating(insertRating: InsertRating): Promise<Rating> {
    const id = this.currentRatingId++;
    const rating: Rating = {
      ...insertRating,
      review: insertRating.review ?? null,
      id,
      createdAt: new Date(),
    };
    this.ratings.set(id, rating);
    return rating;
  }

  async getAverageRating(productId: number): Promise<number> {
    const productRatings = await this.getRatings(productId);
    if (productRatings.length === 0) return 0;
    
    const sum = productRatings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / productRatings.length) * 10) / 10;
  }

  // User operations (stub implementations - no auth in memory storage)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id);
    const user: User = {
      ...userData,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId);
  }

  async addToFavorites(userId: string, productId: number): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = {
      id,
      userId,
      productId,
      createdAt: new Date(),
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFromFavorites(userId: string, productId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.entries())
      .find(([_, fav]) => fav.userId === userId && fav.productId === productId);
    
    if (favorite) {
      return this.favorites.delete(favorite[0]);
    }
    return false;
  }

  // Recently viewed operations
  async getRecentlyViewed(userId?: string, sessionId?: string): Promise<RecentlyViewed[]> {
    return Array.from(this.recentlyViewed.values())
      .filter(item => {
        if (userId && item.userId === userId) return true;
        if (sessionId && item.sessionId === sessionId) return true;
        return false;
      })
      .sort((a, b) => new Date(b.viewedAt || 0).getTime() - new Date(a.viewedAt || 0).getTime())
      .slice(0, 10);
  }

  async addToRecentlyViewed(data: InsertRecentlyViewed): Promise<RecentlyViewed> {
    // Remove existing entry for same product
    const existing = Array.from(this.recentlyViewed.entries())
      .find(([_, item]) => 
        (data.userId && item.userId === data.userId && item.productId === data.productId) ||
        (data.sessionId && item.sessionId === data.sessionId && item.productId === data.productId)
      );
    
    if (existing) {
      this.recentlyViewed.delete(existing[0]);
    }

    const id = this.currentRecentlyViewedId++;
    const viewed: RecentlyViewed = {
      id,
      userId: data.userId ?? null,
      sessionId: data.sessionId ?? null,
      productId: data.productId,
      viewedAt: new Date(),
    };
    this.recentlyViewed.set(id, viewed);
    return viewed;
  }

  // Product comparison operations
  async getComparison(userId?: string, sessionId?: string): Promise<Comparison | undefined> {
    const comparisons = Array.from(this.comparisons.values())
      .filter(comp => {
        if (userId && comp.userId === userId) return true;
        if (sessionId && comp.sessionId === sessionId) return true;
        return false;
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    
    return comparisons[0];
  }

  async saveComparison(data: InsertComparison): Promise<Comparison> {
    // Remove existing comparison
    const existing = Array.from(this.comparisons.entries())
      .find(([_, comp]) => 
        (data.userId && comp.userId === data.userId) ||
        (data.sessionId && comp.sessionId === data.sessionId)
      );
    
    if (existing) {
      this.comparisons.delete(existing[0]);
    }

    const id = this.currentComparisonId++;
    const comparison: Comparison = {
      id,
      userId: data.userId ?? null,
      sessionId: data.sessionId ?? null,
      productIds: data.productIds,
      createdAt: new Date(),
    };
    this.comparisons.set(id, comparison);
    return comparison;
  }

  // Product specs operations
  async getProductSpecs(productId: number): Promise<ProductSpec[]> {
    return Array.from(this.productSpecs.values())
      .filter(spec => spec.productId === productId);
  }

  async addProductSpec(spec: InsertProductSpec): Promise<ProductSpec> {
    const id = this.currentProductSpecId++;
    const newSpec: ProductSpec = {
      id,
      productId: spec.productId,
      specName: spec.specName,
      specValue: spec.specValue,
      createdAt: new Date(),
    };
    this.productSpecs.set(id, newSpec);
    return newSpec;
  }

  // Enhanced order operations
  async createEnhancedOrder(order: InsertEnhancedOrder): Promise<EnhancedOrder> {
    const id = this.currentEnhancedOrderId++;
    const newOrder: EnhancedOrder = {
      id,
      userId: order.userId ?? null,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress ?? null,
      total: order.total,
      status: order.status ?? null,
      trackingNumber: order.trackingNumber ?? null,
      stripePaymentIntentId: order.stripePaymentIntentId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.enhancedOrders.set(id, newOrder);
    return newOrder;
  }

  async getEnhancedOrder(id: number): Promise<EnhancedOrder | undefined> {
    return this.enhancedOrders.get(id);
  }

  async getEnhancedOrderByNumber(orderNumber: string): Promise<EnhancedOrder | undefined> {
    return Array.from(this.enhancedOrders.values())
      .find(order => order.orderNumber === orderNumber);
  }

  async getUserOrders(userId: string): Promise<EnhancedOrder[]> {
    return Array.from(this.enhancedOrders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async updateOrderStatus(id: number, status: string, trackingNumber?: string): Promise<EnhancedOrder | undefined> {
    const order = this.enhancedOrders.get(id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      if (trackingNumber) order.trackingNumber = trackingNumber;
      this.enhancedOrders.set(id, order);
      return order;
    }
    return undefined;
  }

  // Order items operations
  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const newItem: OrderItem = {
      id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      createdAt: new Date(),
    };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }

  // AI-related operations
  async getProductEmbedding(productId: number): Promise<ProductEmbedding | undefined> {
    return Array.from(this.productEmbeddings.values())
      .find(embedding => embedding.productId === productId);
  }

  async saveProductEmbedding(embedding: InsertProductEmbedding): Promise<ProductEmbedding> {
    const existing = Array.from(this.productEmbeddings.values())
      .find(e => e.productId === embedding.productId);
    
    const newEmbedding: ProductEmbedding = {
      productId: embedding.productId,
      embedding: embedding.embedding,
      createdAt: new Date(),
    };
    
    this.productEmbeddings.set(embedding.productId, newEmbedding);
    return newEmbedding;
  }

  async getAllProductEmbeddings(): Promise<ProductEmbedding[]> {
    return Array.from(this.productEmbeddings.values());
  }

  async getSEOMeta(productId: number): Promise<SEOMeta | undefined> {
    return Array.from(this.seoMetas.values())
      .find(meta => meta.productId === productId);
  }

  async saveSEOMeta(meta: InsertSEOMeta): Promise<SEOMeta> {
    const id = this.currentSEOMetaId++;
    const newMeta: SEOMeta = {
      id,
      productId: meta.productId,
      metaTitle: meta.metaTitle,
      metaDescription: meta.metaDescription,
      generatedBy: meta.generatedBy ?? null,
      createdAt: new Date(),
    };
    this.seoMetas.set(id, newMeta);
    return newMeta;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }

  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const newMessage: ChatMessage = {
      id,
      sessionId: message.sessionId,
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
