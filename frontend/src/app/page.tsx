"use client";

import Hero from "@/components/hero";
import useWalletContext from "@/hooks/use-wallet";
import Polls from "./polls/page";

export default function App() {
  const { isConnected } = useWalletContext();

  if (isConnected) {
    return <Polls />;
  }

  return <Hero />;
}
