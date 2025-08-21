// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ISaveToken} from "./interfaces/ISaveToken.sol";

contract SaveToken is ERC20, ERC20Permit, ERC20Votes, Ownable, Pausable, ISaveToken {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18; // 100M tokens
    uint256 public constant QUORUM_PERCENTAGE = 2000; // 20%
    uint256 public constant VOTING_DELAY = 1 days;
    uint256 public constant VOTING_PERIOD = 7 days;
    
    uint256 public proposalCount;
    mapping(uint256 => ProposalInfo) public proposals;
    mapping(uint256 => mapping(address => VoteInfo)) public votes;
    mapping(address => VoteRecord[]) public userVotingHistory;
    
    uint256[] public activeProposalIds;
    mapping(uint256 => bool) public isActiveProposal;

    constructor() ERC20("SaveFi Token", "SAVE") ERC20Permit("SaveFi Token") {
        // Mint initial supply to deployer for distribution
        _mint(msg.sender, 10_000_000 * 1e18); // 10M for initial distribution
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function getVotingPower(address user) external view override returns (uint256) {
        return getVotes(user);
    }

    function getDelegatedVotes(address account) external view override returns (uint256) {
        return getVotes(account);
    }

    function getProposalCount() external view override returns (uint256) {
        return proposalCount;
    }

    function getProposal(uint256 proposalId) external view override returns (ProposalInfo memory) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        return proposals[proposalId];
    }

    function getActiveProposals() external view override returns (uint256[] memory) {
        return activeProposalIds;
    }

    function createProposal(
        string calldata title,
        string calldata description,
        bytes calldata data
    ) external override returns (uint256) {
        require(getVotes(msg.sender) >= getQuorumRequired() / 100, "Insufficient voting power");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");

        proposalCount++;
        uint256 proposalId = proposalCount;

        proposals[proposalId] = ProposalInfo({
            id: proposalId,
            title: title,
            description: description,
            proposer: msg.sender,
            startTime: block.timestamp + VOTING_DELAY,
            endTime: block.timestamp + VOTING_DELAY + VOTING_PERIOD,
            forVotes: 0,
            againstVotes: 0,
            state: ProposalState.Pending,
            data: data
        });

        activeProposalIds.push(proposalId);
        isActiveProposal[proposalId] = true;

        emit ProposalCreated(proposalId, msg.sender, title);
        return proposalId;
    }

    function castVote(uint256 proposalId, bool support) external override {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(!votes[proposalId][msg.sender].hasVoted, "Already voted");
        
        ProposalInfo storage proposal = proposals[proposalId];
        require(getProposalState(proposalId) == ProposalState.Active, "Proposal not active");
        
        uint256 votingPower = getVotes(msg.sender);
        require(votingPower > 0, "No voting power");

        votes[proposalId][msg.sender] = VoteInfo({
            hasVoted: true,
            support: support,
            votes: votingPower
        });

        if (support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }

        userVotingHistory[msg.sender].push(VoteRecord({
            proposalId: proposalId,
            support: support,
            votes: votingPower,
            timestamp: block.timestamp
        }));

        emit VoteCast(msg.sender, proposalId, support, votingPower);
    }

    function getUserVote(uint256 proposalId, address user) external view override returns (VoteInfo memory) {
        return votes[proposalId][user];
    }

    function getProposalVotes(uint256 proposalId) external view override returns (uint256 forVotes, uint256 againstVotes) {
        ProposalInfo memory proposal = proposals[proposalId];
        return (proposal.forVotes, proposal.againstVotes);
    }

    function getUserVotingHistory(address user) external view override returns (VoteRecord[] memory) {
        return userVotingHistory[user];
    }

    function getProposalState(uint256 proposalId) public view override returns (ProposalState) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        
        ProposalInfo memory proposal = proposals[proposalId];
        
        if (proposal.state == ProposalState.Canceled) {
            return ProposalState.Canceled;
        }
        
        if (proposal.state == ProposalState.Executed) {
            return ProposalState.Executed;
        }
        
        if (block.timestamp < proposal.startTime) {
            return ProposalState.Pending;
        }
        
        if (block.timestamp <= proposal.endTime) {
            return ProposalState.Active;
        }
        
        uint256 quorum = getQuorumRequired();
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        
        if (totalVotes < quorum) {
            return ProposalState.Defeated;
        }
        
        if (proposal.forVotes > proposal.againstVotes) {
            return ProposalState.Succeeded;
        }
        
        return ProposalState.Defeated;
    }

    function getQuorumRequired() public view override returns (uint256) {
        return (totalSupply() * QUORUM_PERCENTAGE) / 10000;
    }

    function executeProposal(uint256 proposalId) external override {
        require(getProposalState(proposalId) == ProposalState.Succeeded, "Proposal not succeeded");
        
        proposals[proposalId].state = ProposalState.Executed;
        _removeFromActiveProposals(proposalId);
        
        // Execute proposal data if any (simplified for demo)
        // In a real implementation, this would execute the proposal's actions
        
        emit ProposalExecuted(proposalId);
    }

    function cancelProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        ProposalInfo storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer || msg.sender == owner(), "Not authorized");
        require(getProposalState(proposalId) == ProposalState.Pending || getProposalState(proposalId) == ProposalState.Active, "Cannot cancel");
        
        proposal.state = ProposalState.Canceled;
        _removeFromActiveProposals(proposalId);
    }

    function _removeFromActiveProposals(uint256 proposalId) internal {
        if (isActiveProposal[proposalId]) {
            for (uint256 i = 0; i < activeProposalIds.length; i++) {
                if (activeProposalIds[i] == proposalId) {
                    activeProposalIds[i] = activeProposalIds[activeProposalIds.length - 1];
                    activeProposalIds.pop();
                    break;
                }
            }
            isActiveProposal[proposalId] = false;
        }
    }

    // Clean up expired proposals from active list
    function cleanupExpiredProposals() external {
        for (uint256 i = activeProposalIds.length; i > 0; i--) {
            uint256 proposalId = activeProposalIds[i - 1];
            ProposalState state = getProposalState(proposalId);
            
            if (state != ProposalState.Active && state != ProposalState.Pending) {
                _removeFromActiveProposals(proposalId);
            }
        }
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Override required functions
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address from, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(from, amount);
    }

    // Satisfy ISaveToken interface and disambiguate ERC20Votes.delegate
    function delegate(address delegatee)
        public
        override(ISaveToken, ERC20Votes)
    {
        super.delegate(delegatee);
    }

}
