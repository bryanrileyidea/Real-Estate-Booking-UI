import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, loginDemo } = useAuth();
  const { isConnected, formattedAddress, disconnect } = useWallet();

  const handleConnectWallet = () => {
    // Navigate to login page for wallet connection or demo mode
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    if (isConnected && disconnect) {
      disconnect();
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Listings", href: "/listings" },
    { name: "Property", href: "/property" },
    { name: "Saved", href: "/saved" },
    { name: "Settings", href: "/settings" },
    { name: "Doc", href: "https://trust.supply/files/TrustSupply_Masternodes_Lightpaper.pdf", external: true },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="Real Estate Booking"
              className="w-10 h-10 rounded-xl object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-bold">
              <span className="text-foreground">Real Estate </span><span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 bg-clip-text text-transparent">Booking</span>
            </span>
          </Link>

          {/* Navigation Links - centered */}
          <nav className="flex-1 flex justify-center items-center space-x-1">
            {navigation.map((item) => {
              const isActive = !item.external && location.pathname === item.href;
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </a>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-slate-300 text-foreground hover:bg-slate-100 rounded-xl font-medium"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">
                        {isConnected ? formattedAddress : user?.name || "Demo User"}
                      </span>
                      <span className="sm:hidden">User</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-slate-200">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {user?.isDemo ? "Exit Demo" : "Disconnect"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold border border-transparent"
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
