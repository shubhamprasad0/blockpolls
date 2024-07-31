"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useContract from "@/hooks/use-contract";
import useFetchHasVoted from "@/hooks/use-fetch-has-voted";
import useFetchPolls from "@/hooks/use-fetch-polls";
import useWalletConnect from "@/hooks/use-wallet-connect";
import { cn } from "@/lib/utils";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const PollHeader = ({
  poll,
  sameUser,
}: {
  poll: PollData;
  sameUser: boolean;
}) => {
  const { contract } = useContract();
  const [closingPoll, setClosingPoll] = useState(false);

  const closePoll = async () => {
    setClosingPoll(true);
    const tx = await contract.closePoll(poll.id);
    await tx.wait();
    setClosingPoll(false);
  };

  return (
    <Card>
      <CardHeader>
        <p className="text-muted-foreground uppercase text-xs tracking-widest">
          Question
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <h1 className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight">
            {poll.question}
          </h1>
          {sameUser ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={closePoll}
                    disabled={!poll.isActive}
                  >
                    {!closingPoll ? (
                      "Close Poll"
                    ) : (
                      <Spinner size="small" className="mx-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                {!poll.isActive && (
                  <TooltipContent className="bg-secondary border rounded-lg">
                    <p className="text-sm p-2">Poll is already closed</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

const PollOption = ({
  option,
  index,
  numParticipants,
  selected,
  isVoting,
}: {
  option: PollOption;
  index: number;
  numParticipants: bigint;
  selected: boolean;
  isVoting: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex justify-between w-full border rounded px-4 py-4 mb-2",
        isVoting && "hover:cursor-pointer",
        selected && "border-primary"
      )}
    >
      <div className="flex gap-4 justify-start">
        <p className="text-muted-foreground">{index + 1}.</p>
        <p className="font-medium text-lg tracking-wide">{option.name}</p>

        <p className="text-muted-foreground tracking-widest ml-4">
          ({option.voteCount.toString()} / {numParticipants.toString()})
        </p>
      </div>
      <div></div>
    </div>
  );
};

const PollOptions = ({ poll }: { poll: PollData; sameUser: boolean }) => {
  const [sendingVoteTx, setSendingVoteTx] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PollOption | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<bigint>(
    BigInt(-1)
  );
  const { contract } = useContract();
  const { hasVoted, setHasVoted } = useFetchHasVoted({ pollId: poll.id });

  const votingDisabled = useMemo(
    () => hasVoted || !poll.isActive,
    [hasVoted, poll.isActive]
  );

  const reset = () => {
    setIsVoting(false);
    setSelectedOption(null);
    setSelectedOptionIndex(BigInt(-1));
  };

  const vote = async () => {
    setSendingVoteTx(true);
    const tx = await contract.vote(poll.id, selectedOptionIndex);
    await tx.wait();
    reset();
    setHasVoted(true);
    setSendingVoteTx(false);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <p className="text-muted-foreground uppercase text-xs tracking-widest">
          Options
        </p>
      </CardHeader>
      <CardContent>
        {poll.options.map((o, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                if (isVoting) {
                  setSelectedOptionIndex(BigInt(i));
                  setSelectedOption(o);
                }
              }}
            >
              <PollOption
                option={o}
                numParticipants={poll.numParticipants}
                index={i}
                selected={
                  selectedOption !== null && selectedOption.name === o.name
                }
                isVoting={isVoting}
              />
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        {isVoting ? (
          <>
            {!sendingVoteTx && (
              <Button variant="secondary" onClick={reset}>
                Cancel
              </Button>
            )}
            <Button disabled={selectedOption === null} onClick={vote}>
              {sendingVoteTx ? (
                <Spinner size="small" className="mx-4" />
              ) : (
                "Submit"
              )}
            </Button>
          </>
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={cn(votingDisabled && "hover:cursor-not-allowed")}
                    onClick={() => {
                      setIsVoting(true);
                    }}
                    disabled={votingDisabled}
                  >
                    Vote
                  </Button>
                </TooltipTrigger>
                {!poll.isActive && (
                  <TooltipContent>
                    <p className="text-sm p-2">Voting is closed now</p>
                  </TooltipContent>
                )}
                {poll.isActive && hasVoted && (
                  <TooltipContent className="bg-secondary border rounded-lg">
                    <p className="text-sm p-2">
                      You have already voted on this poll
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

const PollPage = () => {
  const { id } = useParams();
  const { polls } = useFetchPolls();
  const { signerAddress } = useWalletConnect();

  const poll = useMemo(() => {
    const poll = polls.find((p) => p.id.toString() === id);
    return poll;
  }, [polls, id]);

  const sameUser = useMemo(() => {
    if (!poll) {
      return false;
    }

    return poll.creator === signerAddress;
  }, [poll, signerAddress]);

  if (!poll) {
    return (
      <div className="container">
        <Card>
          <CardContent>
            <h1>Poll {id} Not Found</h1>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mt-16">
      <PollHeader poll={poll} sameUser={sameUser} />
      <PollOptions poll={poll} sameUser={sameUser} />
    </div>
  );
};

export default PollPage;
