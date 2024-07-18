"use client";

import { ListFilter, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { CreatePollDialog } from "@/components/create-poll-dialog";
import useContractContext from "@/hooks/use-contract";

interface PollOption {
  name: string;
  voteCount: bigint;
}

interface PollData {
  id: bigint;
  creator: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  numParticipants: bigint;
}

const Polls = () => {
  const [polls, setPolls] = useState<PollData[]>([]);
  const { contract } = useContractContext();

  useEffect(() => {
    const fetchPolls = async () => {
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
    };
    fetchPolls();
  }, [contract]);

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Completed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CreatePollDialog />
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Participant Count
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {polls.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {p.question}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {p.isActive ? "Active" : "Completed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {p.numParticipants.toString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
