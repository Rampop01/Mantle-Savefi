"use client"

import { Trophy, TrendingUp, Award, Star } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AllTimeLeaderboardPage() {
  const allTimeStats = [
    {
      rank: 1,
      address: "0x7a...3f91",
      totalWinnings: "1,234.56",
      drawsWon: 8,
      totalDeposits: "15,000.00",
      winRate: "19.0%",
      status: "Legend",
    },
    {
      rank: 2,
      address: "0x3b...8e72",
      totalWinnings: "987.43",
      drawsWon: 6,
      totalDeposits: "12,500.00",
      winRate: "14.3%",
      status: "Champion",
    },
    {
      rank: 3,
      address: "0x5f...2d45",
      totalWinnings: "876.32",
      drawsWon: 5,
      totalDeposits: "11,200.00",
      winRate: "11.9%",
      status: "Champion",
    },
    {
      rank: 4,
      address: "0x9c...7a31",
      totalWinnings: "654.21",
      drawsWon: 4,
      totalDeposits: "9,800.00",
      winRate: "9.5%",
      status: "Elite",
    },
    {
      rank: 5,
      address: "0x2d...4e67",
      totalWinnings: "543.10",
      drawsWon: 3,
      totalDeposits: "8,500.00",
      winRate: "7.1%",
      status: "Elite",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Legend":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Legend</Badge>
      case "Champion":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Champion</Badge>
      case "Elite":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Elite</Badge>
      default:
        return <Badge variant="outline">Player</Badge>
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">All-Time Winners</h1>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none">
          <Star className="mr-2 h-4 w-4" />
          Hall of Fame
        </Button>
      </header>

      <main className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Prizes Awarded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,345.67 USDC</div>
              <div className="flex items-center text-sm text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                Across 42 draws
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Unique Winners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <div className="text-sm text-gray-400">Out of 1,234 participants</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Biggest Single Win</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">175.32 USDC</div>
              <div className="text-sm text-gray-400">Draw #36 - June 11, 2025</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              All-Time Leaderboard
            </CardTitle>
            <CardDescription>Top performers ranked by total winnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-purple-500/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Winnings</TableHead>
                    <TableHead>Draws Won</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Total Deposits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTimeStats.map((user) => (
                    <TableRow key={user.rank} className="hover:bg-white/5">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {user.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500" />}
                          {user.rank === 2 && <Award className="h-4 w-4 text-gray-400" />}
                          {user.rank === 3 && <Award className="h-4 w-4 text-amber-600" />}#{user.rank}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{user.address}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="font-medium text-cyan-400">{user.totalWinnings} USDC</TableCell>
                      <TableCell>{user.drawsWon}</TableCell>
                      <TableCell>
                        <span className="text-green-400">{user.winRate}</span>
                      </TableCell>
                      <TableCell>{user.totalDeposits} USDC</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 border-purple-500/20 overflow-hidden mt-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">🎯 Want to join the leaderboard?</h3>
              <p className="text-gray-300 mb-4">
                The more you deposit, the higher your chances of winning. Start your journey to becoming a SaveFi
                legend!
              </p>
              <Button className="bg-white text-purple-700 hover:bg-white/90">Start Depositing</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
