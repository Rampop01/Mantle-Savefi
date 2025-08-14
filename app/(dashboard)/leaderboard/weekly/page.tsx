"use client"

import { useState } from "react"
import { Trophy, Medal, Award, Crown, Calendar } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function WeeklyLeaderboardPage() {
  const [selectedWeek, setSelectedWeek] = useState("current")

  const weeklyWinners = [
    {
      rank: 1,
      address: "0x7a...3f91",
      prize: "150.25",
      deposit: "2,500.00",
      chance: "10.1%",
      week: "Week 42",
    },
    {
      rank: 2,
      address: "0x3b...8e72",
      prize: "142.18",
      deposit: "2,200.00",
      chance: "9.2%",
      week: "Week 41",
    },
    {
      rank: 3,
      address: "0x5f...2d45",
      prize: "138.92",
      deposit: "2,100.00",
      chance: "9.0%",
      week: "Week 40",
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <Trophy className="h-6 w-6 text-purple-400" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30"
      case 2:
        return "from-gray-400/20 to-gray-500/10 border-gray-400/30"
      case 3:
        return "from-amber-600/20 to-amber-700/10 border-amber-600/30"
      default:
        return "from-purple-500/20 to-purple-600/10 border-purple-500/30"
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Weekly Winners</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[150px] bg-white/10 border-purple-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="last">Last Week</SelectItem>
              <SelectItem value="42">Week 42</SelectItem>
              <SelectItem value="41">Week 41</SelectItem>
              <SelectItem value="40">Week 40</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none">
            <Calendar className="mr-2 h-4 w-4" />
            Next Draw: 2d 14h
          </Button>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 border-purple-500/20 overflow-hidden mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🏆 Hall of Fame</CardTitle>
              <CardDescription>Recent weekly draw winners</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {weeklyWinners.map((winner) => (
              <Card
                key={winner.rank}
                className={`bg-gradient-to-r ${getRankColor(winner.rank)} backdrop-blur-sm overflow-hidden`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
                        {getRankIcon(winner.rank)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-lg font-medium">{winner.address}</span>
                          <Badge variant="outline" className="border-white/30 text-white">
                            {winner.week}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300">
                          Deposited: {winner.deposit} USDC • Winning Chance: {winner.chance}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">{winner.prize} USDC</div>
                      <div className="text-sm text-gray-300">Prize Won</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle>How Weekly Draws Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-purple-400 font-semibold mb-2">1. Fair Selection</div>
                  <div className="text-sm text-gray-300">
                    Winners are selected using provably fair randomness. Your chances are proportional to your deposit.
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-cyan-400 font-semibold mb-2">2. Weekly Frequency</div>
                  <div className="text-sm text-gray-300">
                    Draws happen every 7 days automatically. All depositors are eligible to win.
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-violet-400 font-semibold mb-2">3. No Loss</div>
                  <div className="text-sm text-gray-300">
                    Your principal is always safe. Only the yield generated is distributed as prizes.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
