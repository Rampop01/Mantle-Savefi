// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISaveToken is IERC20 {
    struct ProposalInfo {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        ProposalState state;
        bytes data;
    }

    struct VoteInfo {
        bool hasVoted;
        bool support;
        uint256 votes;
    }

    struct VoteRecord {
        uint256 proposalId;
        bool support;
        uint256 votes;
        uint256 timestamp;
    }

    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(address indexed voter, uint256 indexed proposalId, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);

    // Governance functions
    function getVotingPower(address user) external view returns (uint256);
    function delegate(address delegatee) external;
    function getDelegatedVotes(address account) external view returns (uint256);
    
    // Proposal management
    function getProposalCount() external view returns (uint256);
    function getProposal(uint256 proposalId) external view returns (ProposalInfo memory);
    function getActiveProposals() external view returns (uint256[] memory);
    function createProposal(string calldata title, string calldata description, bytes calldata data) external returns (uint256);
    
    // Voting functions
    function castVote(uint256 proposalId, bool support) external;
    function getUserVote(uint256 proposalId, address user) external view returns (VoteInfo memory);
    function getProposalVotes(uint256 proposalId) external view returns (uint256 forVotes, uint256 againstVotes);
    function getUserVotingHistory(address user) external view returns (VoteRecord[] memory);
    
    // Proposal states
    function getProposalState(uint256 proposalId) external view returns (ProposalState);
    function getQuorumRequired() external view returns (uint256);
    function executeProposal(uint256 proposalId) external;
}
