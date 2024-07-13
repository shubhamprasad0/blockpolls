import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PollManagerModule = buildModule("PollManagerModule", (m) => {
  const pollManager = m.contract("PollManager");

  return { pollManager };
});

export default PollManagerModule;
