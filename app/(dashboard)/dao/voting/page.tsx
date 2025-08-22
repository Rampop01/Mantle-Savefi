"use client"

import { Vote, History, TrendingUp, Users } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAccount, useContractReads, useWriteContract } from "wagmi"
import { useActiveProposals, useProposalCount, useUserVotingHistory, useVotingPower, useCastVote, useDelegate } from "@/hooks/use-governance"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as saveTokenAbi } from "@/hooks/abi/SaveToken"
import { formatUnits } from "viem"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function VotingPage() {
  const { address } = useAccount()
  const { data: votingPower } = useVotingPower(address as `0x${string}` | undefined)
  const { data: proposalCount } = useProposalCount()
  const { data: activeIds } = useActiveProposals()
  const { data: historyData } = useUserVotingHistory(address as `0x${string}` | undefined)
  const castVote = useCastVote()
  const delegateWrite = useDelegate()
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()

  const [delegateTo, setDelegateTo] = useState("")
  const isValidAddress = (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v)

  const handleDelegate = async (to?: string) => {
    try {
      // @ts-ignore
      if (!delegateWrite?.write) throw new Error("Wallet not ready")
      const target = (to && isValidAddress(to)) ? to : (address as `0x${string}`)
      // @ts-ignore
      const tx = await delegateWrite.write({ args: [target] })
      const hash = (tx as any)?.hash || (tx as any)
      const url = hash ? `https://explorer.sepolia.mantle.xyz/tx/${hash}` : undefined
      toast({
        title: "Delegation submitted",
        description: url ? (
          <a className="underline text-cyan-400" href={url} target="_blank" rel="noreferrer">View delegation tx on MantleScan</a>
        ) : `Delegated to ${target}`,
      })
    } catch (e: any) {
      toast({ title: "Delegation failed", description: e?.shortMessage || e?.message || String(e), variant: "destructive" })
    }
  }

  const handleVote = async (proposalId: bigint, support: boolean) => {
    try {
      let tx: any
      // Prefer hook write; fallback to direct writeContractAsync
      // @ts-ignore
      if (castVote?.write) {
        // @ts-ignore
        tx = await castVote.write({ args: [proposalId, support] })
      } else if (writeContractAsync) {
        tx = await writeContractAsync({
          address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
          abi: saveTokenAbi,
          functionName: 'castVote',
          args: [proposalId, support],
        })
      } else {
        throw new Error("Wallet not ready. Please connect your wallet and switch to Mantle Sepolia.")
      }
      const hash = (tx as any)?.hash || (tx as any)
      const url = hash ? `https://explorer.sepolia.mantle.xyz/tx/${hash}` : undefined
      toast({
        title: "Vote submitted",
        description: url ? (
          <a className="underline text-cyan-400" href={url} target="_blank" rel="noreferrer">View vote tx on MantleScan</a>
        ) : `Casting vote on #${proposalId}`,
      })
    } catch (e: any) {
      toast({ title: "Vote failed", description: e?.shortMessage || e?.message || String(e), variant: "destructive" })
    }
  }

  const activeIdsArr = (activeIds as readonly bigint[] | undefined) ?? []
  const { data: activeProposals } = useContractReads({
    contracts: activeIdsArr.map((id) => ({
      address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
      abi: saveTokenAbi,
      functionName: "getProposal",
      args: [id],
    })),
    enabled: activeIdsArr.length > 0,
  } as any)

  // User votes for active proposals
  const { data: activeUserVotes } = useContractReads({
    contracts: address && activeIdsArr.length > 0 ? activeIdsArr.map((id) => ({
      address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
      abi: saveTokenAbi,
      functionName: "getUserVote",
      args: [id, address as `0x${string}`],
    })) : [],
    enabled: !!address && activeIdsArr.length > 0,
  } as any)

  const historyArr = (historyData as any[] | undefined) ?? []
  const historyIds = Array.from(new Set(historyArr.map((r: any) => BigInt(r.proposalId))))
  const { data: historyProposals } = useContractReads({
    contracts: historyIds.map((id) => ({
      address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
      abi: saveTokenAbi,
      functionName: "getProposal",
      args: [id],
    })),
    enabled: historyIds.length > 0,
  } as any)

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Voting Dashboard</h1>
        </div>
        <Button
          disabled={!votingPower || (votingPower as bigint) === BigInt(0) || activeIdsArr.length === 0}
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
              <div className="text-2xl font-bold">{votingPower ? `${Number(formatUnits(votingPower as bigint, 18)).toLocaleString()} $SAVE` : '0 $SAVE'}</div>
              <div className="text-sm text-gray-400">Voting power based on your delegated balance</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{historyArr.length}</div>
              <div className="text-sm text-gray-400">Out of {proposalCount ? Number(proposalCount as bigint).toLocaleString() : '—'} proposals</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Participation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proposalCount && Number(proposalCount as bigint) > 0 ? `${((historyArr.length / Number(proposalCount as bigint)) * 100).toFixed(1)}%` : '0%'}</div>
              <div className="text-sm text-gray-400">Based on total proposals</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Delegation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Set Delegation</div>
              <div className="text-sm text-gray-400 mb-3">Delegate your votes to yourself or another address</div>
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  disabled={!address}
                  onClick={() => handleDelegate()}
                >
                  Self-Delegate
                </Button>
                <Button
                  variant="outline"
                  disabled={!address || !isValidAddress(delegateTo)}
                  onClick={() => handleDelegate(delegateTo)}
                >
                  Delegate
                </Button>
              </div>
              <Input placeholder="Delegatee 0x..." value={delegateTo} onChange={(e) => setDelegateTo(e.target.value)} />
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
              {activeProposals && (activeProposals as any[]).length > 0 ? (activeProposals as any[]).map((res: any, idx: number) => {
                const p = res?.result as any
                if (!p) return null
                const now = Math.floor(Date.now()/1000)
                const end = Number(p.endTime)
                const timeLeftSec = Math.max(0, end - now)
                const totalVotes = Number(p.forVotes) + Number(p.againstVotes)
                const participation = totalVotes // no supply denominator available here
                return (
                  <div key={String(p.id)} className="p-4 rounded-lg bg-white/5 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">#{String(p.id)} {p.title}</h4>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{timeLeftSec > 0 ? `${Math.floor(timeLeftSec/86400)}d ${Math.floor((timeLeftSec%86400)/3600)}h left` : 'Ended'}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-3">
                      <span>Status: {Number(p.forVotes) >= Number(p.againstVotes) ? 'Leading For' : 'Leading Against'}</span>
                      <span>Participation: {participation.toLocaleString()} votes</span>
                    </div>
                    {activeUserVotes && address && (() => {
                      const idx = activeIdsArr.findIndex((id) => String(id) === String(p.id))
                      const uv = (activeUserVotes as any[])[idx]?.result
                      if (!uv || !uv.hasVoted) return null
                      return (
                        <div className="mb-3">
                          <Badge variant="outline" className="border-purple-500/30 text-gray-300">
                            You voted {uv.support ? 'For' : 'Against'} ({Number(uv.votes).toLocaleString()} votes)
                          </Badge>
                        </div>
                      )
                    })()}
                    <div className="flex gap-2">
                      <Button
                        disabled={!votingPower || (votingPower as bigint) === BigInt(0)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-green-500/20 hover:bg-green-500/10 bg-transparent disabled:opacity-50"
                        onClick={() => handleVote(p.id as bigint, true)}
                      >
                        Vote For
                      </Button>
                      <Button
                        disabled={!votingPower || (votingPower as bigint) === BigInt(0)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500/20 hover:bg-red-500/10 bg-transparent disabled:opacity-50"
                        onClick={() => handleVote(p.id as bigint, false)}
                      >
                        Vote Against
                      </Button>
                    </div>
                  </div>
                )
              }) : (
                <div className="p-4 rounded-lg bg-white/5 mb-4 text-sm text-gray-400">No active proposals</div>
              )}
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
                    {historyArr.length > 0 ? historyArr.map((rec: any, index: number) => {
                      const id = BigInt(rec.proposalId)
                      const propIdx = historyIds.findIndex((x) => x === id)
                      const prop = historyProposals && (historyProposals as any[])[propIdx]?.result
                      const title = prop ? `#${String(prop.id)} ${prop.title}` : `#${String(id)}`
                      const result = prop ? (Number(prop.forVotes) >= Number(prop.againstVotes) ? 'Passed' : 'Failed') : '—'
                      return (
                        <TableRow key={`${String(id)}-${index}`} className="hover:bg-white/5">
                          <TableCell className="font-medium">{title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-gray-400">
                              {rec.support ? 'For' : 'Against'} ({Number(rec.votes).toLocaleString()} votes)
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                result === 'Passed'
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                            >
                              {result}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    }) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-sm text-gray-400">No voting history</TableCell>
                      </TableRow>
                    )}
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
