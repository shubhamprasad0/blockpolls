"use client";
import React, { FC, ReactNode, useState } from "react";
import { WalletContext } from "@/contexts/wallet-context";
import { ContractContext } from "@/contexts/contract-context";
import { BrowserProvider, Contract, Signer } from "ethers";
import { ThemeProvider } from "@/components/theme-provider";

const ContextProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider>(
    {} as BrowserProvider
  );
  const [signer, setSigner] = useState<Signer>({} as Signer);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [contract, setContract] = useState<Contract>({} as Contract);

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ContractContext.Provider>
    </WalletContext.Provider>
  );
};

export default ContextProviders;
