import { useContext } from "react";
import { ContractContext } from "../contexts/contract-context";

const useContractContext = () => {
  const contractContext = useContext(ContractContext);

  if (!contractContext) {
    throw new Error(
      "useContract has to be used within <ContractContext.Provider>"
    );
  }

  return contractContext;
};

export default useContractContext;
