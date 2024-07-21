import { useEffect, useState } from "react";
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

  const [signerAddress, setSignerAddress] = useState("");

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
        const address = await signer.getAddress();
        setProvider(provider);
        setSigner(signer);
        setSignerAddress(address);
      }
      setIsConnected(connected);
    });
  }, [setProvider, setSigner, setIsConnected]);

  const connect = async () => {
    if (!isConnected) {
      if (typeof window.ethereum !== "undefined") {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setProvider(provider);
        setSigner(signer);
        setSignerAddress(address);
        setIsConnected(true);
      } else {
        throw new Error("metamask not installed");
      }
    }
  };

  return { connect, provider, signer, isConnected, signerAddress };
};

export default useWalletConnect;
