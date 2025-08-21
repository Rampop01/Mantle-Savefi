"use client"

import { Trophy, TrendingUp, Award, Star } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useContractRead } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as vaultAbi } from "@/hooks/abi/SaveFiVault"
import { formatUnits } from "viem"

export default function AllTimeLeaderboardPage() {
  const { data, isLoading, isError } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: "getAllTimeLeaderboard",
    args: [BigInt(25)],
  } as any)

  const entries = (data as any[] | undefined) ?? []

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
              <div className="text-2xl font-bold">— USDC</div>
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
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-400">Loading leaderboard…</TableCell>
                    </TableRow>
                  )}
                  {isError && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-red-400">Failed to load leaderboard</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && !isError && entries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-400">No entries</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && !isError && entries.length > 0 && (entries as any[]).map((e: any, i: number) => {
                    const rank = i + 1
                    const addr = e.user as string
                    const totalWinnings = Number(formatUnits(e.totalWinnings as bigint, 6)).toLocaleString()
                    const drawsWon = Number(e.drawsWon)
                    const totalDeposits = Number(formatUnits(e.totalDeposits as bigint, 6)).toLocaleString()
                    const winRatePct = `${(Number(e.winRate) / 100).toFixed(1)}%`
                    const status = rank === 1 ? 'Legend' : rank <= 3 ? 'Champion' : rank <= 10 ? 'Elite' : 'Player'
                    const mono = `${addr.slice(0,6)}...${addr.slice(-4)}`
                    return (
                      <TableRow key={`${addr}-${rank}`} className="hover:bg-white/5">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {rank === 1 && <Trophy className="h-4 w-4 text-yellow-500" />}
                            {rank === 2 && <Award className="h-4 w-4 text-gray-400" />}
                            {rank === 3 && <Award className="h-4 w-4 text-amber-600" />}#{rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{mono}</TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell className="font-medium text-cyan-400">{totalWinnings} USDC</TableCell>
                        <TableCell>{drawsWon}</TableCell>
                        <TableCell>
                          <span className="text-green-400">{winRatePct}</span>
                        </TableCell>
                        <TableCell>{totalDeposits} USDC</TableCell>
                      </TableRow>
                    )
                  })}
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
