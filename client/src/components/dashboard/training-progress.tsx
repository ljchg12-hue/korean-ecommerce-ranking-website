import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingProduct {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  discountRate?: string;
  imageUrl?: string;
  productUrl: string;
  rating?: string;
  reviewCount?: number;
  platformName: string;
  brand?: string;
  rank: number;
  rankChange?: number;
}

export default function TrendingProducts() {
  const { data: products, isLoading } = useQuery<TrendingProduct[]>({
    queryKey: ['/api/products/trending'],
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>급상승 상품</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span>급상승 상품</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products?.slice(0, 6).map((product, index) => (
            <div key={product.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              {/* Product Image */}
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-gray-400 text-xs">이미지</div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{product.platformName}</span>
                  {product.brand && (
                    <>
                      <span>•</span>
                      <span>{product.brand}</span>
                    </>
                  )}
                </div>
                
                {product.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">
                      {product.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Price and Rank Change */}
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  ₩{parseInt(product.price).toLocaleString()}
                </div>
                
                {product.originalPrice && product.discountRate && (
                  <div className="text-xs text-gray-500">
                    <span className="line-through">
                      ₩{parseInt(product.originalPrice).toLocaleString()}
                    </span>
                  </div>
                )}

                {product.rankChange && product.rankChange < 0 && (
                  <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                    ↑{Math.abs(product.rankChange)}위 상승
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {(!products || products.length === 0) && !isLoading && (
          <div className="text-center py-4 text-gray-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>급상승 상품이 없습니다.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
