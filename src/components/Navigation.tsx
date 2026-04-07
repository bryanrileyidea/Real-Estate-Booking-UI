import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Wallet, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { isConnected, formattedAddress } = useWallet();

  const handleConnectWallet = () => {
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="Real Estate Booking"
              className="w-10 h-10 rounded-xl object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl font-bold text-foreground">
              Real Estate <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Booking</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              Features
            </a>
            <a 
              href="#tokens" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              Tokens
            </a>
            <Link 
              to="/listings" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              Listings
            </Link>
            <Link 
              to="/property" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              Property
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && isConnected ? (
              <>
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hidden sm:flex">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-slate-300 text-foreground hover:bg-slate-100 rounded-xl font-medium"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {formattedAddress}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-slate-200">
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
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
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
