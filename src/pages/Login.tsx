import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, CheckCircle2, Wallet } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginDemo } = useAuth();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  // Redirect if already authenticated (either wallet or demo)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Once a wallet connects, send the user to the dashboard
  useEffect(() => {
    if (isConnected && address && !isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isConnected, address, isAuthenticated, navigate]);

  const handleLoginDemo = () => {
    loginDemo();
    navigate("/dashboard", { replace: true });
  };

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected. We never share your contact details without your permission.",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Sign in or use demo mode to save listings and send inquiries to agents right away.",
    },
    {
      icon: CheckCircle2,
      title: "Demo Ready",
      description: "Explore all features with demo mode—no account required to browse listings.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <img
              src="/logo.png"
              alt="Real Estate Booking"
              className="w-16 h-16 rounded-xl object-contain shadow-lg"
            />
            <span className="text-3xl font-bold text-foreground">
              Real Estate<span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"> Booking</span>
            </span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to Real Estate Booking
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find and book property listings, save favorites, and send inquiries to agents. Use demo mode to explore without signing up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground text-2xl">Get Started</CardTitle>
              <CardDescription className="text-muted-foreground">
                Explore Real Estate Booking with demo mode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button
                  onClick={handleLoginDemo}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-6 rounded-xl text-lg shadow-lg shadow-indigo-500/30"
                >
                  Continue as Demo User
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Demo mode lets you browse listings, save favorites, and send inquiries without an account
                </p>
                <Button
                  onClick={openConnectModal}
                  disabled={!openConnectModal}
                  variant="outline"
                  className="w-full border-2 border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-semibold py-6 rounded-xl text-lg"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground text-2xl">Why Sign In?</CardTitle>
              <CardDescription className="text-muted-foreground">
                Benefits of creating an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            By connecting, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Demo mode — Browse and save listings, send inquiries
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

