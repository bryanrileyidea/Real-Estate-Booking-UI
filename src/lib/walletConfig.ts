import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from "wagmi/chains";

// TODO: replace with a real WalletConnect Cloud project ID (https://cloud.walletconnect.com)
export const WALLETCONNECT_PROJECT_ID = "YOUR_PROJECT_ID";

export const wagmiConfig = getDefaultConfig({
  appName: "Real Estate Booking",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: false,
});
