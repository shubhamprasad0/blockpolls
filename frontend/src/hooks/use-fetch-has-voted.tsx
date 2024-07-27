import { useEffect, useState } from "react";
import useContract from "./use-contract";
import useWalletConnect from "./use-wallet-connect";

const useFetchHasVoted = ({ pollId }: { pollId: bigint }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const { contract } = useContract();
  const { signer } = useWalletConnect();

  useEffect(() => {
    const fetchHasVoted = async (pollId: bigint) => {
      const signerAddress = await signer.getAddress();
      const hasVoted = await contract.hasVoted(signerAddress, pollId);
      setHasVoted(hasVoted);
    };
    fetchHasVoted(pollId);
  }, [contract, signer, pollId]);

  return { hasVoted, setHasVoted };
};

export default useFetchHasVoted;
