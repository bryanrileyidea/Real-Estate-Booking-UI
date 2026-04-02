import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useWallet } from "./WalletContext";

interface User {
  id: string;
  address?: string;
  name: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  loginDemo: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isConnected, disconnect } = useWallet();
  const [demoUser, setDemoUser] = useState<User | null>(null);

  // Check for demo mode on mount
  useEffect(() => {
      const token = localStorage.getItem("token");
        if (token === "demo-token") {
      setDemoUser({
            id: "demo-user",
            name: "Demo User",
        isDemo: true,
      });
    }
  }, []);

  // Since wallet connection is disabled, always use demo user if available
  const user: User | null = demoUser;

  const loginDemo = () => {
    localStorage.setItem("token", "demo-token");
    setDemoUser({
      id: "demo-user",
      name: "Demo User",
      isDemo: true,
    });
  };

  const logout = () => {
      localStorage.removeItem("token");
    setDemoUser(null);
    if (isConnected) {
      disconnect();
    }
  };

  const value = {
    user,
    loading: false,
    logout,
    loginDemo,
    isAuthenticated: !!demoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

