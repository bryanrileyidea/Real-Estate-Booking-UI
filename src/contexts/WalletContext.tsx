import { createContext, useContext, ReactNode } from "react";
import { useAccount, useDisconnect, useChainId, useSwitchChain } from "wagmi";
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
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const value: WalletContextType = {
    address,
    isConnected,
    isConnecting,
    chainId,
    disconnect,
    switchChain: (id: number) => switchChain({ chainId: id }),
    formattedAddress: address ? formatAddress(address) : undefined,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
