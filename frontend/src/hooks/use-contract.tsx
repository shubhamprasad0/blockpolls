import { useCallback, useEffect } from "react";
import useContractContext from "./use-contract-context";
import { PollManager__factory } from "@/contracts/types";
import { isEmpty } from "lodash";
import useWalletConnect from "./use-wallet-connect";

const useContract = () => {
  const { setContract, contract } = useContractContext();
  const { signer } = useWalletConnect();

  const createContractInstance = useCallback(async () => {
    const contractAddress = process.env.NEXT_PUBLIC_POLLS_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("contract address is undefined");
    }
    if (isEmpty(signer)) {
      return;
    }
    const contract = PollManager__factory.connect(contractAddress, signer);
    setContract(contract);
  }, [setContract, signer]);

  useEffect(() => {
    createContractInstance();
  }, [createContractInstance]);

  return { contract };
};

export default useContract;
