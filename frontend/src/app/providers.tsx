"use client";
import React, { FC, ReactNode, useState } from "react";
import { WalletContext } from "@/contexts/wallet-context";
import { ContractContext } from "@/contexts/contract-context";
import { BrowserProvider, Signer } from "ethers";
import { ThemeProvider } from "@/components/theme-provider";
import { PollManager } from "@/contracts/types";
import { PollsContext } from "@/contexts/polls-context";

const ContextProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider>(
    {} as BrowserProvider
  );
  const [signer, setSigner] = useState<Signer>({} as Signer);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [contract, setContract] = useState<PollManager>({} as PollManager);
  const [polls, setPolls] = useState<PollData[]>([]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        setProvider,
        signer,
        setSigner,
        isConnected,
        setIsConnected,
      }}
    >
      <ContractContext.Provider value={{ contract, setContract }}>
        <PollsContext.Provider value={{ polls, setPolls }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </PollsContext.Provider>
      </ContractContext.Provider>
    </WalletContext.Provider>
  );
};

export default ContextProviders;
