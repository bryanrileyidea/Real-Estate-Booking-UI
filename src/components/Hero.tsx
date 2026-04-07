import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { isAuthenticated, loginDemo } = useAuth();

  const handleStartTrading = () => {
    if (isAuthenticated) {
      navigate("/listings");
    } else {
      loginDemo();
      navigate("/listings");
    }
  };

  const stats = [
    {
      label: "Total listings",
      value: "12,450",
      icon: DollarSign,
      iconColor: "bg-orange-500",
      trend: "up" as const,
    },
    {
      label: "Properties sold",
      value: "8,200",
      icon: DollarSign,
      iconColor: "bg-pink-500",
    },
    {
      label: "Active agents",
      value: "1,240",
      icon: DollarSign,
      iconColor: "bg-red-500",
      trend: "up" as const,
    },
    {
      label: "Happy families",
      value: "50,000+",
      icon: Users,
      iconColor: "bg-blue-500",
      },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Hero background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-image.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/55" aria-hidden />
      </div>
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
            <span className="text-foreground">Real Estate </span>
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 bg-clip-text text-transparent">Booking</span>
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Find and book homes, apartments, and land. Save favorites and send inquiries to agents. No sign-up required to explore.
          </p>
          
          <div className="flex justify-center mb-20">
            <Button 
              size="lg" 
              onClick={handleStartTrading}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-lg px-10 py-7 rounded-xl font-semibold text-base md:text-lg shadow-lg shadow-indigo-500/30"
            >
              BROWSE LISTINGS
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 md:p-6 hover:scale-105 hover:border-blue-400/50 transition-all duration-300 min-h-[140px] shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.iconColor} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  {stat.trend === "up" && (
                    <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                  )}
              </div>
                <div className="text-left overflow-hidden">
                  <div className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-1 break-all leading-tight">
                    {stat.value}
            </div>
                  <div className="text-xs text-muted-foreground font-medium leading-tight mt-1">
                    {stat.label}
              </div>
            </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
