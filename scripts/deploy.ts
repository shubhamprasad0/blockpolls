import hre from "hardhat";
import PollManagerModule from "../ignition/modules/PollManager";
import path from "path";
import fs from "fs";

async function main() {
  const { pollManager } = await hre.ignition.deploy(PollManagerModule);
  console.log(`PollManager address: ${await pollManager.getAddress()}`);

  // get path of frontend dir
  const frontendDir = path.resolve(
    __dirname,
    "..",
    "frontend",
    "src",
    "contracts"
  );

  // get artifact paths
  const artifactPaths = await hre.artifacts.getArtifactPaths();

  // copy artifacts to frontend dir
  for (let artifactPath of artifactPaths) {
    const artifactName = path.basename(artifactPath);
    const dirname = path.basename(path.dirname(artifactPath));
    const dirPath = path.join(frontendDir, dirname);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const src = artifactPath;
    const dest = path.join(dirPath, artifactName);
    fs.copyFileSync(src, dest);
  }
}

main().catch(console.error);
