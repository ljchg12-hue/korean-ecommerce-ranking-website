import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Heart, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function QuickActions() {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          빠른 실행
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/products">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <Search className="mr-2 w-4 h-4" />
            상품 검색
          </Button>
        </Link>
        
        <Link href="/rankings">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <TrendingUp className="mr-2 w-4 h-4" />
            실시간 순위 보기
          </Button>
        </Link>
        
        <Link href="/watchlist">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <Heart className="mr-2 w-4 h-4" />
            관심상품 관리
          </Button>
        </Link>
        
        <Link href="/analysis">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <BarChart3 className="mr-2 w-4 h-4" />
            상품 분석 보기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
