import { createContext, Dispatch, SetStateAction } from "react";
import ethers from "ethers";

interface WalletContextType {
  provider: ethers.BrowserProvider;
  setProvider: Dispatch<SetStateAction<ethers.BrowserProvider>>;
  signer: ethers.Signer;
  setSigner: Dispatch<SetStateAction<ethers.Signer>>;
  isConnected: boolean;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
}

export const WalletContext = createContext<WalletContextType | null>(null);
