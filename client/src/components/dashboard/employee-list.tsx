import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WatchlistTable() {
  const { data: watchlist, isLoading } = useQuery({
    queryKey: ["/api/watchlist"],
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>관심 상품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span>관심 상품</span>
        </CardTitle>
        <Button variant="link" className="text-blue-600">
          전체 보기
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  현재 가격
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  목표 가격
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  변동률
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  알림
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  링크
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist?.slice(0, 5).map((item: any) => {
                const currentPrice = parseFloat(item.currentPrice || item.price || "0");
                const targetPrice = parseFloat(item.targetPrice || "0");
                const priceChange = targetPrice > 0 ? ((currentPrice - targetPrice) / targetPrice * 100) : 0;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <div className="text-gray-400 text-xs">이미지</div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {item.productName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.platform || "알 수 없음"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-900">
                      ₩{currentPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {targetPrice > 0 ? `₩${targetPrice.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      {targetPrice > 0 && (
                        <div className="flex items-center">
                          {priceChange > 0 ? (
                            <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                          ) : priceChange < 0 ? (
                            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                          ) : null}
                          <span className={`text-sm font-medium ${
                            priceChange > 0 ? "text-red-600" : 
                            priceChange < 0 ? "text-green-600" : "text-gray-600"
                          }`}>
                            {priceChange > 0 ? "+" : ""}{priceChange.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {item.notifyPriceChange && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            가격 알림
                          </Badge>
                        )}
                        {item.notifyRankChange && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            순위 알림
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.productUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.productUrl, '_blank')}
                          className="p-1 h-auto"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {(!watchlist || watchlist.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>관심 상품이 없습니다.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
