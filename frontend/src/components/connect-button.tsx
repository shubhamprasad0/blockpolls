"use client";
import useWalletContext from "@/hooks/use-wallet";
import useContractContext from "@/hooks/use-contract";
import { BrowserProvider } from "ethers";
import { useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { PollManager__factory } from "@/contracts/types/factories/PollManager__factory";

const ConnectButton = () => {
  const { setProvider, setSigner, isConnected, setIsConnected } =
    useWalletContext();
  const { setContract } = useContractContext();

  const createContractInstance = useCallback(
    async (provider: BrowserProvider) => {
      const contractAddress = process.env.NEXT_PUBLIC_POLLS_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("contract address is undefined");
      }
      const signer = await provider.getSigner();
      const contract = PollManager__factory.connect(contractAddress, signer);
      setContract(contract);
    },
    [setContract]
  );

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
        await createContractInstance(provider);
        setProvider(provider);
        setSigner(signer);
      }
      setIsConnected(connected);
    });
  }, [setProvider, setSigner, setIsConnected, createContractInstance]);

  const connect = async () => {
    if (!isConnected) {
      if (typeof window.ethereum !== "undefined") {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await createContractInstance(provider);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
      } else {
        throw new Error("metamask not installed");
      }
    }
  };

  return (
    <Button
      variant="default"
      className="max-w-48 w-48 ellipsis"
      onClick={() => {
        connect();
      }}
    >
      {isConnected ? "Connected" : "Connect Wallet"}
    </Button>
  );
};

export default ConnectButton;
