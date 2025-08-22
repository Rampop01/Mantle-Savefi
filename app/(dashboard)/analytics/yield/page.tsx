"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useContractRead, useContractReads } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as vaultAbi } from "@/hooks/abi/SaveFiVault"
import { formatUnits } from "viem"

export default function YieldAnalyticsPage() {
  const singleReads = useContractReads({
    contracts: [
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getTotalValueLocked" },
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getTotalYieldGenerated" },
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getCurrentAPY" },
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getCurrentPrizePool" },
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getNextDrawTime" },
    ],
    query: { refetchInterval: 15000 },
  } as any)

  const { data: drawsData, isLoading: drawsLoading, isError: drawsError } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: "getDrawHistory",
    args: [BigInt(0), BigInt(10)],
    query: { refetchInterval: 20000 },
  } as any)

  const tvl = singleReads?.data?.[0]?.result as bigint | undefined
  const totalYield = singleReads?.data?.[1]?.result as bigint | undefined
  const apyRaw = singleReads?.data?.[2]?.result as bigint | undefined
  const prizePool = singleReads?.data?.[3]?.result as bigint | undefined
  const nextDrawTs = singleReads?.data?.[4]?.result as bigint | undefined

  const draws = (drawsData as any[] | undefined) ?? []

  const fmt6 = (v?: bigint) => (typeof v !== 'undefined' ? Number(formatUnits(BigInt(v), 6)).toLocaleString() : "—")
  const fmtPct = (v?: bigint) => {
    if (v === undefined || v === null) return "—"
    try {
      const b = BigInt(v)
      if (b <= BigInt(10000)) {
        const num = Number(b) / 100
        return `${Math.min(num, 100).toFixed(2)}%`
      }
      if (b >= BigInt("1000000000000000")) {
        const s = formatUnits(b, 16)
        const num = parseFloat(s)
        return `${Math.min(num, 100).toFixed(2)}%`
      }
      const num = Number(b)
      return `${Math.min(num, 100).toFixed(2)}%`
    } catch {
      return "—"
    }
  }
  const fmtTs = (v?: bigint) => (typeof v !== 'undefined' ? new Date(Number(v) * 1000).toLocaleString() : "—")

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Yield Performance</h1>
        </div>
      </header>

      <main className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">TVL</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{fmt6(tvl)}{typeof tvl !== 'undefined' ? ' USDC' : ''}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">Total Yield</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-cyan-400">{fmt6(totalYield)}{typeof totalYield !== 'undefined' ? ' USDC' : ''}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">Current APY</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-400">{fmtPct(apyRaw)}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">Prize Pool</span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Current available pot for the next draw from accrued yield. On testnets this may be small.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{fmt6(prizePool)}{typeof prizePool !== 'undefined' ? ' USDC' : ''}</div></CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">Next Draw</CardTitle></CardHeader>
            <CardContent>
              <div className="text-lg">{fmtTs(nextDrawTs)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">Recent Draws</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg border border-purple-500/20 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Winner</TableHead>
                      <TableHead>Prize</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drawsLoading && (
                      <TableRow><TableCell colSpan={4} className="text-sm text-gray-400 text-center">Loading…</TableCell></TableRow>
                    )}
                    {drawsError && (
                      <TableRow><TableCell colSpan={4} className="text-sm text-red-400 text-center">Failed to load draw history</TableCell></TableRow>
                    )}
                    {!drawsLoading && !drawsError && draws.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-sm text-gray-400 text-center">No draws</TableCell></TableRow>
                    )}
                    {!drawsLoading && !drawsError && draws.length > 0 && (draws as any[]).map((d: any) => (
                      <TableRow key={String(d.id)}>
                        <TableCell className="font-medium">#{String(d.id)}</TableCell>
                        <TableCell>{fmtTs(d.timestamp)}</TableCell>
                        <TableCell className="font-mono">{(d.winner as string)?.slice(0,6)}...{(d.winner as string)?.slice(-4)}</TableCell>
                        <TableCell>{Number(formatUnits(d.prizeAmount as bigint, 6)).toLocaleString()} USDC</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
