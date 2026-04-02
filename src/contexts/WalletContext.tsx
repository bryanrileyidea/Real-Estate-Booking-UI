import { createContext, useContext, ReactNode } from "react";
import { formatAddress } from "@/lib/utils";

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | undefined;
  disconnect: () => void;
  switchChain: (chainId: number) => void;
  formattedAddress: string | undefined;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  // Wallet functionality disabled - always return disconnected state
  const value = {
    address: undefined,
    isConnected: false,
    isConnecting: false,
    chainId: undefined,
    disconnect: () => {},
    switchChain: () => {},
    formattedAddress: undefined,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
