import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { getTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/dashboard/activities"],
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>최근 랭킹 변동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "rank_up":
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case "rank_down":
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      case "price_change":
        return <RefreshCw className="w-3 h-3 text-blue-600" />;
      case "new_product":
        return <Package className="w-3 h-3 text-purple-600" />;
      default:
        return <RefreshCw className="w-3 h-3 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "rank_up":
        return "bg-green-100";
      case "rank_down":
        return "bg-red-100";
      case "price_change":
        return "bg-blue-100";
      case "new_product":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.activityType) {
      case "rank_up":
        return `${activity.productName}이(가) ${activity.platform}에서 ${Math.abs(activity.rankChange)}위 상승`;
      case "rank_down":
        return `${activity.productName}이(가) ${activity.platform}에서 ${Math.abs(activity.rankChange)}위 하락`;
      case "price_change":
        return `${activity.productName} 가격이 ${activity.priceChange}% 변동`;
      case "new_product":
        return `새 상품 ${activity.productName}이(가) ${activity.platform}에 추가됨`;
      default:
        return `${activity.productName} 업데이트됨`;
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          최근 랭킹 변동
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities?.map((activity: any) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.activityType)}`}>
                  {getActivityIcon(activity.activityType)}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-gray-500">
                  {getTimeAgo(activity.updatedAt)}
                </p>
              </div>
            </div>
          ))}
          
          {(!activities || activities.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              최근 활동이 없습니다
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
