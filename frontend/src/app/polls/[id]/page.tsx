"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useContract from "@/hooks/use-contract";
import useFetchPolls from "@/hooks/use-fetch-polls";
import useWalletConnect from "@/hooks/use-wallet-connect";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

const PollQuestion = ({ question }: { question: string }) => {
  return (
    <Card>
      <CardHeader>
        <p className="text-muted-foreground uppercase text-xs tracking-widest">
          Question
        </p>
      </CardHeader>
      <CardContent>
        <h1 className="scroll-m-20 text-2xl md:text-3xl font-semibold tracking-tight">
          {question}
        </h1>
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
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PollOption | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<bigint>(
    BigInt(-1)
  );
  const { contract } = useContract();
  const [voted, setVoted] = useState(false);

  const reset = () => {
    setIsVoting(false);
    setSelectedOption(null);
    setSelectedOptionIndex(BigInt(-1));
  };

  const vote = async () => {
    const tx = await contract.vote(poll.id, selectedOptionIndex);
    await tx.wait();
    reset();
    setVoted(true);
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
                setSelectedOptionIndex(BigInt(i));
                setSelectedOption(o);
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
            <Button variant="secondary" onClick={reset}>
              Cancel
            </Button>
            <Button disabled={selectedOption === null} onClick={vote}>
              Submit
            </Button>
          </>
        ) : (
          <>
            {/* {sameUser ? (
              <Button variant="destructive">Close Poll</Button>
            ) : null} */}
            <Button
              onClick={() => {
                setIsVoting(true);
              }}
              disabled={voted}
            >
              Vote
            </Button>
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
      <PollQuestion question={poll.question} />
      <PollOptions poll={poll} sameUser={sameUser} />
    </div>
  );
};

export default PollPage;
