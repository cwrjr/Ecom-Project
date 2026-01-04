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
import { setupAuth, isAuthenticated, isAdmin } from "./auth";

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

  // Admin only - product management
  app.post("/api/products", isAdmin, async (req, res) => {
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

  app.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const result = insertProductSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid product data", issues: result.error.issues });
      }

      const product = await storage.updateProduct(id, result.data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
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

  // Orders routes - protected (user must be logged in)
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const result = insertOrderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid order data", issues: result.error.issues });
      }

      // Security: Override userId with authenticated user to prevent forged ownership
      const userId = req.user.claims.sub;
      const orderData = { ...result.data, userId };

      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
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

  // Ratings - protected (user must be logged in to rate)
  app.post("/api/products/:id/ratings", isAuthenticated, async (req, res) => {
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

  // AI Routes
  const { generateEmbedding, cosineSimilarity, generateSEOMeta, chatWithAI, compareProducts, semanticSearch } = await import("./openai");

  // AI Product Recommendations
  app.get("/api/recommendations/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      let targetEmbedding = await storage.getProductEmbedding(productId);
      if (!targetEmbedding) {
        const embeddingVector = await generateEmbedding(`${product.name} ${product.description}`);
        targetEmbedding = await storage.saveProductEmbedding({
          productId,
          embedding: embeddingVector,
        });
      }

      const allEmbeddings = await storage.getAllProductEmbeddings();
      const similarities = allEmbeddings
        .filter(e => e.productId !== productId)
        .map(e => ({
          productId: e.productId,
          similarity: cosineSimilarity(targetEmbedding!.embedding, e.embedding),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      const recommendedProducts = await Promise.all(
        similarities.map(async s => {
          const p = await storage.getProduct(s.productId);
          return p;
        })
      );

      res.json(recommendedProducts.filter(p => p !== undefined));
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  // Semantic AI Search
  app.get("/api/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Search query required" });
      }

      const allEmbeddings = await storage.getAllProductEmbeddings();

      if (allEmbeddings.length === 0) {
        const products = await storage.getProducts();
        for (const product of products) {
          const embeddingVector = await generateEmbedding(`${product.name} ${product.description}`);
          await storage.saveProductEmbedding({
            productId: product.id,
            embedding: embeddingVector,
          });
        }
        const newEmbeddings = await storage.getAllProductEmbeddings();
        const results = await semanticSearch(query, newEmbeddings, 0.3);
        const rankedProducts = await Promise.all(
          results.map(async r => await storage.getProduct(r.productId))
        );
        return res.json(rankedProducts.filter(p => p !== undefined));
      }

      const results = await semanticSearch(query, allEmbeddings, 0.3);
      const rankedProducts = await Promise.all(
        results.map(async r => await storage.getProduct(r.productId))
      );
      res.json(rankedProducts.filter(p => p !== undefined));
    } catch (error) {
      console.error("Error in semantic search:", error);
      res.status(500).json({ error: "Failed to perform search" });
    }
  });

  // Generate SEO Meta for Product
  app.post("/api/seo/generate/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existing = await storage.getSEOMeta(productId);
      if (existing) {
        return res.json(existing);
      }

      const meta = await generateSEOMeta(product.name, product.description);
      const saved = await storage.saveSEOMeta({
        productId,
        metaTitle: meta.metaTitle,
        metaDescription: meta.metaDescription,
        generatedBy: "gpt-5",
      });

      res.json(saved);
    } catch (error) {
      console.error("Error generating SEO meta:", error);
      res.status(500).json({ error: "Failed to generate SEO meta" });
    }
  });

  // Get SEO Meta for Product
  app.get("/api/seo/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const meta = await storage.getSEOMeta(productId);
      res.json(meta || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SEO meta" });
    }
  });

  // AI Support Chatbot
  app.post("/api/support", async (req: any, res) => {
    try {
      const sessionId = req.session?.id || 'anonymous';
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message required" });
      }

      await storage.saveChatMessage({
        sessionId,
        role: 'user',
        content: message,
      });

      const history = await storage.getChatMessages(sessionId);
      const messages = history.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      }));

      const knowledgeBase = `
**Trellis E-commerce Store**

Shipping & Returns:
- Free shipping on orders over $50
- Standard shipping takes 3-5 business days
- 30-day return policy on most items
- Return items in original packaging

Payment:
- We accept all major credit cards
- Secure checkout with SSL encryption
- Order confirmation sent via email

Customer Support:
- Email: support@trellis.com
- Live chat available Mon-Fri 9am-6pm EST
- FAQ section available on our website
`;

      const response = await chatWithAI(messages, knowledgeBase);

      await storage.saveChatMessage({
        sessionId,
        role: 'assistant',
        content: response,
      });

      res.json({ response });
    } catch (error) {
      console.error("Error in support chat:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // Get Chat History
  app.get("/api/support/history", async (req: any, res) => {
    try {
      const sessionId = req.session?.id || 'anonymous';
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // AI Product Comparison
  app.post("/api/compare", async (req, res) => {
    try {
      const { productIds } = req.body;

      if (!Array.isArray(productIds) || productIds.length < 2 || productIds.length > 3) {
        return res.status(400).json({ error: "Please provide 2-3 product IDs to compare" });
      }

      const products = await Promise.all(
        productIds.map(async (id: number) => await storage.getProduct(id))
      );

      if (products.some(p => !p)) {
        return res.status(404).json({ error: "One or more products not found" });
      }

      const comparison = await compareProducts(
        products.filter(p => p !== undefined).map(p => ({
          name: p!.name,
          description: p!.description,
          price: p!.price,
          category: p!.category,
        }))
      );

      res.json({ comparison });
    } catch (error) {
      console.error("Error comparing products:", error);
      res.status(500).json({ error: "Failed to compare products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}