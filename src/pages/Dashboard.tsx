import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { walletAPI, tradingAPI, marketsAPI } from "@/services/api";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LogoIcon from "@/components/LogoIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topMarkets, setTopMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, ordersRes, marketsRes] = await Promise.all([
        walletAPI.getWalletSummary(),
        tradingAPI.getUserOrders({ status: "open" }),
        marketsAPI.getTopGainers(),
      ]);
      setSummary(summaryRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
      setTopMarkets(marketsRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      title: "Saved Value",
      value: `$${summary?.totalBalance?.toLocaleString() || "0.00"}`,
      icon: Wallet,
      change: "+12.5%",
      positive: true,
      description: "From last month",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Inquiries Sent",
      value: summary?.totalProfitLoss != null ? String(Math.round(summary.totalProfitLoss)) : "0",
      icon: TrendingUp,
      change: "+8.2%",
      positive: true,
      description: "This month",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Open Inquiries",
      value: recentOrders.length.toString(),
      icon: Activity,
      change: "3 pending",
      positive: null,
      description: "Awaiting response",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Views Today",
      value: `${summary?.dailyVolume?.toLocaleString() || "0"}`,
      icon: DollarSign,
      change: "+15.3%",
      positive: true,
      description: "Last 24 hours",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back! 👋</h1>
            {user?.isDemo && (
              <Badge className="bg-blue-500/10 text-blue-400/80 border-blue-500/20">
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Here's your property dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all duration-300 overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardContent className="pt-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  {stat.positive !== null && (
                    <Badge
                      variant={stat.positive ? "default" : "destructive"}
                      className={
                        stat.positive
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : "bg-red-500/20 text-red-400 border-red-500/50"
                      }
                    >
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2 font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground text-xs">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Markets */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-foreground flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span>Featured Listings</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100"
                onClick={() => navigate("/listings")}
              >
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topMarkets.map((market, idx) => (
                  <div
                    key={market.pair}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200"
                    onClick={() => navigate(`/property?pair=${encodeURIComponent(market.pair)}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <LogoIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-foreground font-semibold text-base">{market.pair}</p>
                        <p className="text-muted-foreground text-sm">${market.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {market.priceChangePercent24h?.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-foreground flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span>Recent Inquiries</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100"
                onClick={() => navigate("/property")}
              >
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-1 font-medium">No open inquiries</p>
                  <p className="text-muted-foreground text-sm mb-4">Send an inquiry from a listing to see it here</p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                    onClick={() => navigate("/listings")}
                  >
                    Browse Listings
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all duration-200"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={order.type === "buy" ? "default" : "destructive"}
                            className={
                              order.type === "buy"
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : "bg-red-500/20 text-red-400 border-red-500/50"
                            }
                          >
                            Inquiry
                          </Badge>
                          <span className="text-foreground font-semibold text-base">{order.pair}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Listed ${order.price}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10">
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => navigate("/listings")}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Browse Listings
              </Button>
              <Button
                onClick={() => navigate("/saved")}
                variant="outline"
                className="border-slate-300 text-foreground hover:bg-slate-100 hover:border-slate-400 py-6 rounded-xl transition-all duration-200"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Saved Listings
              </Button>
              <Button
                onClick={() => navigate("/property")}
                variant="outline"
                className="border-slate-300 text-foreground hover:bg-slate-100 hover:border-slate-400 py-6 rounded-xl transition-all duration-200"
              >
                <Activity className="w-5 h-5 mr-2" />
                Property Details
              </Button>
              <Button
                onClick={() => navigate("/saved")}
                variant="outline"
                className="border-slate-300 text-foreground hover:bg-slate-100 hover:border-slate-400 py-6 rounded-xl transition-all duration-200"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Inquiry History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

