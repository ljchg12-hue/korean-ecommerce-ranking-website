import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  Trophy, 
  ShoppingCart, 
  Search, 
  TrendingUp, 
  Heart,
  BarChart3,
  User
} from "lucide-react";

const navigation = [
  { name: "대시보드", href: "/", icon: ChartLine },
  { name: "실시간 순위", href: "/rankings", icon: Trophy },
  { name: "쇼핑몰 플랫폼", href: "/platforms", icon: ShoppingCart },
  { name: "상품 검색", href: "/products", icon: Search },
  { name: "상품 분석", href: "/analysis", icon: TrendingUp },
  { name: "관심상품", href: "/watchlist", icon: Heart },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white w-4 h-4" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">쇼핑랭킹</h1>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex-shrink-0 p-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="text-gray-600 w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">분석가</p>
                  <p className="text-xs text-gray-500">쇼핑 트렌드 분석</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
