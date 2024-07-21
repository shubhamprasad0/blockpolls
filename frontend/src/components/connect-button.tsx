"use client";
import useWalletContext from "@/hooks/use-wallet-context";
import { Button } from "./ui/button";
import useWalletConnect from "@/hooks/use-wallet-connect";

const ConnectButton = () => {
  const { isConnected } = useWalletContext();
  const connect = useWalletConnect();

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
