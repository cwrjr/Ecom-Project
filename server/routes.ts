import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertCartItemSchema, 
  insertOrderSchema, 
  insertContactSubmissionSchema,
  insertRatingSchema,
  insertProductSpecSchema,
  insertFavoriteSchema,
  insertRecentlyViewedSchema,
  insertComparisonSchema
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid product data", issues: result.error.issues });
      }
      
      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const result = insertCartItemSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid cart item data", issues: result.error.issues });
      }
      
      const cartItem = await storage.addToCart(result.data);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (isNaN(id) || typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: "Invalid cart item ID or quantity" });
      }
      
      const cartItem = await storage.updateCartItem(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid cart item ID" });
      }
      
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const result = insertOrderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid order data", issues: result.error.issues });
      }
      
      const order = await storage.createOrder(result.data);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Ratings routes
  app.get("/api/products/:id/ratings", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const ratings = await storage.getRatings(productId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  app.post("/api/products/:id/ratings", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const result = insertRatingSchema.safeParse({ ...req.body, productId });
      if (!result.success) {
        return res.status(400).json({ error: "Invalid rating data", issues: result.error.issues });
      }
      
      const rating = await storage.addRating(result.data);
      res.status(201).json(rating);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit rating" });
    }
  });

  app.get("/api/products/:id/average-rating", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const averageRating = await storage.getAverageRating(productId);
      res.json({ averageRating });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch average rating" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSubmissionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid contact data", issues: result.error.issues });
      }
      
      const submission = await storage.createContactSubmission(result.data);
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product specifications routes
  app.get("/api/product-specs/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const specs = await storage.getProductSpecs(productId);
      res.json(specs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product specs" });
    }
  });

  app.post("/api/product-specs", async (req, res) => {
    try {
      const result = insertProductSpecSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid spec data", issues: result.error.issues });
      }
      
      const spec = await storage.addProductSpec(result.data);
      res.status(201).json(spec);
    } catch (error) {
      res.status(500).json({ error: "Failed to add product spec" });
    }
  });

  // Favorites routes
  app.get("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.body;
      
      if (!productId || isNaN(parseInt(productId))) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const favorite = await storage.addToFavorites(userId, parseInt(productId));
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to favorites" });
    }
  });

  app.delete("/api/favorites/:productId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const success = await storage.removeFromFavorites(userId, productId);
      if (success) {
        res.json({ message: "Removed from favorites" });
      } else {
        res.status(404).json({ error: "Favorite not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from favorites" });
    }
  });

  // Recently viewed routes
  app.get("/api/recently-viewed", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.claims.sub : undefined;
      const sessionId = req.session?.id;
      
      const recentlyViewed = await storage.getRecentlyViewed(userId, sessionId);
      res.json(recentlyViewed);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recently viewed" });
    }
  });

  app.post("/api/recently-viewed", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.claims.sub : undefined;
      const sessionId = req.session?.id || 'anonymous';
      const { productId } = req.body;
      
      if (!productId || isNaN(parseInt(productId))) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const viewed = await storage.addToRecentlyViewed({
        userId,
        sessionId,
        productId: parseInt(productId)
      });
      res.status(201).json(viewed);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to recently viewed" });
    }
  });

  // Product comparison routes
  app.get("/api/comparison", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.claims.sub : undefined;
      const sessionId = req.session?.id || 'anonymous';
      
      const comparison = await storage.getComparison(userId, sessionId);
      res.json(comparison || { productIds: [] });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comparison" });
    }
  });

  app.post("/api/comparison", async (req: any, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.claims.sub : undefined;
      const sessionId = req.session?.id || 'anonymous';
      const { productIds } = req.body;
      
      if (!Array.isArray(productIds) || productIds.length > 3) {
        return res.status(400).json({ error: "Invalid product IDs (max 3 allowed)" });
      }
      
      const comparison = await storage.saveComparison({
        userId,
        sessionId,
        productIds
      });
      res.json(comparison);
    } catch (error) {
      res.status(500).json({ error: "Failed to save comparison" });
    }
  });

  // Enhanced average rating route
  app.get("/api/ratings/average/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const average = await storage.getAverageRating(productId);
      res.json(average);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch average rating" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}