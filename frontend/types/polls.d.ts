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
