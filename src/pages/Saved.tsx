import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { walletAPI } from "@/services/api";
import {
  Wallet as WalletIcon,
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  EyeOff,
  Copy,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Saved = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  // Deposit form state
  const [depositCoin, setDepositCoin] = useState("BTC");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNetwork, setDepositNetwork] = useState("ERC20");

  // Withdraw form state
  const [withdrawCoin, setWithdrawCoin] = useState("BTC");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("ERC20");

  useEffect(() => {
    loadWalletData();
    const interval = setInterval(loadWalletData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [balancesRes, summaryRes, transactionsRes] = await Promise.all([
        walletAPI.getBalances(),
        walletAPI.getWalletSummary(),
        walletAPI.getTransactionHistory({ limit: 20 }),
      ]);
      setBalances(balancesRes.data);
      setSummary(summaryRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositCoin) {
      toast.error("Please select a listing");
      return;
    }

    try {
      await walletAPI.createDeposit({
        coin: depositCoin,
        amount: 1,
        network: depositNetwork,
      });
      toast.success("Listing saved!");
      setDepositDialogOpen(false);
      setDepositAmount("");
      loadWalletData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save listing");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawCoin) {
      toast.error("Please select a listing");
      return;
    }

    try {
      await walletAPI.createWithdrawal({
        coin: withdrawCoin,
        amount: 1,
        address: withdrawAddress || "n/a",
        network: withdrawNetwork,
      });
      toast.success("Removed from saved!");
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setWithdrawAddress("");
      loadWalletData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading saved...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">Saved</h1>
              {user?.isDemo && (
                <Badge className="bg-blue-500/10 text-blue-400/80 border-blue-500/20">
                  Demo Mode
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">Your saved listings and inquiry history</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg">
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  Save Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border border-slate-200 text-foreground">
                <DialogHeader>
                  <DialogTitle>Save a Listing</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Add a property to your saved list
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-coin">Listing</Label>
                    <Select value={depositCoin} onValueChange={setDepositCoin}>
                      <SelectTrigger className="bg-slate-50 border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="123 Oak">123 Oak St, Austin</SelectItem>
                        <SelectItem value="456 Pine">456 Pine Ave, Denver</SelectItem>
                        <SelectItem value="789 Maple">789 Maple Dr, Seattle</SelectItem>
                        <SelectItem value="101 Elm">101 Elm Blvd, Miami</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 hidden">
                    <Label htmlFor="deposit-network">Network</Label>
                    <Select value={depositNetwork} onValueChange={setDepositNetwork}>
                      <SelectTrigger className="bg-slate-50 border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="ERC20">ERC20</SelectItem>
                        <SelectItem value="BEP20">BEP20</SelectItem>
                        <SelectItem value="TRC20">TRC20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 hidden">
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-slate-50 border-slate-300 text-foreground"
                    />
                  </div>
                  <div className="p-4 bg-transparent border border-slate-200 rounded-lg hidden">
                    <p className="text-sm text-muted-foreground mb-2">Deposit Address:</p>
                    <div className="flex items-center justify-between bg-transparent border border-slate-200 p-3 rounded">
                      <code className="text-sm text-foreground">
                        0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleDeposit}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Save to List
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg">
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Remove Saved
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border border-slate-200 text-foreground">
                <DialogHeader>
                  <DialogTitle>Remove Saved Listing</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Remove a property from your saved list
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-coin">Saved Listing</Label>
                    <Select value={withdrawCoin} onValueChange={setWithdrawCoin}>
                      <SelectTrigger className="bg-slate-50 border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="BTC">123 Oak St</SelectItem>
                        <SelectItem value="ETH">456 Pine Ave</SelectItem>
                        <SelectItem value="USDT">789 Maple Dr</SelectItem>
                        <SelectItem value="BNB">101 Elm Blvd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 hidden">
                    <Label htmlFor="withdraw-network">Network</Label>
                    <Select value={withdrawNetwork} onValueChange={setWithdrawNetwork}>
                      <SelectTrigger className="bg-slate-50 border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="ERC20">ERC20</SelectItem>
                        <SelectItem value="BEP20">BEP20</SelectItem>
                        <SelectItem value="TRC20">TRC20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 hidden">
                    <Label htmlFor="withdraw-address">Withdrawal Address</Label>
                    <Input
                      id="withdraw-address"
                      type="text"
                      placeholder="Enter wallet address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      className="bg-slate-50 border-slate-300 text-foreground"
                    />
                  </div>
                  <div className="space-y-2 hidden">
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-slate-50 border-slate-300 text-foreground"
                    />
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Remove from Saved
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Total Balance */}
        <Card className="bg-transparent border border-blue-500/30 backdrop-blur-xl">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <WalletIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-foreground font-semibold text-lg">Saved Value</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-xl"
                onClick={() => setHideBalance(!hideBalance)}
              >
                {hideBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
            <h2 className="text-5xl font-bold text-foreground mb-3">
              {hideBalance ? "••••••" : `$${summary?.totalBalance?.toLocaleString() || "0.00"}`}
            </h2>
            <p className="text-muted-foreground text-base font-medium">
              Saved listings: {hideBalance ? "••••••" : `${balances?.length || 0}`}
            </p>
          </CardContent>
        </Card>

        {/* Balances */}
        <Card className="bg-transparent border-slate-200">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Saved Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {balances.map((balance) => (
                <div
                  key={balance.coin}
                  className="flex items-center justify-between p-5 bg-transparent rounded-xl hover:bg-slate-100 transition-all hover:scale-[1.02] border border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-foreground font-bold text-lg">
                        {balance.coin.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-lg">{balance.coin}</p>
                      <p className="text-muted-foreground text-sm">
                        {hideBalance ? "••••••" : "Saved"} — ${balance.usdValue?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-semibold text-lg">
                      {hideBalance ? "••••••" : `$${balance.usdValue?.toLocaleString() || "0.00"}`}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Listed price
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-transparent border-slate-200">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Inquiry History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-transparent border border-slate-200">
                <TabsTrigger value="all" className="data-[state=active]:bg-slate-100">All</TabsTrigger>
                <TabsTrigger value="deposit" className="data-[state=active]:bg-slate-100">Inquiries</TabsTrigger>
                <TabsTrigger value="withdraw" className="data-[state=active]:bg-slate-100">Views</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-transparent">
                      <TableRow className="hover:bg-transparent border-b border-slate-200">
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Property</TableHead>
                        <TableHead className="text-muted-foreground">Ref</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-slate-50 border-b border-slate-200">
                          <TableCell>
                            <Badge
                              variant={tx.type === "inquiry" ? "default" : "secondary"}
                              className={
                                tx.type === "inquiry"
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                              }
                            >
                              {tx.type === "inquiry" ? (
                                <ArrowDownToLine className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowUpFromLine className="w-3 h-3 mr-1" />
                              )}
                              {tx.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground font-semibold">
                            {tx.coin}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {tx.amount}
                          </TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => copyToClipboard(tx.txHash || "")}
                            >
                              {tx.txHash?.substring(0, 10)}...
                              <Copy className="w-3 h-3 ml-1" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="deposit" className="mt-6">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-transparent">
                      <TableRow className="hover:bg-transparent border-b border-slate-200">
                        <TableHead className="text-muted-foreground">Coin</TableHead>
                        <TableHead className="text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">TX Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter((tx) => tx.type === "deposit")
                        .map((tx) => (
                          <TableRow key={tx.id} className="hover:bg-slate-50 border-b border-slate-200">
                            <TableCell className="text-foreground font-semibold">
                              {tx.coin}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {tx.amount} {tx.coin}
                            </TableCell>
                            <TableCell>{getStatusBadge(tx.status)}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => copyToClipboard(tx.txHash || "")}
                              >
                                {tx.txHash?.substring(0, 10)}...
                                <Copy className="w-3 h-3 ml-1" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="withdraw" className="mt-6">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-transparent">
                      <TableRow className="hover:bg-transparent border-b border-slate-200">
                        <TableHead className="text-muted-foreground">Coin</TableHead>
                        <TableHead className="text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">TX Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter((tx) => tx.type === "view")
                        .map((tx) => (
                          <TableRow key={tx.id} className="hover:bg-slate-50 border-b border-slate-200">
                            <TableCell className="text-foreground font-semibold">
                              {tx.coin}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {tx.amount} {tx.coin}
                            </TableCell>
                            <TableCell>{getStatusBadge(tx.status)}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => copyToClipboard(tx.txHash || "")}
                              >
                                {tx.txHash?.substring(0, 10)}...
                                <Copy className="w-3 h-3 ml-1" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Saved;

