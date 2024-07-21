import { useCallback, useEffect, useState } from "react";
import usePollsContext from "./use-polls-context";
import useWalletConnect from "./use-wallet-connect";
import { isEmpty } from "lodash";
import useContract from "./use-contract";

const useFetchPolls = () => {
  const { polls, setPolls } = usePollsContext();
  const [currUserPolls, setCurrUserPolls] = useState<PollData[]>([]);
  const { signer } = useWalletConnect();
  const { contract } = useContract();

  const fetchPolls = useCallback(async () => {
    if (isEmpty(contract)) {
      return;
    }

    const _polls = await contract.getPolls();
    const polls: PollData[] = [];
    _polls.forEach((p) => {
      const newPoll: PollData = {
        id: p.id,
        creator: p.creator,
        question: p.question,
        options: p.options.map((o) => ({
          name: o.name,
          voteCount: o.voteCount,
        })),
        isActive: p.isActive,
        numParticipants: p.numParticipants,
      };
      polls.push(newPoll);
    });
    setPolls(polls);
  }, [contract, setPolls]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  useEffect(() => {
    const findCurrUserPolls = async () => {
      if (isEmpty(signer)) {
        return;
      }
      const currUserAddress = await signer.getAddress();
      const currUserPolls = polls.filter((p) => p.creator === currUserAddress);
      setCurrUserPolls(currUserPolls);
    };
    findCurrUserPolls();
  }, [polls, signer]);

  return { polls, currUserPolls, fetchPolls };
};

export default useFetchPolls;
