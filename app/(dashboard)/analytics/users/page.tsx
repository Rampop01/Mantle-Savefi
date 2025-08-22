"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useContractRead, useContractReads } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as vaultAbi } from "@/hooks/abi/SaveFiVault"
import { formatUnits } from "viem"

export default function UserAnalyticsPage() {
  const singleReads = useContractReads({
    contracts: [
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getTotalParticipants" },
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getTotalValueLocked" },
      { address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, abi: vaultAbi, functionName: "getCurrentDrawId" },
    ],
  } as any)

  const { data: drawsData, isLoading: drawsLoading, isError: drawsError } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: "getDrawHistory",
    args: [BigInt(0), BigInt(10)],
  } as any)

  const participants = singleReads?.data?.[0]?.result as bigint | undefined
  const tvl = singleReads?.data?.[1]?.result as bigint | undefined
  const currentDrawId = singleReads?.data?.[2]?.result as bigint | undefined

  const draws = (drawsData as any[] | undefined) ?? []

  const fmt6 = (v?: bigint) => (v ? Number(formatUnits(v, 6)).toLocaleString() : "—")
  const fmtTs = (v?: bigint) => (v ? new Date(Number(v) * 1000).toLocaleString() : "—")

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">User Growth</h1>
        </div>
      </header>

      <main className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">Total Participants</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{participants !== undefined ? Number(participants).toLocaleString() : "—"}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">TVL</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{fmt6(tvl)} USDC</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">Current Draw</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{currentDrawId !== undefined ? `#${String(currentDrawId)}` : "—"}</div></CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-400">Recent Draw Participation</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-lg border border-purple-500/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Prize</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drawsLoading && (
                    <TableRow><TableCell colSpan={5} className="text-sm text-gray-400 text-center">Loading…</TableCell></TableRow>
                  )}
                  {drawsError && (
                    <TableRow><TableCell colSpan={5} className="text-sm text-red-400 text-center">Failed to load draws</TableCell></TableRow>
                  )}
                  {!drawsLoading && !drawsError && draws.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-sm text-gray-400 text-center">No draws</TableCell></TableRow>
                  )}
                  {!drawsLoading && !drawsError && draws.length > 0 && (draws as any[]).map((d: any) => (
                    <TableRow key={String(d.id)}>
                      <TableCell className="font-medium">#{String(d.id)}</TableCell>
                      <TableCell>{fmtTs(d.timestamp)}</TableCell>
                      <TableCell>{Number(d.participantCount).toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{(d.winner as string)?.slice(0,6)}...{(d.winner as string)?.slice(-4)}</TableCell>
                      <TableCell>{Number(formatUnits(d.prizeAmount as bigint, 6)).toLocaleString()} USDC</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
