import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, TrendingUp, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "연동 쇼핑몰",
      value: stats?.totalPlatforms || 0,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "등록 상품",
      value: (stats?.totalProducts || 0).toLocaleString(),
      icon: Package,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "오늘 순위 업데이트",
      value: stats?.todayRankings || 0,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "상품 카테고리",
      value: stats?.totalCategories || 0,
      icon: Database,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
