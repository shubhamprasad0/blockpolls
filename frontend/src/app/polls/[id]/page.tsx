"use client";

import useFetchPolls from "@/hooks/use-fetch-polls";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const PollPage = () => {
  const { id } = useParams();
  const { polls } = useFetchPolls();

  const poll = useMemo(() => {
    const poll = polls.find((p) => p.id.toString() === id);
    return poll;
  }, [polls, id]);

  return <>{poll ? <h1>{poll.question}</h1> : <h1>Poll Not Found</h1>}</>;
};

export default PollPage;
