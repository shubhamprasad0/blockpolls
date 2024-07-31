"use client";
import useWalletContext from "@/hooks/use-wallet-context";
import { Button } from "./ui/button";
import useWalletConnect from "@/hooks/use-wallet-connect";
import { Spinner } from "./ui/spinner";
import { useToast } from "./ui/use-toast";

const ConnectButton = () => {
  const { isConnected } = useWalletContext();
  const { connect, connecting, setConnecting } = useWalletConnect();
  const { toast } = useToast();

  const connectHandler = async () => {
    try {
      await connect();
    } catch (e: any) {
      let description = "";
      switch (e.code) {
        case "ACTION_REJECTED":
          description = "User rejected the transaction.";
          break;

        default:
          description = "Transaction failed";
          break;
      }
      toast({
        title: `Failed to connect to wallet -- ${e.code}`,
        description: description,
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  return (
    <Button
      variant="default"
      className="max-w-48 w-48 ellipsis"
      onClick={connectHandler}
    >
      {connecting ? <Spinner /> : isConnected ? "Connected" : "Connect Wallet"}
    </Button>
  );
};

export default ConnectButton;
