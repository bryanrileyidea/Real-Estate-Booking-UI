import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketsAPI } from "@/services/api";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Activity,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Listings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("favorites") || "[]"))
  );

  useEffect(() => {
    loadListings();
    const interval = setInterval(loadListings, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const [listingsRes, gainersRes, losersRes] = await Promise.all([
        marketsAPI.getAllMarkets(),
        marketsAPI.getTopGainers(),
        marketsAPI.getTopLosers(),
      ]);
      setListings(listingsRes.data);
      setTopGainers(gainersRes.data);
      setTopLosers(losersRes.data);
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (pair: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(pair)) {
      newFavorites.delete(pair);
    } else {
      newFavorites.add(pair);
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify([...newFavorites]));
  };

  const filteredMarkets = listings.filter(
    (market) =>
      market.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteMarkets = listings.filter((market) => favorites.has(market.pair));

  const ListingRow = ({ market }: { market: any }) => {
    const isPositive = market.priceChangePercent24h >= 0;
    const isFavorite = favorites.has(market.pair);

    return (
      <TableRow
        className="hover:bg-slate-100 cursor-pointer transition-colors border-b border-slate-200"
        onClick={() => navigate(`/property?pair=${encodeURIComponent(market.pair)}`)}
      >
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(market.pair);
            }}
          >
            <Star
              className={`h-4 w-4 ${
                isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
              }`}
            />
          </Button>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {market.pair.split(",")[0]?.charAt(0) || "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-foreground font-semibold truncate">{market.pair}</p>
              <p className="text-muted-foreground text-sm truncate">{market.name || market.pair}</p>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-foreground font-semibold">
          ${market.price?.toLocaleString() || "0.00"}
        </TableCell>
        <TableCell>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={
              isPositive
                ? "bg-green-500/20 text-green-400 border-green-500/50"
                : "bg-red-500/20 text-red-400 border-red-500/50"
            }
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {market.priceChangePercent24h?.toFixed(2)}%
          </Badge>
        </TableCell>
        <TableCell className="text-foreground">
          ${market.volume24h?.toLocaleString() || "0"}
        </TableCell>
        <TableCell className="text-foreground">
          ${market.marketCap?.toLocaleString() || "0"}
        </TableCell>
        <TableCell>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property?pair=${encodeURIComponent(market.pair)}`);
            }}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading listings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Listings</h1>
            {user?.isDemo && (
              <Badge className="bg-blue-500/10 text-blue-400/80 border-blue-500/20">
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Browse properties on Real Estate Booking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-transparent border-blue-500/20 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-foreground">{listings.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-green-500/20 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-foreground">
                  $
                  {listings
                    .reduce((sum, m) => sum + (m.volume24h || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-yellow-500/20 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-foreground">{favorites.size}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-transparent border-green-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Price Increase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topGainers.slice(0, 5).map((market) => (
                  <div
                    key={market.pair}
                    className="flex items-center justify-between p-4 bg-transparent rounded-xl hover:bg-slate-100 cursor-pointer transition-all hover:scale-[1.02] border border-slate-200"
                    onClick={() => navigate(`/property?pair=${encodeURIComponent(market.pair)}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {market.pair.split(",")[0]?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">{market.pair}</p>
                        <p className="text-muted-foreground text-sm">
                          ${market.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50 font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {market.priceChangePercent24h?.toFixed(2)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-red-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                Price Drop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topLosers.slice(0, 5).map((market) => (
                  <div
                    key={market.pair}
                    className="flex items-center justify-between p-4 bg-transparent rounded-xl hover:bg-slate-100 cursor-pointer transition-all hover:scale-[1.02] border border-slate-200"
                    onClick={() => navigate(`/property?pair=${encodeURIComponent(market.pair)}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {market.pair.split(",")[0]?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">{market.pair}</p>
                        <p className="text-muted-foreground text-sm">
                          ${market.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50 font-semibold">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {market.priceChangePercent24h?.toFixed(2)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-transparent border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-foreground text-2xl">All Listings</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-transparent border-slate-300 text-foreground focus:border-blue-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-transparent border border-slate-700/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-slate-100">All</TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-slate-100">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-transparent">
                      <TableRow className="hover:bg-transparent border-b border-slate-200">
                        <TableHead className="w-12 text-muted-foreground"></TableHead>
                        <TableHead className="text-muted-foreground">Property</TableHead>
                        <TableHead className="text-muted-foreground">Price</TableHead>
                        <TableHead className="text-muted-foreground">Price Change</TableHead>
                        <TableHead className="text-muted-foreground">Views</TableHead>
                        <TableHead className="text-muted-foreground">Listed</TableHead>
                        <TableHead className="text-muted-foreground">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarkets.map((market) => (
                        <ListingRow key={market.pair} market={market} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                {favoriteMarkets.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No saved listings yet</p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Click the star to save listings
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-transparent">
                        <TableRow className="hover:bg-transparent border-b border-slate-200">
                          <TableHead className="w-12 text-muted-foreground"></TableHead>
                          <TableHead className="text-muted-foreground">Property</TableHead>
                          <TableHead className="text-muted-foreground">Price</TableHead>
                          <TableHead className="text-muted-foreground">Price Change</TableHead>
                          <TableHead className="text-muted-foreground">Views</TableHead>
                          <TableHead className="text-muted-foreground">Listed</TableHead>
                          <TableHead className="text-muted-foreground">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {favoriteMarkets.map((market) => (
                          <ListingRow key={market.pair} market={market} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Listings;
