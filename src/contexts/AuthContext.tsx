import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useWallet } from "./WalletContext";
import { formatAddress } from "@/lib/utils";

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
  loginWeb3: (address: string) => void;
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
  const { address, isConnected, disconnect } = useWallet();
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [walletUser, setWalletUser] = useState<User | null>(null);

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

  // Reactively sync wallet connection state to walletUser
  useEffect(() => {
    if (isConnected && address) {
      setWalletUser({
        id: address,
        address,
        name: formatAddress(address),
      });
    } else {
      setWalletUser((prev) => {
        if (prev) {
          localStorage.removeItem("token");
        }
        return null;
      });
    }
  }, [isConnected, address]);

  const user: User | null = demoUser ?? walletUser;

  const loginDemo = () => {
    localStorage.setItem("token", "demo-token");
    setDemoUser({
      id: "demo-user",
      name: "Demo User",
      isDemo: true,
    });
  };

  const loginWeb3 = (addr: string) => {
    localStorage.setItem("token", "wallet-token");
    setWalletUser({
      id: addr,
      address: addr,
      name: formatAddress(addr),
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setDemoUser(null);
    setWalletUser(null);
    if (isConnected) {
      disconnect();
    }
  };

  const value = {
    user,
    loading: false,
    logout,
    loginDemo,
    loginWeb3,
    isAuthenticated: !!demoUser || !!walletUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
