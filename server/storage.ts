import { 
  products, 
  categories, 
  cartItems, 
  orders, 
  contactSubmissions,
  type Product, 
  type InsertProduct,
  type Category,
  type InsertCategory,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private currentProductId: number;
  private currentCategoryId: number;
  private currentCartId: number;
  private currentOrderId: number;
  private currentContactId: number;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.contactSubmissions = new Map();
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentCartId = 1;
    this.currentOrderId = 1;
    this.currentContactId = 1;
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
        name: "Designer Handbag",
        description: "Elegant designer handbag crafted from premium leather. Perfect for professional and casual occasions.",
        price: 179.99,
        originalPrice: null,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&auto=format",
        tags: ["fashion", "leather", "designer"],
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
}

export const storage = new MemStorage();