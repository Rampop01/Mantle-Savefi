"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Calendar, Search, Trophy, Filter, Download } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Sample data for draw history
const drawHistory = [
  {
    id: 42,
    date: "Jul 23, 2025",
    winner: "0x7a...3f91",
    prize: "150.25 USDC",
    participants: 1245,
    tvl: "24,750.00 USDC",
  },
  {
    id: 41,
    date: "Jul 16, 2025",
    winner: "0x3b...8e72",
    prize: "142.18 USDC",
    participants: 1198,
    tvl: "23,890.00 USDC",
  },
  {
    id: 40,
    date: "Jul 09, 2025",
    winner: "0x5f...2d45",
    prize: "138.92 USDC",
    participants: 1156,
    tvl: "23,150.00 USDC",
  },
  {
    id: 39,
    date: "Jul 02, 2025",
    winner: "0x9c...7a31",
    prize: "135.45 USDC",
    participants: 1102,
    tvl: "22,575.00 USDC",
  },
  {
    id: 38,
    date: "Jun 25, 2025",
    winner: "0x2d...4e67",
    prize: "130.80 USDC",
    participants: 1078,
    tvl: "21,800.00 USDC",
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Draw History</h1>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none">
          <Calendar className="mr-2 h-4 w-4" />
          Next Draw: 2d 14h
        </Button>
      </header>

      {/* Main content */}
      <main className="p-4 md:p-6">
        <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Draw History
            </CardTitle>
            <CardDescription>Complete history of all SaveFi prize draws</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by draw ID or winner address"
                  className="pl-9 bg-white/10 border-purple-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-white/10 border-purple-500/20">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-purple-500/20 hover:bg-purple-500/10 bg-transparent">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-purple-500/20 hover:bg-purple-500/10 bg-transparent">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-purple-500/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>Draw #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Prize</TableHead>
                    <TableHead className="hidden md:table-cell">Participants</TableHead>
                    <TableHead className="hidden md:table-cell">TVL</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drawHistory.map((draw) => (
                    <TableRow key={draw.id} className="hover:bg-white/5">
                      <TableCell className="font-medium">{draw.id}</TableCell>
                      <TableCell>{draw.date}</TableCell>
                      <TableCell className="font-mono">{draw.winner}</TableCell>
                      <TableCell className="font-medium text-cyan-400">{draw.prize}</TableCell>
                      <TableCell className="hidden md:table-cell">{draw.participants}</TableCell>
                      <TableCell className="hidden md:table-cell">{draw.tvl}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        {/* Featured draw */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 border-purple-500/20 overflow-hidden">
          <CardContent className="p-6 md:p-8 relative">
            <motion.div
              className="absolute w-64 h-64 rounded-full bg-purple-600/10 blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ top: "-20%", right: "-10%" }}
            />
            <motion.div
              className="absolute w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
              animate={{
                x: [0, -20, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ bottom: "-30%", left: "10%" }}
            />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-yellow-500" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Biggest Prize So Far</h3>
                <p className="text-gray-300 mb-4">Draw #36 on June 11, 2025 had our largest prize pool to date!</p>
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Winner</div>
                    <div className="font-mono">0x8f...2c59</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Prize Amount</div>
                    <div className="text-xl font-bold text-cyan-400">175.32 USDC</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">TVL at Draw</div>
                    <div>20,950.00 USDC</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
