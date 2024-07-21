import { useEffect } from "react";
import useWalletContext from "./use-wallet-context";
import { BrowserProvider } from "ethers";

const useWalletConnect = () => {
  const {
    provider,
    setProvider,
    signer,
    setSigner,
    isConnected,
    setIsConnected,
  } = useWalletContext();

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (typeof window.ethereum === "undefined") {
        return false;
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        return true;
      }
      return false;
    };
    checkWalletStatus().then(async (connected) => {
      if (connected) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
      }
      setIsConnected(connected);
    });
  }, [setProvider, setSigner, setIsConnected]);

  const connect = async () => {
    if (!isConnected) {
      if (typeof window.ethereum !== "undefined") {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
      } else {
        throw new Error("metamask not installed");
      }
    }
  };

  return { connect, provider, signer, isConnected };
};

export default useWalletConnect;
