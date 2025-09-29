import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, count, sql, asc } from "drizzle-orm";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiPrefix = "/api";

  // Dashboard stats endpoint
  app.get(`${apiPrefix}/dashboard/stats`, async (req, res) => {
    try {
      const totalPlatforms = await db
        .select({ count: count() })
        .from(schema.platforms)
        .where(eq(schema.platforms.isActive, true));

      const totalProducts = await db
        .select({ count: count() })
        .from(schema.products)
        .where(eq(schema.products.isAvailable, true));

      const todayRankings = await db
        .select({ count: count() })
        .from(schema.rankings)
        .where(sql`DATE(${schema.rankings.rankDate}) = CURRENT_DATE`);

      const totalCategories = await db
        .select({ count: count() })
        .from(schema.categories)
        .where(eq(schema.categories.isActive, true));

      res.json({
        totalPlatforms: totalPlatforms[0].count,
        totalProducts: totalProducts[0].count,
        todayRankings: todayRankings[0].count,
        totalCategories: totalCategories[0].count,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Top rankings across all platforms with filters
  app.get(`${apiPrefix}/rankings/top`, async (req, res) => {
    try {
      const { platform, category } = req.query;
      
      let query = db
        .select({
          rank: schema.rankings.rank,
          productName: schema.products.name,
          platformName: schema.platforms.displayName,
          price: schema.products.price,
          originalPrice: schema.products.originalPrice,
          discountRate: schema.products.discountRate,
          imageUrl: schema.products.imageUrl,
          productUrl: schema.products.productUrl,
          rating: schema.products.rating,
          reviewCount: schema.products.reviewCount,
          rankChange: schema.rankings.rankChange,
          salesVolume: schema.rankings.salesVolume,
        })
        .from(schema.rankings)
        .innerJoin(schema.products, eq(schema.rankings.productId, schema.products.id))
        .innerJoin(schema.platforms, eq(schema.rankings.platformId, schema.platforms.id));

      // Build where conditions
      const conditions = [
        sql`DATE(${schema.rankings.rankDate}) = CURRENT_DATE`,
        sql`${schema.rankings.rank} <= 10`
      ];

      // Add platform filter
      if (platform && typeof platform === 'string' && platform !== 'all_platforms') {
        conditions.push(eq(schema.platforms.name, platform));
      }

      // Add category filter
      if (category && typeof category === 'string' && category !== 'all_categories') {
        const categoryId = parseInt(category);
        if (!isNaN(categoryId)) {
          conditions.push(eq(schema.products.categoryId, categoryId));
        }
      }

      const topRankings = await query
        .where(and(...conditions))
        .orderBy(asc(schema.rankings.rank))
        .limit(50);

      res.json(topRankings);
    } catch (error) {
      console.error("Error fetching top rankings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Rankings by platform
  app.get(`${apiPrefix}/rankings/platform/:platformId`, async (req, res) => {
    try {
      const platformId = parseInt(req.params.platformId);
      
      const rankings = await db
        .select({
          rank: schema.rankings.rank,
          productName: schema.products.name,
          price: schema.products.price,
          originalPrice: schema.products.originalPrice,
          discountRate: schema.products.discountRate,
          imageUrl: schema.products.imageUrl,
          productUrl: schema.products.productUrl,
          rating: schema.products.rating,
          reviewCount: schema.products.reviewCount,
          rankChange: schema.rankings.rankChange,
          salesVolume: schema.rankings.salesVolume,
          brand: schema.products.brand,
        })
        .from(schema.rankings)
        .innerJoin(schema.products, eq(schema.rankings.productId, schema.products.id))
        .where(
          and(
            eq(schema.rankings.platformId, platformId),
            sql`DATE(${schema.rankings.rankDate}) = CURRENT_DATE`,
            sql`${schema.rankings.rank} <= 10`
          )
        )
        .orderBy(asc(schema.rankings.rank));

      res.json(rankings);
    } catch (error) {
      console.error("Error fetching platform rankings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all platforms
  app.get(`${apiPrefix}/platforms`, async (req, res) => {
    try {
      const platforms = await db
        .select()
        .from(schema.platforms)
        .where(eq(schema.platforms.isActive, true))
        .orderBy(asc(schema.platforms.displayName));

      res.json(platforms);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all categories
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.isActive, true))
        .orderBy(asc(schema.categories.displayName));

      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Product analysis endpoint
  app.get(`${apiPrefix}/products/:productId/analysis`, async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      
      const analysis = await db
        .select()
        .from(schema.productAnalysis)
        .where(eq(schema.productAnalysis.productId, productId))
        .orderBy(desc(schema.productAnalysis.lastAnalyzed))
        .limit(1);

      if (analysis.length === 0) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis[0]);
    } catch (error) {
      console.error("Error fetching product analysis:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Price history endpoint
  app.get(`${apiPrefix}/products/:productId/price-history`, async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      
      const priceHistory = await db
        .select()
        .from(schema.priceHistory)
        .where(eq(schema.priceHistory.productId, productId))
        .orderBy(desc(schema.priceHistory.recordedAt))
        .limit(30); // Last 30 records

      res.json(priceHistory);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Search products
  app.get(`${apiPrefix}/products/search`, async (req, res) => {
    try {
      const { q, platform, category, limit = 20 } = req.query;
      
      let query = db
        .select({
          id: schema.products.id,
          name: schema.products.name,
          price: schema.products.price,
          originalPrice: schema.products.originalPrice,
          discountRate: schema.products.discountRate,
          imageUrl: schema.products.imageUrl,
          productUrl: schema.products.productUrl,
          rating: schema.products.rating,
          reviewCount: schema.products.reviewCount,
          platformName: schema.platforms.displayName,
          brand: schema.products.brand,
        })
        .from(schema.products)
        .innerJoin(schema.platforms, eq(schema.products.platformId, schema.platforms.id));

      const conditions = [eq(schema.products.isAvailable, true)];

      if (q && typeof q === 'string') {
        conditions.push(sql`${schema.products.name} ILIKE ${'%' + q + '%'}`);
      }

      if (platform && typeof platform === 'string' && platform !== 'all_platforms') {
        conditions.push(eq(schema.platforms.name, platform));
      }

      if (category && typeof category === 'string') {
        const categoryId = parseInt(category);
        if (!isNaN(categoryId)) {
          conditions.push(eq(schema.products.categoryId, categoryId));
        }
      }

      const products = await query
        .where(and(...conditions))
        .limit(parseInt(limit as string))
        .orderBy(desc(schema.products.lastUpdated));

      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get trending products (products with positive rank changes)
  app.get(`${apiPrefix}/products/trending`, async (req, res) => {
    try {
      const trendingProducts = await db
        .select({
          id: schema.products.id,
          name: schema.products.name,
          price: schema.products.price,
          originalPrice: schema.products.originalPrice,
          discountRate: schema.products.discountRate,
          imageUrl: schema.products.imageUrl,
          productUrl: schema.products.productUrl,
          rating: schema.products.rating,
          reviewCount: schema.products.reviewCount,
          platformName: schema.platforms.displayName,
          brand: schema.products.brand,
          rank: schema.rankings.rank,
          rankChange: schema.rankings.rankChange,
        })
        .from(schema.products)
        .innerJoin(schema.platforms, eq(schema.products.platformId, schema.platforms.id))
        .innerJoin(schema.rankings, eq(schema.products.id, schema.rankings.productId))
        .where(
          and(
            eq(schema.products.isAvailable, true),
            sql`DATE(${schema.rankings.rankDate}) = CURRENT_DATE`,
            sql`${schema.rankings.rankChange} < 0` // Negative rank change means going up in ranking
          )
        )
        .orderBy(asc(schema.rankings.rankChange))
        .limit(20);

      res.json(trendingProducts);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add to watchlist
  app.post(`${apiPrefix}/watchlist`, async (req, res) => {
    try {
      const { userEmail, productId, notifyPriceChange, notifyRankChange, targetPrice } = req.body;
      
      const watchlistItem = await db
        .insert(schema.watchlist)
        .values({
          userEmail,
          productId: parseInt(productId),
          notifyPriceChange: notifyPriceChange || false,
          notifyRankChange: notifyRankChange || false,
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        })
        .returning();

      res.status(201).json(watchlistItem[0]);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get user's watchlist
  app.get(`${apiPrefix}/watchlist/:userEmail`, async (req, res) => {
    try {
      const { userEmail } = req.params;
      
      const watchlistItems = await db
        .select({
          id: schema.watchlist.id,
          productName: schema.products.name,
          productPrice: schema.products.price,
          targetPrice: schema.watchlist.targetPrice,
          notifyPriceChange: schema.watchlist.notifyPriceChange,
          notifyRankChange: schema.watchlist.notifyRankChange,
          platformName: schema.platforms.displayName,
          imageUrl: schema.products.imageUrl,
          productUrl: schema.products.productUrl,
          createdAt: schema.watchlist.createdAt,
        })
        .from(schema.watchlist)
        .innerJoin(schema.products, eq(schema.watchlist.productId, schema.products.id))
        .innerJoin(schema.platforms, eq(schema.products.platformId, schema.platforms.id))
        .where(eq(schema.watchlist.userEmail, userEmail))
        .orderBy(desc(schema.watchlist.createdAt));

      res.json(watchlistItems);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Platform comparison - compare rankings across platforms
  app.get(`${apiPrefix}/compare/platforms`, async (req, res) => {
    try {
      const comparison = await db
        .select({
          platformName: schema.platforms.displayName,
          totalProducts: count(schema.products.id),
          avgPrice: sql<number>`AVG(${schema.products.price})`,
          topRankProduct: sql<string>`MIN(${schema.products.name}) FILTER (WHERE ${schema.rankings.rank} = 1)`,
        })
        .from(schema.platforms)
        .leftJoin(schema.products, eq(schema.platforms.id, schema.products.platformId))
        .leftJoin(schema.rankings, 
          and(
            eq(schema.products.id, schema.rankings.productId),
            sql`DATE(${schema.rankings.rankDate}) = CURRENT_DATE`
          )
        )
        .where(eq(schema.platforms.isActive, true))
        .groupBy(schema.platforms.id, schema.platforms.displayName);

      res.json(comparison);
    } catch (error) {
      console.error("Error fetching platform comparison:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get product analysis
  app.get(`${apiPrefix}/products/:id/analysis`, async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const analysis = await db.query.productAnalysis.findFirst({
        where: eq(schema.productAnalysis.productId, productId),
      });

      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Error fetching product analysis:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get product price history
  app.get(`${apiPrefix}/products/:id/price-history`, async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const priceHistory = await db.query.priceHistory.findMany({
        where: eq(schema.priceHistory.productId, productId),
        orderBy: desc(schema.priceHistory.recordedAt),
        limit: 30, // Last 30 records
      });

      res.json(priceHistory);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all watchlist items (general endpoint)
  app.get(`${apiPrefix}/watchlist`, async (req, res) => {
    try {
      const watchlistItems = await db
        .select({
          id: schema.watchlist.id,
          productId: schema.watchlist.productId,
          productName: schema.products.name,
          currentPrice: schema.products.price,
          targetPrice: schema.watchlist.targetPrice,
          platformName: schema.platforms.displayName,
          notifyPriceChange: schema.watchlist.notifyPriceChange,
          notifyRankChange: schema.watchlist.notifyRankChange,
          createdAt: schema.watchlist.createdAt,
        })
        .from(schema.watchlist)
        .innerJoin(schema.products, eq(schema.watchlist.productId, schema.products.id))
        .innerJoin(schema.platforms, eq(schema.products.platformId, schema.platforms.id))
        .orderBy(desc(schema.watchlist.createdAt));
      
      res.json(watchlistItems);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}