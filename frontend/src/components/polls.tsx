"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePollDialog } from "@/components/create-poll-dialog";
import PollsTable from "@/components/polls-table";
import useFetchPolls from "@/hooks/use-fetch-polls";

const Polls = () => {
  const { polls, currUserPolls, fetchPolls } = useFetchPolls();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All Polls</TabsTrigger>
                <TabsTrigger value="yours">Your Polls</TabsTrigger>
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
