import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data for demo mode - real estate listings (same shape as before for compatibility)
const addresses = [
  "123 Oak St, Austin", "456 Pine Ave, Denver", "789 Maple Dr, Seattle", "101 Elm Blvd, Miami",
  "202 Cedar Ln, Boston", "303 Birch St, Portland", "404 Spruce Way, Nashville", "505 Willow Rd, Phoenix",
];
const types = ["House", "Apartment", "Land"];

const generateMockData = () => {
  return addresses.map((addr, i) => {
    const price = Math.round((Math.random() * 800000 + 120000) / 1000) * 1000;
    const change = (Math.random() - 0.5) * 10;
    return {
      pair: addr,
      name: types[i % 3],
      price,
      priceChange24h: Math.round(price * change / 100),
      priceChangePercent24h: change,
      high24h: Math.round(price * 1.05),
      low24h: Math.round(price * 0.95),
      volume24h: Math.floor(Math.random() * 500 + 50),
      marketCap: price,
    };
  });
};

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if in demo mode
    const token = localStorage.getItem("token");
    if (token === "demo-token") {
      // Return mock data for demo mode
      return Promise.resolve({ data: [] });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function to check if in demo mode and return mock data
const handleDemoMode = (mockData: any) => {
  const token = localStorage.getItem("token");
  if (token === "demo-token") {
    return Promise.resolve({ data: mockData });
  }
  return null;
};

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  verifyToken: () => api.get("/auth/verify"),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post("/auth/change-password", data),
};

// Markets API
export const marketsAPI = {
  getAllMarkets: (params?: { search?: string; sort?: string }) => {
    const demoData = handleDemoMode(generateMockData());
    return demoData || api.get("/markets", { params });
  },
  getMarket: (pair: string) => {
    const markets = generateMockData();
    const market = markets.find(m => m.pair === pair) || markets[0];
    const demoData = handleDemoMode(market);
    return demoData || api.get(`/markets/${pair}`);
  },
  getMarketStats: () => {
    const demoData = handleDemoMode({ totalMarkets: 50, totalVolume: 2400000000 });
    return demoData || api.get("/markets/stats/overview");
  },
  getTopGainers: () => {
    const markets = generateMockData();
    const gainers = markets.sort((a, b) => b.priceChangePercent24h - a.priceChangePercent24h).slice(0, 5);
    const demoData = handleDemoMode(gainers);
    return demoData || api.get("/markets/top-gainers");
  },
  getTopLosers: () => {
    const markets = generateMockData();
    const losers = markets.sort((a, b) => a.priceChangePercent24h - b.priceChangePercent24h).slice(0, 5);
    const demoData = handleDemoMode(losers);
    return demoData || api.get("/markets/top-losers");
  },
  getMarketsByVolume: () => {
    const demoData = handleDemoMode(generateMockData().sort((a, b) => b.volume24h - a.volume24h));
    return demoData || api.get("/markets/by-volume");
  },
  searchMarkets: (query: string) => {
    const demoData = handleDemoMode(generateMockData());
    return demoData || api.get("/markets/search", { params: { q: query } });
  },
  getMarketTicker: (pair: string) => {
    const markets = generateMockData();
    const market = markets.find(m => m.pair === pair) || markets[0];
    const demoData = handleDemoMode(market);
    return demoData || api.get(`/markets/${pair}/ticker`);
  },
  getPriceHistory: (pair: string, params?: { interval?: string; limit?: number }) => {
    const demoData = handleDemoMode([]);
    return demoData || api.get(`/markets/${pair}/history`, { params });
  },
};

