import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import PollManagerModule from "../ignition/modules/PollManager";

describe("PollManager", () => {
  async function deployContractFixture() {
    const signers = await hre.ethers.getSigners();
    const pollManager = await hre.ethers.deployContract("PollManager");
    return { pollManager, signers };
  }

  async function createPoll() {
    const { pollManager, signers } = await loadFixture(deployContractFixture);
    const pollData = {
      question: "Should I go on?",
      options: ["yes", "no"],
    };

    await pollManager.createPoll(pollData.question, pollData.options);
    return { pollManager, signers, pollData };
  }

  it("should create and get new poll correctly", async () => {
    const { pollManager, signers, pollData } = await loadFixture(createPoll);

    const poll = await pollManager.getPoll(0);

    expect(poll.id).to.equal(0);
    expect(poll.creator).to.equal(signers[0].address);
    expect(poll.isActive).to.equal(true);
    expect(poll.question).to.equal(pollData.question);
    expect(poll.numParticipants).to.equal(0);
    expect(poll.options.length).to.equal(pollData.options.length);
    expect(poll.options[0].name).to.equal(pollData.options[0]);
    expect(poll.options[0].voteCount).to.equal(0);
    expect(poll.options[1].name).to.equal(pollData.options[1]);
    expect(poll.options[1].voteCount).to.equal(0);

    const numPolls = await pollManager.numPolls();
    expect(numPolls).to.equal(1);
  });

  it("should be able to vote", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);
    pollManager = pollManager.connect(signers[1]);
    await pollManager.vote(0, 0);

    const poll = await pollManager.getPoll(0);
    expect(poll.options[0].voteCount).to.equal(1);
    expect(poll.numParticipants).to.equal(1);
  });

  it("should revert when voting again", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);
    pollManager = pollManager.connect(signers[1]);
    await pollManager.vote(0, 0);
    await expect(pollManager.vote(0, 1)).to.be.revertedWith(
      "you have already voted on this poll"
    );
  });

  it("should revert when poll is closed", async () => {
    let { pollManager } = await loadFixture(createPoll);
    await pollManager.closePoll(0);
    await expect(pollManager.vote(0, 0)).to.be.revertedWith(
      "poll is closed now"
    );
  });

  it("should revert when given invalid option id", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);
    pollManager = pollManager.connect(signers[1]);
    await expect(pollManager.vote(0, 2)).to.be.revertedWith(
      "invalid option id"
    );
  });

  it("allows 2 different people to vote on the same poll", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);

    // person 1 voting
    pollManager = pollManager.connect(signers[1]);
    await pollManager.vote(0, 0);
    let poll = await pollManager.getPoll(0);
    expect(poll.options[0].voteCount).to.equal(1);
    expect(poll.numParticipants).to.equal(1);

    // person 2 voting
    pollManager = pollManager.connect(signers[2]);
    await pollManager.vote(0, 0);
    poll = await pollManager.getPoll(0);
    expect(poll.options[0].voteCount).to.equal(2);
    expect(poll.numParticipants).to.equal(2);
  });

  it("should fetch polls after creating", async () => {
    let { pollManager, signers } = await loadFixture(deployContractFixture);

    const pollData = {
      question: "Should I go on?",
      options: ["yes", "no"],
    };

    // create poll 1
    pollManager = pollManager.connect(signers[1]);
    await pollManager.createPoll(pollData.question, pollData.options);

    // create poll 2
    pollManager = pollManager.connect(signers[2]);
    await pollManager.createPoll(pollData.question, pollData.options);

    // create poll 3
    pollManager = pollManager.connect(signers[3]);
    await pollManager.createPoll(pollData.question, pollData.options);

    // fetch polls
    const polls = await pollManager.getPolls();
    expect(polls.length).to.equal(3);

    // test for poll creators
    expect(polls[0].creator).to.equal(signers[1].address);
    expect(polls[1].creator).to.equal(signers[2].address);
    expect(polls[2].creator).to.equal(signers[3].address);
  });

  it("should allow poll creator to close poll", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);

    await pollManager.closePoll(0);

    const poll = await pollManager.getPoll(0);
    expect(poll.isActive).to.equal(false);
  });

  it("should not allow other users to close poll", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);
    pollManager = pollManager.connect(signers[1]);

    await expect(pollManager.closePoll(0)).to.be.revertedWith(
      "only poll creator can close the poll"
    );
  });

  it("should not allow to close already closed poll", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);
    await pollManager.closePoll(0);
    await expect(pollManager.closePoll(0)).to.be.revertedWith(
      "poll is already closed"
    );
  });

  it("should be able to tell if an address has voted or not", async () => {
    let { pollManager, signers } = await loadFixture(createPoll);
    await pollManager.vote(0, 0);
    expect(await pollManager.hasVoted(signers[0].address, 0)).to.equal(true);
    expect(await pollManager.hasVoted(signers[1].address, 0)).to.equal(false);
  });
});
