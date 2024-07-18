// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PollManager {
    struct Option {
        string name;
        uint voteCount;
    }

    struct Poll {
        uint id;
        address creator;
        string question;
        Option[] options;
        bool isActive;
        uint numParticipants;
    }

    mapping(uint256 => Poll) polls;

    // pollId -> {address: voted? (yes / no)}
    mapping(uint256 => mapping(address => bool)) voteRecords;

    uint public numPolls;

    function createPoll(
        string calldata question,
        string[] calldata optionNames
    ) public {
        // use numPolls to create id of next poll
        uint id = numPolls;
        Poll storage poll = polls[id];

        poll.id = id;
        poll.creator = msg.sender;
        poll.isActive = true;
        poll.question = question;
        poll.numParticipants = 0;
        for (uint i = 0; i < optionNames.length; i++) {
            poll.options.push(Option({name: optionNames[i], voteCount: 0}));
        }

        // increment count of polls
        numPolls++;
    }

    function getPoll(uint pollId) public view returns (Poll memory) {
        return polls[pollId];
    }

    function vote(uint pollId, uint optionId) external {
        require(polls[pollId].isActive, "poll is closed now");
        require(
            optionId >= 0 && optionId < polls[pollId].options.length,
            "invalid option id"
        );
        require(
            !voteRecords[pollId][msg.sender],
            "you have already voted on this poll"
        );
        polls[pollId].options[optionId].voteCount++;
        polls[pollId].numParticipants++;
        voteRecords[pollId][msg.sender] = true;
    }
}
