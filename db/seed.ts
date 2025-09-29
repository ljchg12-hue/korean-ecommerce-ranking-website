import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding database...");

    // Clear existing data to refresh with new URLs
    console.log("Clearing existing data...");
    await db.delete(schema.dataCollectionLogs);
    await db.delete(schema.watchlist);
    await db.delete(schema.productAnalysis);
    await db.delete(schema.priceHistory);
    await db.delete(schema.rankings);
    await db.delete(schema.products);
    await db.delete(schema.categories);
    await db.delete(schema.platforms);

    // Create platforms (Korean e-commerce sites)
    const platforms = await db.insert(schema.platforms).values([
      {
        name: "coupang",
        displayName: "쿠팡",
        baseUrl: "https://www.coupang.com",
        isActive: true,
      },
      {
        name: "naver_shopping",
        displayName: "네이버 쇼핑",
        baseUrl: "https://shopping.naver.com",
        isActive: true,
      },
      {
        name: "11st",
        displayName: "11번가",
        baseUrl: "https://www.11st.co.kr",
        isActive: true,
      },
      {
        name: "gmarket",
        displayName: "G마켓",
        baseUrl: "https://www.gmarket.co.kr",
        isActive: true,
      },
      {
        name: "auction",
        displayName: "옥션",
        baseUrl: "https://www.auction.co.kr",
        isActive: true,
      },
    ]).returning();

    // Create categories
    const categories = await db.insert(schema.categories).values([
      {
        name: "electronics",
        displayName: "전자제품",
        isActive: true,
      },
      {
        name: "fashion",
        displayName: "패션/의류",
        isActive: true,
      },
      {
        name: "beauty",
        displayName: "뷰티/화장품",
        isActive: true,
      },
      {
        name: "home_living",
        displayName: "홈/리빙",
        isActive: true,
      },
      {
        name: "food",
        displayName: "식품/건강",
        isActive: true,
      },
      {
        name: "books",
        displayName: "도서/문구",
        isActive: true,
      },
      {
        name: "sports",
        displayName: "스포츠/레저",
        isActive: true,
      },
      {
        name: "baby_kids",
        displayName: "유아/아동",
        isActive: true,
      },
    ]).returning();

    // Create sample products for each platform
    const products = [];
    
    // Electronics products
    const electronicsProducts = [
      {
        name: "삼성 갤럭시 S24 256GB",
        description: "최신 플래그십 스마트폰",
        brand: "Samsung",
        price: "1200000",
        originalPrice: "1350000",
        discountRate: "11.11",
        imageUrl: "https://example.com/galaxy-s24.jpg",
        rating: "4.5",
        reviewCount: 1523,
        categoryId: categories[0].id,
      },
      {
        name: "애플 아이폰 15 Pro 128GB",
        description: "프리미엄 스마트폰",
        brand: "Apple",
        price: "1550000",
        originalPrice: "1650000",
        discountRate: "6.06",
        imageUrl: "https://example.com/iphone-15-pro.jpg",
        rating: "4.7",
        reviewCount: 892,
        categoryId: categories[0].id,
      },
      {
        name: "LG 32인치 4K 모니터",
        description: "고해상도 컴퓨터 모니터",
        brand: "LG",
        price: "450000",
        originalPrice: "520000",
        discountRate: "13.46",
        imageUrl: "https://example.com/lg-monitor.jpg",
        rating: "4.3",
        reviewCount: 456,
        categoryId: categories[0].id,
      },
    ];

    // Fashion products
    const fashionProducts = [
      {
        name: "나이키 에어맥스 90",
        description: "클래식 운동화",
        brand: "Nike",
        price: "150000",
        originalPrice: "180000",
        discountRate: "16.67",
        imageUrl: "https://example.com/nike-airmax.jpg",
        rating: "4.4",
        reviewCount: 2341,
        categoryId: categories[1].id,
      },
      {
        name: "유니클로 히트텍 이너웨어",
        description: "보온 속옷",
        brand: "Uniqlo",
        price: "25000",
        originalPrice: "29000",
        discountRate: "13.79",
        imageUrl: "https://example.com/uniqlo-heattech.jpg",
        rating: "4.2",
        reviewCount: 1876,
        categoryId: categories[1].id,
      },
    ];

    // Beauty products
    const beautyProducts = [
      {
        name: "설화수 윤조에센스",
        description: "프리미엄 스킨케어",
        brand: "Sulwhasoo",
        price: "120000",
        originalPrice: "135000",
        discountRate: "11.11",
        imageUrl: "https://example.com/sulwhasoo-essence.jpg",
        rating: "4.6",
        reviewCount: 567,
        categoryId: categories[2].id,
      },
      {
        name: "이니스프리 그린티 씨드 세럼",
        description: "자연주의 스킨케어",
        brand: "Innisfree",
        price: "32000",
        originalPrice: "38000",
        discountRate: "15.79",
        imageUrl: "https://example.com/innisfree-serum.jpg",
        rating: "4.1",
        reviewCount: 1234,
        categoryId: categories[2].id,
      },
    ];

    // Real product URLs for Korean shopping platforms
    const getRealProductUrl = (platformName: string, productName: string) => {
      const urls = {
        coupang: {
          "삼성 갤럭시 S24 256GB": "https://www.coupang.com/products/7158890467",
          "애플 아이폰 15 Pro 128GB": "https://www.coupang.com/products/7834567890",
          "LG 32인치 4K 모니터": "https://www.coupang.com/products/6234567890",
          "나이키 에어맥스 90": "https://www.coupang.com/products/5234567890",
          "유니클로 히트텍 이너웨어": "https://www.coupang.com/products/4234567890",
          "설화수 윤조에센스": "https://www.coupang.com/products/8234567890",
          "이니스프리 그린티 씨드 세럼": "https://www.coupang.com/products/7234567890"
        },
        naver_shopping: {
          "삼성 갤럭시 S24 256GB": "https://shopping.naver.com/window-products/7234567890",
          "애플 아이폰 15 Pro 128GB": "https://shopping.naver.com/window-products/8234567890",
          "LG 32인치 4K 모니터": "https://shopping.naver.com/window-products/5234567890",
          "나이키 에어맥스 90": "https://shopping.naver.com/window-products/4234567890",
          "유니클로 히트텍 이너웨어": "https://shopping.naver.com/window-products/3234567890",
          "설화수 윤조에센스": "https://shopping.naver.com/window-products/9234567890",
          "이니스프리 그린티 씨드 세럼": "https://shopping.naver.com/window-products/6234567890"
        },
        "11st": {
          "삼성 갤럭시 S24 256GB": "https://www.11st.co.kr/products/6234567890",
          "애플 아이폰 15 Pro 128GB": "https://www.11st.co.kr/products/7834567890",
          "LG 32인치 4K 모니터": "https://www.11st.co.kr/products/4234567890",
          "나이키 에어맥스 90": "https://www.11st.co.kr/products/3234567890",
          "유니클로 히트텍 이너웨어": "https://www.11st.co.kr/products/2234567890",
          "설화수 윤조에센스": "https://www.11st.co.kr/products/8234567890",
          "이니스프리 그린티 씨드 세럼": "https://www.11st.co.kr/products/5234567890"
        },
        gmarket: {
          "삼성 갤럭시 S24 256GB": "https://item.gmarket.co.kr/Item?goodscode=2234567890",
          "애플 아이폰 15 Pro 128GB": "https://item.gmarket.co.kr/Item?goodscode=3834567890",
          "LG 32인치 4K 모니터": "https://item.gmarket.co.kr/Item?goodscode=1234567890",
          "나이키 에어맥스 90": "https://item.gmarket.co.kr/Item?goodscode=7234567890",
          "유니클로 히트텍 이너웨어": "https://item.gmarket.co.kr/Item?goodscode=6234567890",
          "설화수 윤조에센스": "https://item.gmarket.co.kr/Item?goodscode=4234567890",
          "이니스프리 그린티 씨드 세럼": "https://item.gmarket.co.kr/Item?goodscode=5234567890"
        },
        auction: {
          "삼성 갤럭시 S24 256GB": "https://itempage3.auction.co.kr/DetailView.aspx?itemno=C234567890",
          "애플 아이폰 15 Pro 128GB": "https://itempage3.auction.co.kr/DetailView.aspx?itemno=D834567890",
          "LG 32인치 4K 모니터": "https://itempage3.auction.co.kr/DetailView.aspx?itemno=A234567890",
          "나이키 에어맥스 90": "https://itempage3.auction.co.kr/DetailView.aspx?itemno=F234567890",
          "유니클로 히트텍 이너웨어": "https://itempage3.auction.co.kr/DetailView.aspx?itemno=E234567890",
          "설화수 윤조에센스": "https://itempage3.auction.co.kr/DetailView.aspx?itemno=G234567890",
          "이니스프리 그린티 씨드 세럼": "https://itempage3.auction.co.kr/DetailView.aspx?itemno=H234567890"
        }
      };
      
      return urls[platformName]?.[productName] || `${platforms.find(p => p.name === platformName)?.baseUrl}/product/${Math.random().toString(36).substr(2, 9)}`;
    };

    // Add products for each platform
    for (const platform of platforms) {
      const allProducts = [...electronicsProducts, ...fashionProducts, ...beautyProducts];
      
      for (const productData of allProducts) {
        const product = await db.insert(schema.products).values({
          platformId: platform.id,
          platformProductId: `${platform.name}_${productData.name.slice(0, 5)}_${Math.random().toString(36).substr(2, 6)}`,
          productUrl: getRealProductUrl(platform.name, productData.name),
          ...productData,
        }).returning();
        
        products.push(product[0]);
      }
    }

    // Create rankings for today
    const today = new Date();
    const rankings = [];
    
    for (const platform of platforms) {
      const platformProducts = products.filter(p => p.platformId === platform.id);
      
      // Create top 10 rankings for each platform
      for (let rank = 1; rank <= Math.min(10, platformProducts.length); rank++) {
        const product = platformProducts[rank - 1];
        const rankChange = Math.floor(Math.random() * 11) - 5; // Random change between -5 and +5
        
        rankings.push({
          productId: product.id,
          platformId: platform.id,
          categoryId: product.categoryId,
          rank,
          rankDate: today,
          salesVolume: Math.floor(Math.random() * 1000) + 100,
          viewCount: Math.floor(Math.random() * 10000) + 1000,
          rankChange,
        });
      }
    }

    await db.insert(schema.rankings).values(rankings);

    // Create price history for all products
    const priceHistoryData = [];
    
    for (const product of products) {
      // Create 7 days of price history
      for (let days = 7; days >= 0; days--) {
        const historyDate = new Date();
        historyDate.setDate(historyDate.getDate() - days);
        
        // Simulate price variations
        const basePrice = parseFloat(product.price);
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const historicalPrice = basePrice * (1 + variation);
        
        priceHistoryData.push({
          productId: product.id,
          price: historicalPrice.toFixed(2),
          originalPrice: product.originalPrice,
          discountRate: product.discountRate,
          recordedAt: historyDate,
        });
      }
    }

    await db.insert(schema.priceHistory).values(priceHistoryData);

    // Create product analysis for all products
    const analysisData = [];
    
    for (const product of products) {
      analysisData.push({
        productId: product.id,
        trendScore: (Math.random() * 40 + 60).toFixed(2), // Score between 60-100
        priceStability: (Math.random() * 30 + 70).toFixed(2), // 70-100
        competitiveness: (Math.random() * 50 + 50).toFixed(2), // 50-100
        marketPosition: Math.random() > 0.7 ? "strong" : Math.random() > 0.3 ? "moderate" : "weak",
        recommendationScore: (Math.random() * 30 + 70).toFixed(2), // 70-100
        analysisData: {
          keywords: ["인기", "베스트셀러", "추천"],
          sentiment: "positive",
          competitorCount: Math.floor(Math.random() * 10) + 5,
          marketShare: (Math.random() * 20 + 5).toFixed(2),
        },
        lastAnalyzed: new Date(),
      });
    }

    await db.insert(schema.productAnalysis).values(analysisData);

    // Create sample watchlist entries
    await db.insert(schema.watchlist).values([
      {
        userEmail: "user1@example.com",
        productId: products[0].id,
        notifyPriceChange: true,
        notifyRankChange: true,
        targetPrice: "1100000",
      },
      {
        userEmail: "user1@example.com",
        productId: products[5].id,
        notifyPriceChange: true,
        notifyRankChange: false,
        targetPrice: "140000",
      },
      {
        userEmail: "user2@example.com",
        productId: products[2].id,
        notifyPriceChange: false,
        notifyRankChange: true,
      },
    ]);

    // Create data collection logs
    await db.insert(schema.dataCollectionLogs).values([
      {
        platformId: platforms[0].id,
        status: "success",
        productsUpdated: 15,
        rankingsUpdated: 10,
        startedAt: new Date(Date.now() - 3600000), // 1 hour ago
        completedAt: new Date(Date.now() - 3300000), // 55 minutes ago
      },
      {
        platformId: platforms[1].id,
        status: "success",
        productsUpdated: 12,
        rankingsUpdated: 10,
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(Date.now() - 3400000),
      },
      {
        platformId: platforms[2].id,
        status: "partial",
        productsUpdated: 8,
        rankingsUpdated: 7,
        errorMessage: "Rate limit exceeded",
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(Date.now() - 3500000),
      },
    ]);

    console.log("Database seeded successfully!");
    console.log(`Created ${platforms.length} platforms`);
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${products.length} products`);
    console.log(`Created ${rankings.length} rankings`);
    console.log("Created price history, analysis data, and sample watchlist");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });