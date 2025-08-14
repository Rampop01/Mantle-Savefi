"use client"

import { useState } from "react"
import { Vote, Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProposalsPage() {
  const [userVotingPower] = useState(0) // User has no tokens yet

  const proposals = [
    {
      id: 1,
      title: "Increase Weekly Draw Frequency to Bi-weekly",
      description: "Proposal to change draw frequency from weekly to twice per week to increase user engagement.",
      status: "active",
      votesFor: 1250000,
      votesAgainst: 340000,
      totalVotes: 1590000,
      quorum: 2000000,
      timeLeft: "3 days",
      proposer: "0x7a...3f91",
    },
    {
      id: 2,
      title: "Add Support for DAI Stablecoin",
      description: "Enable DAI deposits alongside USDC and USDT to expand user base and TVL.",
      status: "passed",
      votesFor: 2100000,
      votesAgainst: 450000,
      totalVotes: 2550000,
      quorum: 2000000,
      timeLeft: "Ended",
      proposer: "0x3b...8e72",
    },
    {
      id: 3,
      title: "Reduce Protocol Fee from 5% to 3%",
      description: "Lower the protocol fee to increase user returns and competitiveness.",
      status: "failed",
      votesFor: 890000,
      votesAgainst: 1560000,
      totalVotes: 2450000,
      quorum: 2000000,
      timeLeft: "Ended",
      proposer: "0x5f...2d45",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
      case "passed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Passed</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-400" />
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">DAO Proposals</h1>
        </div>
        <Button
          disabled={userVotingPower === 0}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none disabled:opacity-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Proposal
        </Button>
      </header>

      <main className="p-4 md:p-6">
        {userVotingPower === 0 && (
          <Alert className="mb-6 border-yellow-500/20 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              You need $SAVE tokens to participate in DAO governance. Tokens will be distributed to early depositors in
              Phase 2.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Your Voting Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userVotingPower.toLocaleString()} $SAVE</div>
              <div className="text-sm text-gray-400">0% of total supply</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm text-gray-400">Currently voting</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-gray-400">All time</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(proposal.status)}
                      <CardTitle className="text-lg">
                        #{proposal.id} {proposal.title}
                      </CardTitle>
                      {getStatusBadge(proposal.status)}
                    </div>
                    <CardDescription>{proposal.description}</CardDescription>
                    <div className="text-sm text-gray-400 mt-2">
                      Proposed by {proposal.proposer} • {proposal.timeLeft}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-green-400">For: {proposal.votesFor.toLocaleString()}</span>
                      <span className="text-sm text-red-400">Against: {proposal.votesAgainst.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(proposal.votesFor / proposal.totalVotes) * 100}
                      className="h-2 bg-red-500/20"
                      indicatorClassName="bg-green-500"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                      <span>Total Votes: {proposal.totalVotes.toLocaleString()}</span>
                      <span>Quorum: {proposal.quorum.toLocaleString()}</span>
                    </div>
                  </div>

                  {proposal.status === "active" && (
                    <div className="flex gap-2">
                      <Button
                        disabled={userVotingPower === 0}
                        variant="outline"
                        className="flex-1 border-green-500/20 hover:bg-green-500/10 bg-transparent disabled:opacity-50"
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Vote For
                      </Button>
                      <Button
                        disabled={userVotingPower === 0}
                        variant="outline"
                        className="flex-1 border-red-500/20 hover:bg-red-500/10 bg-transparent disabled:opacity-50"
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Vote Against
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 border-purple-500/20 overflow-hidden mt-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">🗳️ Shape the Future of SaveFi</h3>
              <p className="text-gray-300 mb-4">
                DAO governance allows the community to make important decisions about the protocol. Deposit early to
                earn $SAVE tokens and participate in governance!
              </p>
              <Button className="bg-white text-purple-700 hover:bg-white/90">Learn About Governance</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
