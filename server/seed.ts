import { db } from "./db";
import { categories, products, ratings, type InsertCategory, type InsertProduct, type InsertRating } from "@shared/schema";

async function seed() {
    console.log("Seeding database...");

    try {
        // Check if categories exist
        const existingCategories = await db.select().from(categories).limit(1);
        if (existingCategories.length > 0) {
            console.log("Database already seeded. Skipping.");
            process.exit(0);
        }

        // Insert Categories
        const sampleCategories: InsertCategory[] = [
            { name: "Featured", description: "Our featured products" },
            { name: "New Arrivals", description: "Latest products" },
            { name: "Best Sellers", description: "Most popular items" },
            { name: "Electronics", description: "Electronic devices and accessories" },
            { name: "Home & Garden", description: "Home and garden essentials" },
            { name: "Fashion", description: "Clothing and accessories" },
        ];

        const insertedCategories = await db.insert(categories).values(sampleCategories).returning();
        console.log(`Seeded ${insertedCategories.length} categories`);

        // Insert Products
        const sampleProducts: InsertProduct[] = [
            {
                name: "Premium Wireless Headphones",
                description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
                price: 149.99,
                originalPrice: 199.99,
                category: "Electronics",
                image: "attached_assets/A sleek black pair of premium wireless headphones displayed on a clean white background with soft sh.jpeg",
                tags: ["sale", "wireless", "audio"],
                featured: true,
                inStock: true,
            },
            {
                name: "Smart Home Assistant",
                description: "Voice-controlled smart home assistant with AI capabilities. Control your home devices with simple voice commands.",
                price: 89.99,
                originalPrice: null,
                category: "Electronics",
                image: "attached_assets/Firefly_realistic and clear glow smart speaker on a Highrise table with Seattle night skyline 787022.jpg",
                tags: ["smart", "home", "ai"],
                featured: true,
                inStock: true,
            },
            {
                name: "Professional Camera Kit",
                description: "Complete photography kit for professionals and enthusiasts. Includes camera body, lenses, and accessories.",
                price: 899.99,
                originalPrice: null,
                category: "Electronics",
                image: "attached_assets/Firefly_Professional Camera Kit 664369.jpg",
                tags: ["photography", "professional", "kit"],
                featured: false,
                inStock: true,
            },
            {
                name: "Wireless Phone Charger",
                description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
                price: 39.99,
                originalPrice: 49.99,
                category: "Electronics",
                image: "attached_assets/stock_images/wireless_phone_charg_71473ae2.jpg",
                tags: ["sale", "wireless", "charger"],
                featured: false,
                inStock: true,
            },
            {
                name: "Ergonomic Office Chair",
                description: "Comfortable ergonomic office chair designed for long working hours. Adjustable height and lumbar support.",
                price: 299.99,
                originalPrice: null,
                category: "Home & Garden",
                image: "attached_assets/stock_images/ergonomic_office_cha_b30f2022.jpg",
                tags: ["new", "office", "ergonomic"],
                featured: false,
                inStock: true,
            },
            {
                name: "Minimalist Desk Lamp",
                description: "Sleek and modern desk lamp with adjustable brightness. Perfect for any workspace or bedside table.",
                price: 79.99,
                originalPrice: null,
                category: "Home & Garden",
                image: "attached_assets/minimalist_expensive_desk_lamp_main_attraction_on.jpg",
                tags: ["lighting", "minimalist", "desk"],
                featured: false,
                inStock: true,
            },
            {
                name: "4K Curved Monitor",
                description: "High-resolution curved monitor with professional display quality. Perfect for productivity and creative work.",
                price: 449.99,
                originalPrice: null,
                category: "Electronics",
                image: "attached_assets/minimalist_expensive_desk_with_curved_monitor_that.jpg",
                tags: ["monitor", "display", "productivity"],
                featured: false,
                inStock: true,
            },
            {
                name: "Fitness Tracker",
                description: "Advanced fitness tracker with heart rate monitoring, GPS, and waterproof design. Track your health goals.",
                price: 79.99,
                originalPrice: 99.99,
                category: "Electronics",
                image: "attached_assets/pexels-alesiakozik-6772024.jpg",
                tags: ["sale", "fitness", "health"],
                featured: true,
                inStock: true,
            },
            {
                name: "Luxury Watch",
                description: "Elegant timepiece with premium materials and precision craftsmanship. A perfect accessory for any occasion.",
                price: 459.99,
                originalPrice: null,
                category: "Fashion",
                image: "attached_assets/images/pexels-n-voitkevich-6214476.jpg",
                tags: ["luxury", "watch", "premium"],
                featured: false,
                inStock: true,
            },
            {
                name: "Investment Portfolio Kit",
                description: "Comprehensive guide and tools for building and managing your investment portfolio. Professional strategies for wealth building.",
                price: 199.99,
                originalPrice: null,
                category: "Books & Education",
                image: "attached_assets/stock_images/investment_portfolio_6509782d.jpg",
                tags: ["investment", "finance", "education"],
                featured: false,
                inStock: true,
            }
        ];

        const insertedProducts = await db.insert(products).values(sampleProducts).returning();
        console.log(`Seeded ${insertedProducts.length} products`);

        // Insert Ratings
        const sampleReviews = [
            { productIndex: 0, userName: "Sarah M.", rating: 5, review: "Absolutely amazing headphones! The noise cancellation is incredible." },
            { productIndex: 0, userName: "Mike T.", rating: 4, review: "Great sound quality and comfortable." },
            { productIndex: 1, userName: "Jennifer A.", rating: 5, review: "Transformed our home! Voice recognition is spot-on." },
            { productIndex: 2, userName: "Photography Pro", rating: 5, review: "Professional-grade equipment at an amazing price!" },
            { productIndex: 4, userName: "Office Worker", rating: 5, review: "Best chair I've ever owned. Back pain gone." },
        ];

        const sampleRatings: InsertRating[] = sampleReviews.map(r => ({
            productId: insertedProducts[r.productIndex].id,
            userName: r.userName,
            rating: r.rating,
            review: r.review
        }));

        await db.insert(ratings).values(sampleRatings);
        console.log(`Seeded ratings`);

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed();
