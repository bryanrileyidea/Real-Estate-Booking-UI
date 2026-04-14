import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { tradingAPI, marketsAPI } from "@/services/api";
import { 
  TrendingUp, 
  TrendingDown, 
  Menu, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  BookOpen,
  Trophy,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";

const Property = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultPair = searchParams.get("pair") || "123 Oak St, Austin";
  const [pair, setPair] = useState(defaultPair);
  const [orderBook, setOrderBook] = useState<any>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any>(null);
  const [orderType, setOrderType] = useState<"market" | "limit" | "trigger">("market");
  const [tradeType, setTradeType] = useState<"long" | "short" | "swap">("long");
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);
  const { isAuthenticated, user, loginDemo } = useAuth();
  const { isConnected } = useWallet();

  // Form state
  const [payAmount, setPayAmount] = useState("");
  const [sizeAmount, setSizeAmount] = useState("");
  const [payCurrency, setPayCurrency] = useState("ETH");
  const [sizeCurrency, setSizeCurrency] = useState("ETH");
  const [leverage, setLeverage] = useState([2]);
  const [showChartPositions, setShowChartPositions] = useState(false);

  useEffect(() => {
    const p = searchParams.get("pair");
    if (p) setPair(p);
  }, [searchParams]);

  useEffect(() => {
    loadTradingData();
    const interval = setInterval(loadTradingData, 5000);
    return () => clearInterval(interval);
  }, [pair]);

  // Simulate chart loading
  useEffect(() => {
    const timer = setTimeout(() => setChartLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [pair]);

  const loadTradingData = async () => {
    try {
      const [orderBookRes, tradesRes, marketRes] = await Promise.all([
        tradingAPI.getOrderBook(pair),
        tradingAPI.getRecentTrades(pair),
        marketsAPI.getMarket(pair),
      ]);
      setOrderBook(orderBookRes.data);
      setRecentTrades(tradesRes.data);
      setMarketData(marketRes.data);
    } catch (error: any) {
      console.error("Error loading trading data:", error);
    }
  };

  const handleTrade = async () => {
    if (!payAmount || !sizeAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    // Use demo mode if not authenticated
    if (!isAuthenticated) {
      loginDemo();
      toast.success("Using demo mode");
    }

    setLoading(true);
    try {
      await tradingAPI.placeOrder({
        pair,
        type: tradeType === "long" ? "buy" : "sell",
        orderType: orderType === "market" ? "market" : "limit",
        amount: parseFloat(sizeAmount),
        price: orderType === "limit" ? parseFloat(marketData?.price || "0") : undefined,
      });
      toast.success("Inquiry sent successfully!");
      setPayAmount("");
      setSizeAmount("");
      loadTradingData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const listingOptions = [
    "123 Oak St, Austin",
    "456 Pine Ave, Denver",
    "789 Maple Dr, Seattle",
    "101 Elm Blvd, Miami",
    "202 Cedar Ln, Boston",
    "303 Birch St, Portland",
    "404 Spruce Way, Nashville",
    "505 Willow Rd, Phoenix",
  ];
  const currentPrice = marketData?.price || 385000;
  const priceChange = marketData?.priceChange24h || 0;
  const priceChangePercent = marketData?.priceChangePercent24h || 0;
  const leverageValue = leverage[0];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-[50px] py-6 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <Menu className="w-5 h-5 text-muted-foreground" />
            <Select value={pair} onValueChange={(value) => {
              setPair(value);
              setSearchParams({ pair: value });
              setChartLoading(true);
            }}>
              <SelectTrigger className="w-[200px] bg-slate-50 border-slate-300 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {listingOptions.map((addr) => (
                  <SelectItem key={addr} value={addr}>{addr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <div className="text-2xl font-bold text-foreground">${currentPrice.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Listed price</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Price Change</div>
                <Badge
                  className={
                    priceChange >= 0
                      ? "bg-green-500/10 text-green-400/80 border-green-500/20"
                      : "bg-red-500/10 text-red-400/80 border-red-500/20"
                  }
                >
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {priceChangePercent.toFixed(2)}%
                </Badge>
              </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">High (30d)</div>
              <div className="text-sm text-foreground">{marketData?.high24h?.toLocaleString() || "-"}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Low (30d)</div>
              <div className="text-sm text-foreground">{marketData?.low24h?.toLocaleString() || "-"}</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 pl-[50px] pr-[50px]">
          {/* Left Side - Chart and Tabs */}
          <div className="flex-1 flex flex-col">
            {/* Chart Area */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center min-h-[500px] mb-6">
              {chartLoading ? (
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="text-lg mb-2">Property details & map</div>
                  <div className="text-sm">Details for {pair}</div>
                </div>
              )}
            </div>

            {/* Tabs Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <Tabs defaultValue="positions" className="w-full">
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="positions" className="data-[state=active]:bg-white data-[state=active]:text-foreground">
                      Saved (0)
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-foreground">
                      My Inquiries (0)
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-foreground">
                      Inquiry History
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={showChartPositions}
                    onCheckedChange={setShowChartPositions}
                  />
                  <Label className="text-sm text-muted-foreground">Show on map</Label>
                </div>
                  </div>

              {/* Positions Display */}
              {!isAuthenticated ? (
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="pt-6 pb-6 text-center">
                    <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">Demo Mode Available</h3>
                    <p className="text-muted-foreground mb-4">Sign in or use demo to save this property and send inquiries</p>
                    <Button
                      onClick={loginDemo}
                      className="bg-blue-500/15 hover:bg-blue-500/20 text-blue-400/80 border border-blue-500/25"
                    >
                      Use Demo Mode
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  {user?.isDemo && (
                    <div className="mb-2 text-blue-400 text-sm">Demo Mode Active</div>
                  )}
                  No saved properties or inquiries
                </div>
              )}
                    </div>
                  </div>

          {/* Right Sidebar - Trading Panel */}
          <div className="w-full lg:w-96">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-6">
              {/* Trade Type Selection */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => setTradeType("long")}
                  className={`${
                    tradeType === "long"
                      ? "bg-green-500/10 text-green-400/70 border border-green-500/20 hover:bg-green-500/15"
                      : "bg-slate-100 text-muted-foreground hover:bg-slate-200 border border-slate-300"
                  }`}
                >
                  Schedule Visit
                </Button>
                <Button
                  onClick={() => setTradeType("short")}
                  className={`${
                    tradeType === "short"
                      ? "bg-red-500/10 text-red-400/70 border border-red-500/20 hover:bg-red-500/15"
                      : "bg-slate-100 text-muted-foreground hover:bg-slate-200 border border-slate-300"
                  }`}
                >
                  Get Info
                </Button>
                <Button
                  onClick={() => setTradeType("swap")}
                  className={`${
                    tradeType === "swap"
                      ? "bg-blue-500/10 text-blue-400/70 border border-blue-500/20 hover:bg-blue-500/15"
                      : "bg-slate-100 text-muted-foreground hover:bg-slate-200 border border-slate-300"
                  }`}
                >
                  Make Offer
                </Button>
                </div>

              {/* Order Type Selection - hidden for real estate or repurpose */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => setOrderType("market")}
                  variant={orderType === "market" ? "default" : "outline"}
                  className={orderType === "market" ? "bg-slate-200 text-foreground border border-slate-300 hover:bg-slate-300" : "border-slate-300 text-muted-foreground hover:bg-slate-100"}
                >
                  Message
                </Button>
                <Button
                  onClick={() => setOrderType("limit")}
                  variant={orderType === "limit" ? "default" : "outline"}
                  className={orderType === "limit" ? "bg-slate-200 text-foreground border border-slate-300 hover:bg-slate-300" : "border-slate-300 text-muted-foreground hover:bg-slate-100"}
                      >
                  Call
                </Button>
                <Button
                  onClick={() => setOrderType("trigger")}
                  variant={orderType === "trigger" ? "default" : "outline"}
                  className={orderType === "trigger" ? "bg-slate-200 text-foreground border border-slate-300 hover:bg-slate-300" : "border-slate-300 text-muted-foreground hover:bg-slate-100"}
                >
                  Email
                </Button>
          </div>

              {/* Contact Input */}
              <div className="space-y-2">
                <Label className="text-foreground">Your name</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="bg-slate-50 border-slate-300 text-foreground flex-1"
                  />
                </div>
              </div>

              {/* Message / Phone */}
              <div className="space-y-2">
                <Label className="text-foreground">Phone or email</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Phone or email"
                    value={sizeAmount}
                    onChange={(e) => setSizeAmount(e.target.value)}
                    className="bg-slate-50 border-slate-300 text-foreground flex-1"
                  />
                </div>
              </div>

              {/* Leverage - hide for real estate */}
              <div className="space-y-3 hidden">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Leverage: {leverageValue.toFixed(2)}x</Label>
                  <Switch />
                      </div>
                <Slider
                  value={leverage}
                  onValueChange={setLeverage}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Trade Details */}
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Listing</span>
                    <span className="text-foreground">{pair}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Listed Price</span>
                    <span className="text-foreground">${currentPrice.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Connect Wallet or Trade Button */}
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 border border-transparent"
                    onClick={() => window.location.href = "/login"}
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                  <Button
                    onClick={loginDemo}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-foreground font-semibold py-6 border border-slate-300"
                  >
                    Use Demo Mode
                  </Button>
                </div>
              ) : (
                    <Button
                  onClick={handleTrade}
                      disabled={loading}
                  className={`w-full font-semibold py-6 ${
                    tradeType === "long"
                      ? "bg-green-500/10 hover:bg-green-500/15 text-green-400/70 border border-green-500/20"
                      : tradeType === "short"
                      ? "bg-red-500/10 hover:bg-red-500/15 text-red-400/70 border border-red-500/20"
                      : "bg-blue-500/10 hover:bg-blue-500/15 text-blue-400/70 border border-blue-500/20"
                  }`}
                    >
                  {loading ? "Sending..." : `Send Inquiry — ${tradeType === "long" ? "Visit" : tradeType === "short" ? "Info" : "Offer"}`}
                    </Button>
              )}

              {/* Long ETH Information */}
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground">
                    {pair}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Listed Price</span>
                    <span className="text-foreground">${currentPrice.toLocaleString()}</span>
                      </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price Change</span>
                    <span className="text-foreground">{priceChangePercent.toFixed(2)}%</span>
                    </div>
                </CardContent>
              </Card>

              {/* Useful Links */}
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground">Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-slate-100"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Buying guide
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-slate-100"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Top agents
                  </Button>
                    <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-slate-100"
                    >
                    <Zap className="w-4 h-4 mr-2" />
                    Contact support
                    </Button>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Property;
