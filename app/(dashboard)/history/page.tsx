"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Calendar, Search, Trophy, Filter, Download } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useContractRead } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as vaultAbi } from "@/hooks/abi/SaveFiVault"
import { formatUnits } from "viem"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function formatDuration(ms: number) {
  if (ms <= 0) return "Now"
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [featuredN, setFeaturedN] = useState<number>(5)

  const offset = useMemo(() => BigInt((page - 1) * pageSize), [page])
  const limit = useMemo(() => BigInt(pageSize), [])

  const { data: drawsData, isLoading, isError } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: "getDrawHistory",
    args: [offset, limit],
  } as any)

  const { data: nextDrawTime } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: "getNextDrawTime",
  } as any)

  // Compute from the most recent N draws (user selectable: 3 or 5)
  const LAST_N_FEATURED = useMemo(() => BigInt(featuredN), [featuredN])
  const { data: currentDrawId } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: "getCurrentDrawId",
  } as any)

  const featuredOffset = useMemo(() => {
    const id = (currentDrawId as bigint | undefined) ?? 0n
    if (id <= 0n) return 0n
    return id >= (LAST_N_FEATURED - 1n) ? id - (LAST_N_FEATURED - 1n) : 0n
  }, [currentDrawId, LAST_N_FEATURED])
  const featuredLimit = useMemo(() => {
    const id = (currentDrawId as bigint | undefined) ?? 0n
    if (id <= 0n) return 0n
    const count = id - featuredOffset + 1n
    return count > LAST_N_FEATURED ? LAST_N_FEATURED : count
  }, [currentDrawId, featuredOffset, LAST_N_FEATURED])

  const { data: featuredWindow, isLoading: featuredLoading, isError: featuredError } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: "getDrawHistory",
    args: [featuredOffset, featuredLimit],
    query: { enabled: (featuredLimit as unknown as bigint) !== 0n },
  } as any)

  const draws = (drawsData as any[] | undefined) ?? []
  const now = Date.now()
  const nextTsMs = nextDrawTime ? Number(nextDrawTime as bigint) * 1000 : 0
  const nextIn = formatDuration(nextTsMs - now)

  const filtered = useMemo(() => {
    if (!searchQuery) return draws
    const q = searchQuery.toLowerCase()
    return (draws as any[]).filter((d: any) =>
      String(d.id).includes(q) || (d.winner as string)?.toLowerCase().includes(q),
    )
  }, [draws, searchQuery])

  const fmt6 = (v?: bigint) => (v ? Number(formatUnits(v, 6)).toLocaleString() : "—")
  const fmtTs = (v?: bigint) => (v ? new Date(Number(v) * 1000).toLocaleString() : "—")

  const featuredDraw = useMemo(() => {
    const arr = (featuredWindow as any[] | undefined) ?? []
    if (!arr.length) return undefined
    return arr.reduce((max: any, cur: any) => (max && max.prizeAmount > cur.prizeAmount ? max : cur), arr[0])
  }, [featuredWindow])

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
          Next Draw: {nextIn}
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
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-400">Loading…</TableCell>
                    </TableRow>
                  )}
                  {isError && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-red-400">Failed to load draw history</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && !isError && filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-400">No draws found</TableCell>
                    </TableRow>
                  )}
                  {!isLoading && !isError && filtered.length > 0 && (filtered as any[]).map((d: any) => (
                    <TableRow key={String(d.id)} className="hover:bg-white/5">
                      <TableCell className="font-medium">{String(d.id)}</TableCell>
                      <TableCell>{fmtTs(d.timestamp)}</TableCell>
                      <TableCell className="font-mono">{(d.winner as string)?.slice(0,6)}...{(d.winner as string)?.slice(-4)}</TableCell>
                      <TableCell className="font-medium text-cyan-400">{fmt6(d.prizeAmount)} USDC</TableCell>
                      <TableCell className="hidden md:table-cell">{Number(d.participantCount).toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{fmt6(d.totalValueLocked)} USDC</TableCell>
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
                    <PaginationPrevious href="#" onClick={(e)=>{e.preventDefault(); setPage((p)=>Math.max(1,p-1))}} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e)=>{e.preventDefault(); setPage((p)=>p+1)}} />
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
                <div className="mb-3 flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-xs text-gray-400">Based on last</span>
                  <Select value={String(featuredN)} onValueChange={(v)=>setFeaturedN(Number(v))}>
                    <SelectTrigger className="w-[90px] h-8 bg-white/10 border-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 draws</SelectItem>
                      <SelectItem value="5">5 draws</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {featuredLoading && (
                  <p className="text-gray-300 mb-4">Loading largest prize…</p>
                )}
                {featuredError && (
                  <p className="text-red-400 mb-4">Failed to load largest prize</p>
                )}
                {!featuredLoading && !featuredError && !featuredDraw && (
                  <p className="text-gray-300 mb-4">No draws yet</p>
                )}
                {!featuredLoading && !featuredError && featuredDraw && (
                  <p className="text-gray-300 mb-4">Draw #{String(featuredDraw.id)} on {fmtTs(featuredDraw.timestamp)} had our largest prize pool to date!</p>
                )}
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Winner</div>
                    <div className="font-mono">{featuredDraw ? `${(featuredDraw.winner as string)?.slice(0,6)}...${(featuredDraw.winner as string)?.slice(-4)}` : "—"}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Prize Amount</div>
                    <div className="text-xl font-bold text-cyan-400">{featuredDraw ? `${fmt6(featuredDraw.prizeAmount)} USDC` : "—"}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">TVL at Draw</div>
                    <div>{featuredDraw ? `${fmt6(featuredDraw.totalValueLocked)} USDC` : "—"}</div>
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