// Trading API
export const tradingAPI = {
  getOrderBook: (pair: string) => {
    const markets = generateMockData();
    const m = markets.find(x => x.pair === pair) || markets[0];
    const base = m.price;
    const bids = Array.from({ length: 10 }, (_, i) => ({
      price: (base * (1 - (i + 1) * 0.005)).toFixed(0),
      amount: (1).toFixed(0),
    }));
    const asks = Array.from({ length: 10 }, (_, i) => ({
      price: (base * (1 + (i + 1) * 0.005)).toFixed(0),
      amount: (1).toFixed(0),
    }));
    const demoData = handleDemoMode({ bids, asks });
    return demoData || api.get(`/trading/orderbook/${pair}`);
  },
  getRecentTrades: (pair: string) => {
    const markets = generateMockData();
    const m = markets.find(x => x.pair === pair) || markets[0];
    const trades = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      price: (m.price * (0.98 + Math.random() * 0.04)).toFixed(0),
      amount: "1",
      type: Math.random() > 0.5 ? "buy" : "sell",
      timestamp: Date.now() - i * 60000,
    }));
    const demoData = handleDemoMode(trades);
    return demoData || api.get(`/trading/trades/${pair}`);
  },
  placeOrder: (data: {
    pair: string;
    type: "buy" | "sell";
    orderType: "market" | "limit";
    amount: number;
    price?: number;
  }) => {
    const demoData = handleDemoMode({ success: true, orderId: "demo-" + Date.now() });
    return demoData || api.post("/trading/orders", data);
  },
  getUserOrders: (params?: { status?: string; pair?: string }) => {
    const markets = generateMockData();
    const orders = markets.slice(0, 3).map((m, i) => ({
      id: i,
      pair: m.pair,
      type: "buy" as const,
      orderType: "limit",
      amount: "1",
      price: m.price.toFixed(0),
      status: "open",
    }));
    const demoData = handleDemoMode(orders);
    return demoData || api.get("/trading/orders", { params });
  },
  getOrderDetails: (orderId: string) => {
    const demoData = handleDemoMode({ id: orderId, status: "open" });
    return demoData || api.get(`/trading/orders/${orderId}`);
  },
  cancelOrder: (orderId: string) => {
    const demoData = handleDemoMode({ success: true });
    return demoData || api.delete(`/trading/orders/${orderId}`);
  },
  getTradingStats: (pair: string) => {
    const demoData = handleDemoMode({ volume: 1000000, trades: 5000 });
    return demoData || api.get(`/trading/stats/${pair}`);
  },
  getUserTradingHistory: (params?: { pair?: string; limit?: number }) => {
    const demoData = handleDemoMode([]);
    return demoData || api.get("/trading/history", { params });
  },
};

// Wallet API
export const walletAPI = {
  getBalances: () => {
    const listings = generateMockData().slice(0, 4);
    const balances = listings.map((l, i) => ({
      coin: l.pair.split(",")[0],
      available: 1,
      locked: 0,
      usdValue: l.price,
    }));
    const demoData = handleDemoMode(balances);
    return demoData || api.get("/wallet/balances");
  },
  getWalletSummary: () => {
    const summary = {
      totalBalance: 892500,
      availableBalance: 892500,
      totalProfitLoss: 0,
      dailyVolume: 12,
    };
    const demoData = handleDemoMode(summary);
    return demoData || api.get("/wallet/summary");
  },
  getCoinBalance: (coin: string) => {
    const demoData = handleDemoMode({ coin, available: 1.5, locked: 0.1 });
    return demoData || api.get(`/wallet/balance/${coin}`);
  },
  getTransactionHistory: (params?: { type?: string; coin?: string; limit?: number }) => {
    const listings = generateMockData().slice(0, 5);
    const transactions = listings.map((l, i) => ({
      id: i,
      type: i % 2 === 0 ? "inquiry" : "view",
      coin: l.pair.split(",")[0],
      amount: "1",
      status: ["completed", "pending", "completed"][i % 3],
      createdAt: Date.now() - i * 86400000,
      txHash: "inq-" + Date.now().toString(36).slice(-8),
    }));
    const demoData = handleDemoMode(transactions);
    return demoData || api.get("/wallet/transactions", { params });
  },
  getTransactionDetails: (transactionId: string) => {
    const demoData = handleDemoMode({ id: transactionId, status: "completed" });
    return demoData || api.get(`/wallet/transactions/${transactionId}`);
  },
  createDeposit: (data: { coin: string; amount: number; network?: string }) => {
    const demoData = handleDemoMode({ success: true, txId: "demo-" + Date.now() });
    return demoData || api.post("/wallet/deposit", data);
  },
  createWithdrawal: (data: {
    coin: string;
    amount: number;
    address: string;
    network?: string;
  }) => {
    const demoData = handleDemoMode({ success: true, txId: "demo-" + Date.now() });
    return demoData || api.post("/wallet/withdraw", data);
  },
};

export default api;

