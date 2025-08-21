"use client"

import { Vote, Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccount, useContractReads, useWatchContractEvent } from "wagmi"
import { useActiveProposals, useProposalCount, useQuorumRequired, useVotingPower, useCastVote, useCreateProposal, useExecuteProposal } from "@/hooks/use-governance"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as saveTokenAbi } from "@/hooks/abi/SaveToken"
import { formatUnits } from "viem"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ProposalsPage() {
  const { address } = useAccount()
  const { data: votingPower } = useVotingPower(address as `0x${string}` | undefined)
  const { data: proposalCount } = useProposalCount()
  const { data: activeIds } = useActiveProposals()
  const { data: quorum } = useQuorumRequired()
  const castVote = useCastVote()
  const createProposal = useCreateProposal()
  const executeProposal = useExecuteProposal()
  const { toast } = useToast()

  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [executed, setExecuted] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

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

  // Read user's vote on active proposals
  const { data: activeUserVotes } = useContractReads({
    contracts: address && activeIdsArr.length > 0 ? activeIdsArr.map((id) => ({
      address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
      abi: saveTokenAbi,
      functionName: "getUserVote",
      args: [id, address as `0x${string}`],
    })) : [],
    enabled: !!address && activeIdsArr.length > 0,
  } as any)

  // Pagination over proposals using proposalCount
  const { totalPages, recentIds } = useMemo(() => {
    const count = Number((proposalCount as bigint) || BigInt(0))
    if (!count) return { totalPages: 0, recentIds: [] as bigint[] }
    const total = Math.ceil(count / PAGE_SIZE)
    const clampedPage = Math.max(1, Math.min(page, total))
    const start = count - (clampedPage - 1) * PAGE_SIZE
    const end = Math.max(1, start - PAGE_SIZE + 1)
    const ids: bigint[] = []
    for (let i = start; i >= end; i--) ids.push(BigInt(i))
    return { totalPages: total, recentIds: ids }
  }, [proposalCount, page])

  const { data: recentProposals } = useContractReads({
    contracts: recentIds.map((id) => ({
      address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
      abi: saveTokenAbi,
      functionName: "getProposal",
      args: [id],
    })),
    enabled: recentIds.length > 0,
  } as any)

  const { data: recentUserVotes } = useContractReads({
    contracts: address && recentIds.length > 0 ? recentIds.map((id) => ({
      address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
      abi: saveTokenAbi,
      functionName: "getUserVote",
      args: [id, address as `0x${string}`],
    })) : [],
    enabled: !!address && recentIds.length > 0,
  } as any)

  const handleExecute = async (proposalId: bigint) => {
    try {
      // @ts-ignore
      if (!executeProposal?.write) throw new Error("Wallet not ready")
      // @ts-ignore
      const tx = await executeProposal.write({ args: [proposalId] })
      const hash = (tx as any)?.hash || (tx as any)
      const url = hash ? `https://explorer.sepolia.mantle.xyz/tx/${hash}` : undefined
      toast({ title: "Transaction sent", description: url ? `Executing #${proposalId} → ${url}` : `Executing proposal #${proposalId}` })
    } catch (e: any) {
      toast({ title: "Execute failed", description: e?.shortMessage || e?.message || String(e), variant: "destructive" })
    }
  }

  const handleVote = async (proposalId: bigint, support: boolean) => {
    try {
      // @ts-ignore
      if (!castVote?.write) throw new Error("Wallet not ready")
      // @ts-ignore
      const tx = await castVote.write({ args: [proposalId, support] })
      toast({ title: "Transaction sent", description: `Casting vote on #${proposalId}` })
      // wagmi v2 returns hash; optional wait handled by wallet UI
    } catch (e: any) {
      toast({ title: "Vote failed", description: e?.shortMessage || e?.message || String(e), variant: "destructive" })
    }
  }

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: "Missing fields", description: "Please fill in title and description", variant: "destructive" })
      return
    }
    try {
      setSubmitting(true)
      // @ts-ignore
      if (!createProposal?.write) throw new Error("Wallet not ready")
      // data bytes left empty for now
      // @ts-ignore
      await createProposal.write({ args: [title.trim(), description.trim(), "0x"] })
      toast({ title: "Proposal submitted", description: title })
      setTitle("")
      setDescription("")
      setCreateOpen(false)
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.shortMessage || e?.message || String(e), variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
      case "executed":
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Executed</Badge>
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
      case "executed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Watch executed events to show live status + set executed flag
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN as `0x${string}`,
    abi: saveTokenAbi,
    eventName: 'ProposalExecuted',
    onLogs: (logs: any[]) => {
      logs.forEach((log: any) => {
        const id = String(log.args?.proposalId)
        const txHash = log.transactionHash
        setExecuted((prev) => new Set([...prev, id]))
        const url = txHash ? `https://explorer.sepolia.mantle.xyz/tx/${txHash}` : undefined
        toast({ title: `Proposal #${id} executed`, description: url || undefined })
      })
    },
  })

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">DAO Proposals</h1>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <Button
            disabled={!votingPower || (votingPower as bigint) === BigInt(0)}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none disabled:opacity-50 inline-flex items-center px-4 py-2 rounded-md"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Proposal
          </Button>
          <DialogContent className="bg-background border-purple-500/20">
            <DialogHeader>
              <h3 className="text-lg font-semibold">Create Proposal</h3>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea rows={6} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Button disabled={submitting} onClick={handleCreate} className="w-full">
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="p-4 md:p-6">
        {!votingPower || (votingPower as bigint) === BigInt(0) && (
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
              <div className="text-2xl font-bold">{votingPower ? `${Number(formatUnits(votingPower as bigint, 18)).toLocaleString()} $SAVE` : '0 $SAVE'}</div>
              <div className="text-sm text-gray-400">Voting power based on your delegated balance</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeIdsArr.length}</div>
              <div className="text-sm text-gray-400">Currently voting</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proposalCount ? Number(proposalCount as bigint).toLocaleString() : '—'}</div>
              <div className="text-sm text-gray-400">All time</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {activeProposals && (activeProposals as any[]).length > 0 ? (activeProposals as any[]).map((res: any, idx: number) => {
            const p = res?.result as any
            if (!p) return null
            const now = Math.floor(Date.now()/1000)
            const end = Number(p.endTime)
            const timeLeftSec = Math.max(0, end - now)
            const status = timeLeftSec > 0 ? 'active' : ((Number(p.forVotes) >= Number(p.againstVotes)) ? 'passed' : 'failed')
            const totalVotes = Number(p.forVotes) + Number(p.againstVotes)
            return (
            <Card key={String(p.id)} className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(status)}
                      <CardTitle className="text-lg">
                        #{String(p.id)} {p.title}
                      </CardTitle>
                      {getStatusBadge(status)}
                    </div>
                    <CardDescription>{p.description}</CardDescription>
                    <div className="text-sm text-gray-400 mt-2">
                      Proposed by {`${String(p.proposer).slice(0,6)}...${String(p.proposer).slice(-4)}`} • {timeLeftSec > 0 ? `${Math.floor(timeLeftSec/86400)}d ${Math.floor((timeLeftSec%86400)/3600)}h left` : 'Ended'}
                    </div>
                    {activeUserVotes && address && (
                      (() => {
                        const idx = activeIdsArr.findIndex((id) => String(id) === String(p.id))
                        const uv = (activeUserVotes as any[])[idx]?.result
                        if (!uv || !uv.hasVoted) return null
                        return (
                          <div className="mt-2">
                            <Badge variant="outline" className="border-purple-500/30 text-gray-300">
                              You voted {uv.support ? 'For' : 'Against'} ({Number(uv.votes).toLocaleString()} votes)
                            </Badge>
                          </div>
                        )
                      })()
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-green-400">For: {Number(p.forVotes).toLocaleString()}</span>
                      <span className="text-sm text-red-400">Against: {Number(p.againstVotes).toLocaleString()}</span>
                    </div>
                    <Progress
                      value={Number(p.forVotes) + Number(p.againstVotes) === 0 ? 0 : (Number(p.forVotes) / (Number(p.forVotes) + Number(p.againstVotes))) * 100}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Total Votes: {Number(p.forVotes) + Number(p.againstVotes)}</span>
                      <span>Quorum: {quorum ? Number(quorum as bigint).toLocaleString() : '—'}</span>
                    </div>
                  </div>

                  {status === "active" && (
                    <div className="flex gap-2">
                      <Button
                        disabled={!votingPower || (votingPower as bigint) === BigInt(0)}
                        variant="outline"
                        className="flex-1 border-green-500/20 hover:bg-green-500/10 bg-transparent disabled:opacity-50"
                        onClick={() => handleVote(p.id as bigint, true)}
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Vote For
                      </Button>
                      <Button
                        disabled={!votingPower || (votingPower as bigint) === BigInt(0)}
                        variant="outline"
                        className="flex-1 border-red-500/20 hover:bg-red-500/10 bg-transparent disabled:opacity-50"
                        onClick={() => handleVote(p.id as bigint, false)}
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Vote Against
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>)
          }) : (
            <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-sm text-gray-400">No active proposals</CardContent>
            </Card>
          )}
        </div>

        {/* Executable Proposals */}
        {recentProposals && (recentProposals as any[]).length > 0 && (() => {
          const execCards = (recentProposals as any[]).map((res: any) => res?.result as any).filter(Boolean).filter((p: any) => {
            const now = Math.floor(Date.now()/1000)
            const ended = Number(p.endTime) <= now
            const passed = Number(p.forVotes) >= Number(p.againstVotes)
            const totalVotes = Number(p.forVotes) + Number(p.againstVotes)
            const quorumNum = quorum ? Number(quorum as bigint) : 0
            const isExec = executed.has(String(p.id))
            return ended && passed && totalVotes >= quorumNum && !isExec
          })
          if (execCards.length === 0) return null
          return (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold">Executable Proposals</h3>
              {execCards.map((p: any) => (
                <Card key={`exec-${String(p.id)}`} className="bg-white/5 border-green-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <CardTitle className="text-lg">#{String(p.id)} {p.title}</CardTitle>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ready</Badge>
                    </div>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        For: {Number(p.forVotes).toLocaleString()} • Against: {Number(p.againstVotes).toLocaleString()}
                      </div>
                      <Button onClick={() => handleExecute(p.id as bigint)} className="bg-white text-purple-700 hover:bg-white/90">Execute</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        })()}

        {/* Paged Proposals */}
        {recentProposals && (recentProposals as any[]).length > 0 && (
          <div className="space-y-6 mt-8">
            {(recentProposals as any[]).map((res: any) => {
              const p = res?.result as any
              if (!p) return null
              const now = Math.floor(Date.now()/1000)
              const end = Number(p.endTime)
              const timeLeftSec = Math.max(0, end - now)
              let status = timeLeftSec > 0 ? 'active' : ((Number(p.forVotes) >= Number(p.againstVotes)) ? 'passed' : 'failed')
              if (executed.has(String(p.id))) status = 'executed'
              if (status === 'active') return null
              const totalVotes = Number(p.forVotes) + Number(p.againstVotes)
              const quorumNum = quorum ? Number(quorum as bigint) : 0
              const canExecute = status === 'passed' && totalVotes >= quorumNum
              const myVoteBadge = (() => {
                if (!recentUserVotes || !address) return null
                const idx = recentIds.findIndex((id) => String(id) === String(p.id))
                const uv = (recentUserVotes as any[])[idx]?.result
                if (!uv || !uv.hasVoted) return null
                return (
                  <Badge variant="outline" className="border-purple-500/30 text-gray-300">
                    You voted {uv.support ? 'For' : 'Against'} ({Number(uv.votes).toLocaleString()} votes)
                  </Badge>
                )
              })()
              return (
                <Card key={`ended-${String(p.id)}`} className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(status)}
                          <CardTitle className="text-lg">#{String(p.id)} {p.title}</CardTitle>
                          {getStatusBadge(status)}
                        </div>
                        <CardDescription>{p.description}</CardDescription>
                        <div className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                          <span>Proposed by {`${String(p.proposer).slice(0,6)}...${String(p.proposer).slice(-4)}`}</span>
                          {myVoteBadge}
                        </div>
                      </div>
                      {canExecute && (
                        <Button onClick={() => handleExecute(p.id as bigint)} className="bg-white text-purple-700 hover:bg-white/90">
                          Execute
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">For: {Number(p.forVotes).toLocaleString()}</span>
                        <span className="text-red-400">Against: {Number(p.againstVotes).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Total Votes: {totalVotes.toLocaleString()}</span>
                        <span>Quorum: {quorumNum ? quorumNum.toLocaleString() : '—'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {/* Pagination controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-400">Page {Math.min(page, totalPages) || 0} of {totalPages}</div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                <Button variant="outline" disabled={totalPages === 0 || page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          </div>
        )}

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
