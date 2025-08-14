"use client"

import { Vote, History, TrendingUp, Users } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function VotingPage() {
  const votingHistory = [
    {
      proposal: "#2 Add Support for DAI Stablecoin",
      vote: "For",
      power: 0,
      date: "Not Voted",
      result: "Passed",
    },
    {
      proposal: "#3 Reduce Protocol Fee from 5% to 3%",
      vote: "Against",
      power: 0,
      date: "Not Voted",
      result: "Failed",
    },
  ]

  const upcomingVotes = [
    {
      proposal: "#1 Increase Weekly Draw Frequency",
      deadline: "3 days",
      currentStatus: "Leading For",
      participation: "79.5%",
    },
  ]

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Voting Dashboard</h1>
        </div>
        <Button
          disabled
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none disabled:opacity-50"
        >
          <Vote className="mr-2 h-4 w-4" />
          Cast Vote
        </Button>
      </header>

      <main className="p-4 md:p-6">
        <Alert className="mb-6 border-yellow-500/20 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            Voting requires $SAVE tokens. These will be distributed to early depositors and active community members in
            Phase 2 of the protocol launch.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Your Voting Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 $SAVE</div>
              <div className="text-sm text-gray-400">0% of total supply</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-400">Out of 3 proposals</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Participation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-gray-400">Need tokens to participate</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Delegation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">None</div>
              <div className="text-sm text-gray-400">Self-voting</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vote className="mr-2 h-5 w-5 text-purple-400" />
                Upcoming Votes
              </CardTitle>
              <CardDescription>Active proposals requiring your vote</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingVotes.map((vote, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{vote.proposal}</h4>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{vote.deadline} left</Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mb-3">
                    <span>Status: {vote.currentStatus}</span>
                    <span>Participation: {vote.participation}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      disabled
                      size="sm"
                      variant="outline"
                      className="flex-1 border-green-500/20 hover:bg-green-500/10 bg-transparent disabled:opacity-50"
                    >
                      Vote For
                    </Button>
                    <Button
                      disabled
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-500/20 hover:bg-red-500/10 bg-transparent disabled:opacity-50"
                    >
                      Vote Against
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5 text-cyan-400" />
                Your Voting History
              </CardTitle>
              <CardDescription>Past votes and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-purple-500/20 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow>
                      <TableHead>Proposal</TableHead>
                      <TableHead>Your Vote</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {votingHistory.map((vote, index) => (
                      <TableRow key={index} className="hover:bg-white/5">
                        <TableCell className="font-medium">{vote.proposal}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-gray-400">
                            {vote.date}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              vote.result === "Passed"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }
                          >
                            {vote.result}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 border-purple-500/20 overflow-hidden mt-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Community Governance</h4>
                <p className="text-sm text-gray-300">Every $SAVE holder has a voice in protocol decisions</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Earn Voting Power</h4>
                <p className="text-sm text-gray-300">Deposit early to earn $SAVE tokens and governance rights</p>
              </div>
              <div className="text-center">
                <Vote className="h-12 w-12 text-violet-400 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Shape the Future</h4>
                <p className="text-sm text-gray-300">Vote on protocol upgrades, fees, and new features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
