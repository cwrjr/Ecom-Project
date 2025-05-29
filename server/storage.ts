import { 
  products, 
  categories, 
  cartItems, 
  orders, 
  contactSubmissions,
  ratings,
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
  type InsertRating
} from "@shared/schema";
import { db } from "./db";
import { eq, avg, and } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  getRatings(productId: number): Promise<Rating[]>;
  addRating(rating: InsertRating): Promise<Rating>;
  getAverageRating(productId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(and(
        eq(cartItems.productId, insertItem.productId),
        eq(cartItems.sessionId, insertItem.sessionId)
      ));

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (insertItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Insert new item
      const [cartItem] = await db
        .insert(cartItems)
        .values({ ...insertItem, quantity: insertItem.quantity || 1 })
        .returning();
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return (result.rowCount || 0) > 0;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getRatings(productId: number): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.productId, productId));
  }

  async addRating(insertRating: InsertRating): Promise<Rating> {
    const [rating] = await db
      .insert(ratings)
      .values(insertRating)
      .returning();
    return rating;
  }

  async getAverageRating(productId: number): Promise<number> {
    const result = await db
      .select({ average: avg(ratings.rating) })
      .from(ratings)
      .where(eq(ratings.productId, productId));
    
    return Number(result[0]?.average) || 0;
  }
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private ratings: Map<number, Rating>;
  private currentProductId: number;
  private currentCategoryId: number;
  private currentCartId: number;
  private currentOrderId: number;
  private currentContactId: number;
  private currentRatingId: number;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.contactSubmissions = new Map();
    this.ratings = new Map();
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentCartId = 1;
    this.currentOrderId = 1;
    this.currentContactId = 1;
    this.currentRatingId = 1;
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

    // Initialize products with high-quality free images
    const sampleProducts: Product[] = [
      {
        id: this.currentProductId++,
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
        price: 149.99,
        originalPrice: 199.99,
        category: "Electronics",
        image: "@assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg",
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
        image: "@assets/f62dd8e7-7056-4c64-9252-8cb45c3210ef (1).mp4",
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
        image: "@assets/Firefly_Professional Camera Kit 664369.jpg",
        tags: ["photography", "professional", "kit"],
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
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&auto=format",
        tags: ["new", "office", "ergonomic"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Monitors",
        description: "High-resolution curved monitor with professional display quality. Perfect for productivity and creative work.",
        price: 179.99,
        originalPrice: null,
        category: "Electronics",
        image: "@assets/minimalist_expensive_desk_with_curved_monitor_that.jpg",
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
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop&auto=format",
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
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&h=500&fit=crop&auto=format",
        tags: ["luxury", "watch", "premium"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Investment Trends",
        description: "Complete guide to cryptocurrency and digital investment strategies. Learn the fundamentals of Bitcoin and blockchain technology with expert insights.",
        price: 49.99,
        originalPrice: 79.99,
        category: "Books",
        image: "@assets/pexels-alesiakozik-6772024.jpg",
        tags: ["sale", "crypto", "investment", "new"],
        featured: true,
        inStock: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProductId++,
        name: "Minimalist Desk Lamp",
        description: "Modern LED desk lamp with adjustable brightness and sleek design. Perfect for home office or study space.",
        price: 89.99,
        originalPrice: null,
        category: "Home & Garden",
        image: "@assets/minimalist_expensive_desk_lamp_main_attraction_on.jpg",
        tags: ["modern", "led", "desk"],
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
        image: "https://images.unsplash.com/photo-1609592173503-f8009d2fb5e9?w=500&h=500&fit=crop&auto=format",
        tags: ["sale", "wireless", "charger"],
        featured: false,
        inStock: true,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize sample ratings and reviews
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
      { productId: 1, userName: "Tom S.", rating: 3, review: "Good headphones overall but took some time to get used to the fit. Sound quality is definitely impressive." },
      { productId: 1, userName: "Lisa H.", rating: 5, review: "Love these! Great for travel, gym, and daily commute. The quick charge feature is a lifesaver." },
      { productId: 1, userName: "Chris P.", rating: 4, review: "Solid headphones with premium feel. The app for customizing sound profiles is a nice touch." },
      { productId: 1, userName: "Rachel W.", rating: 5, review: "Amazing product! The customer service was also excellent when I had questions about setup." },
      { productId: 1, userName: "Kevin M.", rating: 4, review: "Great value for the price. The noise cancellation works better than more expensive alternatives I've tried." },

      // Smart Home Assistant (Product ID: 2)
      { productId: 2, userName: "Jennifer A.", rating: 5, review: "This smart assistant has transformed our home! Voice recognition is spot-on and it controls all our devices seamlessly." },
      { productId: 2, userName: "Robert C.", rating: 4, review: "Very responsive and easy to set up. The sound quality for music is surprisingly good for the size." },
      { productId: 2, userName: "Maria G.", rating: 5, review: "Love how it integrates with all our smart home devices. The kids enjoy asking it questions and playing games." },
      { productId: 2, userName: "Steve B.", rating: 3, review: "Works well but sometimes struggles with accents. Overall satisfied with the purchase for the price point." },
      { productId: 2, userName: "Nicole F.", rating: 5, review: "Exceeded expectations! The voice assistant is incredibly helpful for cooking, weather, and managing our schedule." },
      { productId: 2, userName: "James D.", rating: 4, review: "Great addition to our smart home ecosystem. Setup was straightforward and it responds quickly to commands." },
      { productId: 2, userName: "Karen L.", rating: 5, review: "Perfect for our kitchen. We use it daily for timers, music, and getting quick answers while cooking." },
      { productId: 2, userName: "Paul R.", rating: 4, review: "Impressed with the AI capabilities. It learns our preferences and gets better over time." },
      { productId: 2, userName: "Linda S.", rating: 5, review: "Fantastic product! The privacy controls give us peace of mind while still enjoying all the smart features." },
      { productId: 2, userName: "Mark W.", rating: 4, review: "Solid smart assistant. The integration with our lighting and thermostat works flawlessly." },

      // Wireless Phone Charger (Product ID: 3)
      { productId: 3, userName: "Emily J.", rating: 4, review: "Convenient wireless charging pad. Works great with my phone case on. Clean design that looks good on my desk." },
      { productId: 3, userName: "Daniel T.", rating: 5, review: "Fast charging and the LED indicator is helpful. Much more convenient than dealing with cables every time." },
      { productId: 3, userName: "Sophie M.", rating: 3, review: "Does the job but can be finicky about phone placement. Once positioned correctly, it charges reliably." },
      { productId: 3, userName: "Alex P.", rating: 4, review: "Great build quality and charges my phone overnight without any issues. The non-slip surface is a nice touch." },
      { productId: 3, userName: "Michelle K.", rating: 5, review: "Love this charger! No more worn-out charging cables. It's become an essential part of my bedside setup." },
      { productId: 3, userName: "Ryan H.", rating: 4, review: "Reliable wireless charging with a sleek design. Works well with multiple phone models in our household." },
      { productId: 3, userName: "Tracy L.", rating: 5, review: "Perfect for my office desk. Keeps my phone charged throughout the day without the clutter of cables." },
      { productId: 3, userName: "Brian S.", rating: 3, review: "Good charger but wish it charged a bit faster. Still convenient for overnight charging though." },

      // Business Investment Guide (Product ID: 4)
      { productId: 4, userName: "Richard B.", rating: 5, review: "Excellent investment resource! The strategies are practical and well-explained. Already seeing results from the advice." },
      { productId: 4, userName: "Catherine D.", rating: 4, review: "Comprehensive guide with real-world examples. Great for both beginners and experienced investors." },
      { productId: 4, userName: "William F.", rating: 5, review: "This book changed my approach to investing. The risk management section alone was worth the purchase price." },
      { productId: 4, userName: "Helen M.", rating: 4, review: "Well-researched content with actionable insights. I appreciate the focus on long-term wealth building." },
      { productId: 4, userName: "Thomas G.", rating: 5, review: "Outstanding guide! The author's experience really shows through. I've recommended it to several colleagues." },
      { productId: 4, userName: "Susan R.", rating: 3, review: "Good information but some concepts could be explained more simply. Still valuable for serious investors." },
      { productId: 4, userName: "Andrew N.", rating: 4, review: "Solid investment fundamentals with practical examples. The case studies really help illustrate the concepts." },

      // Professional Camera Kit (Product ID: 5)
      { productId: 5, userName: "Photography Pro", rating: 5, review: "Professional-grade equipment at an amazing price! The image quality is outstanding and the lens variety covers all my needs." },
      { productId: 5, userName: "Lisa Camera", rating: 4, review: "Excellent starter kit for serious photographers. The camera body feels solid and the included lenses are sharp." },
      { productId: 5, userName: "Mark Shooter", rating: 5, review: "This kit has everything needed for professional work. The low-light performance is particularly impressive." },
      { productId: 5, userName: "Sarah Photo", rating: 4, review: "Great value for a complete camera system. The autofocus is fast and accurate for both stills and video." },
      { productId: 5, userName: "Joe Lens", rating: 5, review: "Incredible image quality and build construction. The weather sealing has saved me in challenging conditions." },
      { productId: 5, userName: "Emma Click", rating: 4, review: "Perfect for wedding photography. The dual card slots and battery life give me confidence during long shoots." },

      // Minimalist Desk Lamp (Product ID: 6)
      { productId: 6, userName: "Design Lover", rating: 5, review: "Beautiful minimalist design that complements any workspace. The adjustable brightness levels are perfect for different tasks." },
      { productId: 6, userName: "Office Worker", rating: 4, review: "Excellent task lighting with a sleek profile. The touch controls are intuitive and the build quality feels premium." },
      { productId: 6, userName: "Student Life", rating: 5, review: "Perfect study lamp! The warm light setting is easy on the eyes during long reading sessions." },
      { productId: 6, userName: "Remote Pro", rating: 4, review: "Great addition to my home office. The adjustable arm positions exactly where I need light for video calls." },
      { productId: 6, userName: "Night Owl", rating: 5, review: "Love the dimming feature for late-night work. The minimalist design doesn't clutter my clean desk setup." },

      // Monitors (Product ID: 7)
      { productId: 7, userName: "Tech Enthusiast", rating: 5, review: "Stunning display quality! The color accuracy is exceptional for both work and gaming. Highly recommend for professionals." },
      { productId: 7, userName: "Gamer Pro", rating: 4, review: "Great gaming monitor with smooth refresh rates. The curved design provides an immersive experience." },
      { productId: 7, userName: "Designer", rating: 5, review: "Perfect for graphic design work. The color reproduction is accurate and the screen real estate boosts productivity." },
      { productId: 7, userName: "Developer", rating: 4, review: "Excellent for coding with plenty of screen space. The adjustable stand makes it easy to find the perfect viewing angle." },
      { productId: 7, userName: "Video Editor", rating: 5, review: "Outstanding monitor for video editing. The high resolution shows every detail and the color accuracy is spot-on." },
      { productId: 7, userName: "Office Manager", rating: 4, review: "Great monitors for the office. Multiple employees use these daily and they've been reliable and sharp." }
    ];

    // Add all sample reviews
    sampleReviews.forEach(reviewData => {
      const rating: Rating = {
        id: this.currentRatingId++,
        productId: reviewData.productId,
        userName: reviewData.userName,
        rating: reviewData.rating,
        review: reviewData.review,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
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
    const category: Category = { ...insertCategory, id };
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
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values())
      .find(item => item.productId === insertItem.productId && item.sessionId === insertItem.sessionId);
    
    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += insertItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Create new cart item
      const id = this.currentCartId++;
      const cartItem: CartItem = { 
        ...insertItem, 
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
    return Math.round((sum / productRatings.length) * 10) / 10; // Round to 1 decimal place
  }
}

export const storage = new DatabaseStorage();