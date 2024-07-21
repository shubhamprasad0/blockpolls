import { PollsContext } from "@/contexts/polls-context";
import { useContext } from "react";

const usePollsContext = () => {
  const pollsContext = useContext(PollsContext);

  if (!pollsContext) {
    throw new Error(
      "usePollsContext has to be used with PollsContext.Provider"
    );
  }

  return pollsContext;
};

export default usePollsContext;
