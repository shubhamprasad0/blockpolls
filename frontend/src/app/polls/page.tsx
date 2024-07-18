"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreatePollDialog } from "@/components/create-poll-dialog";
import useContractContext from "@/hooks/use-contract";
import useWalletContext from "@/hooks/use-wallet";
import PollsTable from "@/components/polls-table";

const Polls = () => {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [currUserPolls, setCurrUserPolls] = useState<PollData[]>([]);
  const { signer } = useWalletContext();
  const { contract } = useContractContext();

  const fetchPolls = useCallback(async () => {
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
  }, [contract]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  useEffect(() => {
    const findCurrUserPolls = async () => {
      const currUserAddress = await signer.getAddress();
      const currUserPolls = polls.filter((p) => p.creator === currUserAddress);
      setCurrUserPolls(currUserPolls);
    };
    findCurrUserPolls();
  }, [polls, signer]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="yours">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="yours">Your Polls</TabsTrigger>
                <TabsTrigger value="all">All Polls</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <CreatePollDialog fetchPolls={fetchPolls} />
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Polls</CardTitle>
                  <CardDescription>
                    Manage your polls and view their engagement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PollsTable polls={polls} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="yours">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Polls</CardTitle>
                  <CardDescription>
                    Manage your polls and view their engagement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PollsTable polls={currUserPolls} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Polls;
