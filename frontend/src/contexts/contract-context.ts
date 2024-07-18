import { createContext, Dispatch, SetStateAction } from "react";
import { PollManager as PollManagerContract } from "@/contracts/types/PollManager";

interface ContractContextType {
  contract: PollManagerContract;
  setContract: Dispatch<SetStateAction<PollManagerContract>>;
}

export const ContractContext = createContext<ContractContextType | null>(null);
