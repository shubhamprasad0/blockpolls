import { useContext } from "react";
import { WalletContext } from "../contexts/wallet-context";

const useWalletContext = () => {
  const walletContext = useContext(WalletContext);

  if (!walletContext) {
    throw new Error("useWallet has to be used within <WalletContext.Provider>");
  }

  return walletContext;
};

export default useWalletContext;
