import hre from "hardhat";
import PollManagerModule from "../ignition/modules/PollManager";

async function main() {
  console.log("⏳ Deploying PollManager contract...");
  const { pollManager } = await hre.ignition.deploy(PollManagerModule);
  const pollManagerAddress = await pollManager.getAddress();
  console.log(`✅ PollManager contract deployed at: ${pollManagerAddress}`);

  if (hre.network.name === "sepolia") {
    console.log("⏳ Verifying PollManager contract on Etherscan...");
    await hre.run("verify:verify", {
      address: pollManagerAddress,
    });
    console.log("✅ Contract verified on Etherscan.");
  }
}

main().catch(console.error);
