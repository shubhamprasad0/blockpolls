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

    // Errors
    error ErrPollClosed(uint pollId);
    error InvalidOption(uint pollId, uint numOptions, uint invalidOptionId);
    error AlreadyVoted(uint pollId, address voterId);
    error Unauthorized(uint pollId, address senderId);

    // Events
    event PollCreated(uint indexed pollId, address indexed pollCreator);
    event VoteRegistered(
        uint indexed pollId,
        address indexed pollCreator,
        address indexed voter,
        uint optionId,
        string optionName
    );
    event PollClosed(uint indexed pollId, address indexed pollCreator);

    // Modifiers
    modifier pollOpen(uint pollId) {
        if (!polls[pollId].isActive) {
            revert ErrPollClosed({pollId: pollId});
        }
        _;
    }

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

        emit PollCreated(id, msg.sender);
    }

    function getPoll(uint pollId) public view returns (Poll memory) {
        return polls[pollId];
    }

    function getPolls() public view returns (Poll[] memory) {
        Poll[] memory result = new Poll[](numPolls);
        for (uint i = 0; i < numPolls; i++) {
            result[i] = polls[i];
        }
        return result;
    }

    function vote(uint pollId, uint optionId) external pollOpen(pollId) {
        if (optionId < 0 || optionId >= polls[pollId].options.length) {
            revert InvalidOption({
                pollId: pollId,
                numOptions: polls[pollId].options.length,
                invalidOptionId: optionId
            });
        }
        if (voteRecords[pollId][msg.sender]) {
            revert AlreadyVoted({pollId: pollId, voterId: msg.sender});
        }

        polls[pollId].options[optionId].voteCount++;
        polls[pollId].numParticipants++;
        voteRecords[pollId][msg.sender] = true;

        emit VoteRegistered(
            pollId,
            polls[pollId].creator,
            msg.sender,
            optionId,
            polls[pollId].options[optionId].name
        );
    }

    function closePoll(uint pollId) external pollOpen(pollId) {
        if (polls[pollId].creator != msg.sender) {
            revert Unauthorized({pollId: pollId, senderId: msg.sender});
        }
        polls[pollId].isActive = false;
        emit PollClosed(pollId, polls[pollId].creator);
    }

    function hasVoted(
        address voterAddress,
        uint pollId
    ) public view returns (bool) {
        return voteRecords[pollId][voterAddress];
    }
}
