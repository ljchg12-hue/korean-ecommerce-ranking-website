import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// 쇼핑몰 플랫폼 정보
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Coupang, Naver Shopping, Alibaba, 11st, Gmarket
  displayName: text("display_name").notNull(),
  baseUrl: text("base_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 상품 카테고리
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  parentId: integer("parent_id").references(() => categories.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 상품 정보
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").references(() => platforms.id).notNull(),
  platformProductId: text("platform_product_id").notNull(), // 각 플랫폼의 상품 ID
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  brand: text("brand"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 12, scale: 2 }),
  discountRate: decimal("discount_rate", { precision: 5, scale: 2 }),
  imageUrl: text("image_url"),
  productUrl: text("product_url").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 판매 순위 데이터
export const rankings = pgTable("rankings", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  platformId: integer("platform_id").references(() => platforms.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  rank: integer("rank").notNull(),
  rankDate: timestamp("rank_date").notNull(),
  salesVolume: integer("sales_volume"), // 판매량 (추정)
  viewCount: integer("view_count"), // 조회수
  rankChange: integer("rank_change"), // 순위 변동 (전일 대비)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 가격 히스토리
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 12, scale: 2 }),
  discountRate: decimal("discount_rate", { precision: 5, scale: 2 }),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// 상품 분석 결과
export const productAnalysis = pgTable("product_analysis", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  trendScore: decimal("trend_score", { precision: 5, scale: 2 }), // 트렌드 점수 (0-100)
  priceStability: decimal("price_stability", { precision: 5, scale: 2 }), // 가격 안정성
  competitiveness: decimal("competitiveness", { precision: 5, scale: 2 }), // 경쟁력 점수
  marketPosition: text("market_position"), // strong, moderate, weak
  recommendationScore: decimal("recommendation_score", { precision: 5, scale: 2 }),
  analysisData: jsonb("analysis_data"), // 상세 분석 데이터 (JSON)
  lastAnalyzed: timestamp("last_analyzed").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 사용자 관심 상품 (선택사항)
export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userEmail: text("user_email").notNull(), // 간단한 사용자 식별용
  productId: integer("product_id").references(() => products.id).notNull(),
  notifyPriceChange: boolean("notify_price_change").default(false),
  notifyRankChange: boolean("notify_rank_change").default(false),
  targetPrice: decimal("target_price", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 데이터 수집 로그
export const dataCollectionLogs = pgTable("data_collection_logs", {
  id: serial("id").primaryKey(),
  platformId: integer("platform_id").references(() => platforms.id).notNull(),
  status: text("status").notNull(), // success, failed, partial
  productsUpdated: integer("products_updated").default(0),
  rankingsUpdated: integer("rankings_updated").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const platformsRelations = relations(platforms, ({ many }) => ({
  products: many(products),
  rankings: many(rankings),
  dataCollectionLogs: many(dataCollectionLogs),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  children: many(categories, { relationName: "categoryChildren" }),
  products: many(products),
  rankings: many(rankings),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  platform: one(platforms, { fields: [products.platformId], references: [platforms.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  rankings: many(rankings),
  priceHistory: many(priceHistory),
  analysis: many(productAnalysis),
  watchlistEntries: many(watchlist),
}));

export const rankingsRelations = relations(rankings, ({ one }) => ({
  product: one(products, { fields: [rankings.productId], references: [products.id] }),
  platform: one(platforms, { fields: [rankings.platformId], references: [platforms.id] }),
  category: one(categories, { fields: [rankings.categoryId], references: [categories.id] }),
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  product: one(products, { fields: [priceHistory.productId], references: [products.id] }),
}));

export const productAnalysisRelations = relations(productAnalysis, ({ one }) => ({
  product: one(products, { fields: [productAnalysis.productId], references: [products.id] }),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  product: one(products, { fields: [watchlist.productId], references: [products.id] }),
}));

export const dataCollectionLogsRelations = relations(dataCollectionLogs, ({ one }) => ({
  platform: one(platforms, { fields: [dataCollectionLogs.platformId], references: [platforms.id] }),
}));

// Insert Schemas
export const platformsInsertSchema = createInsertSchema(platforms);
export const categoriesInsertSchema = createInsertSchema(categories);
export const productsInsertSchema = createInsertSchema(products);
export const rankingsInsertSchema = createInsertSchema(rankings);
export const priceHistoryInsertSchema = createInsertSchema(priceHistory);

export const productAnalysisInsertSchema = createInsertSchema(productAnalysis);
export const watchlistInsertSchema = createInsertSchema(watchlist);
export const dataCollectionLogsInsertSchema = createInsertSchema(dataCollectionLogs);

// Select Schemas
export const platformsSelectSchema = createSelectSchema(platforms);
export const categoriesSelectSchema = createSelectSchema(categories);
export const productsSelectSchema = createSelectSchema(products);
export const rankingsSelectSchema = createSelectSchema(rankings);
export const priceHistorySelectSchema = createSelectSchema(priceHistory);
export const productAnalysisSelectSchema = createSelectSchema(productAnalysis);
export const watchlistSelectSchema = createSelectSchema(watchlist);
export const dataCollectionLogsSelectSchema = createSelectSchema(dataCollectionLogs);

// Types
export type Platform = z.infer<typeof platformsSelectSchema>;
export type PlatformInsert = z.infer<typeof platformsInsertSchema>;
export type Category = z.infer<typeof categoriesSelectSchema>;
export type CategoryInsert = z.infer<typeof categoriesInsertSchema>;
export type Product = z.infer<typeof productsSelectSchema>;
export type ProductInsert = z.infer<typeof productsInsertSchema>;
export type Ranking = z.infer<typeof rankingsSelectSchema>;
export type RankingInsert = z.infer<typeof rankingsInsertSchema>;
export type PriceHistory = z.infer<typeof priceHistorySelectSchema>;
export type PriceHistoryInsert = z.infer<typeof priceHistoryInsertSchema>;
export type ProductAnalysis = z.infer<typeof productAnalysisSelectSchema>;
export type ProductAnalysisInsert = z.infer<typeof productAnalysisInsertSchema>;
export type Watchlist = z.infer<typeof watchlistSelectSchema>;
export type WatchlistInsert = z.infer<typeof watchlistInsertSchema>;
export type DataCollectionLog = z.infer<typeof dataCollectionLogsSelectSchema>;
export type DataCollectionLogInsert = z.infer<typeof dataCollectionLogsInsertSchema>;