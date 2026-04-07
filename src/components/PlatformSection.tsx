import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";

const PlatformSection = () => {
  return (
    <section className="py-24 relative bg-gradient-to-br from-white via-slate-50 to-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,300 Q300,100 600,300 T1200,300"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M0,400 Q400,200 800,400 T1600,400"
              stroke="url(#gradient2)"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
            Powered by <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Real Estate Booking</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <LogoIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">Real Estate Booking Platform</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Listings</div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">12,450</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Properties Sold</div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">8,200</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Active Agents</div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">1,240</div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50 px-8 py-6 rounded-xl font-semibold"
                  onClick={() => window.location.href = "/listings"}
                >
                  Browse Listings
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-4 border-green-500/30 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <LogoIcon className="w-20 h-20 md:w-28 md:h-28 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
