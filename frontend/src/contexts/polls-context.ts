import { createContext, Dispatch, SetStateAction } from "react";

interface PollsContextType {
  polls: PollData[];
  setPolls: Dispatch<SetStateAction<PollData[]>>;
}

export const PollsContext = createContext<PollsContextType | null>(null);
