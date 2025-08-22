"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Clock, TrendingUp, Trophy, Wallet, ArrowRight, RefreshCw, ChevronRight } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ConnectButton } from "@/components/connect-button"
import { useAccount, useContractRead, useContractWrite, useWaitForTransactionReceipt, useChainId } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as vaultAbi } from "@/hooks/abi/SaveFiVault"
import { formatUnits } from "viem"
import { useMounted } from "@/hooks/use-mounted"

export default function Dashboard() {
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const mounted = useMounted()
  const { address, isConnected } = useAccount()
  const connected = mounted && isConnected
  const chainId = useChainId()
  const wrongNetwork = chainId !== 5003

  // Helpers
  const formatPercent = (raw?: bigint): string => {
    if (raw === undefined || raw === null) return '—'
    try {
      const v = BigInt(raw)
      // Heuristics:
      // - If value is small (<= 10_000), interpret as basis points (0..10000 => 0..100.00%)
      if (v <= BigInt(10000)) {
        const num = Number(v) / 100
        const clamped = Math.min(num, 100)
        if (clamped > 0 && clamped < 0.01) return '<0.01%'
        return `${clamped.toFixed(2)}%`
      }
      // - If value is very large, interpret as 1e18 fixed point fraction (e.g., 1.0 = 1e18)
      if (v >= BigInt("1000000000000000")) {
        // Convert fraction to percent: (v / 1e18) * 100 => divide by 1e16
        const s = formatUnits(v, 16)
        const num = parseFloat(s)
        const clamped = Math.min(num, 100)
        if (clamped > 0 && clamped < 0.01) return '<0.01%'
        return `${clamped.toFixed(2)}%`
      }
      // Otherwise assume it's already a percent value (0..100) with 2 decimals scaled by 1?
      const num = Number(v)
      const clamped = Math.min(num, 100)
      if (clamped > 0 && clamped < 0.01) return '<0.01%'
      return `${clamped.toFixed(2)}%`
    } catch {
      return '—'
    }
  }
  const formatUsdc = (raw?: bigint): string => {
    if (raw === undefined || raw === null) return '—'
    try {
      const v = BigInt(raw)
      const s = formatUnits(v, 6)
      const num = parseFloat(s)
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) + ' USDC'
    } catch {
      return '—'
    }
  }

  // On-chain reads
  const { data: tvl } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getTotalValueLocked',
  } as any)
  const { data: userStats } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getUserStats',
    args: address ? [address as `0x${string}`] : undefined,
    enabled: connected && !!address,
  } as any)
  const { data: drawHistory, refetch: refetchDrawHistory } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getDrawHistory',
    args: [0, 3],
    // Refresh history periodically
    query: { refetchInterval: 15000 },
  } as any)
  const { data: prize } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getCurrentPrizePool',
  } as any)
  const { data: totalParticipants } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getTotalParticipants',
  } as any)
  const { data: totalYield } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getTotalYieldGenerated',
    // Keep fresh
    query: { refetchInterval: 15000 },
  } as any)
  const { data: apy } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getCurrentAPY',
    query: { refetchInterval: 30000 },
  } as any)
  const { data: nextDrawTs, refetch: refetchNextDraw } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getNextDrawTime',
    // Poll for countdown freshness
    query: { refetchInterval: 10000 },
  } as any)
  const { data: userBal } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    enabled: connected && !!address,
  } as any)
  const { data: userChance } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getUserWinningChance',
    args: address ? [address as `0x${string}`] : undefined,
    enabled: connected && !!address,
    query: { refetchInterval: 15000 },
  } as any)

  // Countdown
  const [remaining, setRemaining] = useState<number>(0)
  useEffect(() => {
    const id = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const ts = Number(nextDrawTs ?? 0)
      if (ts > 0) {
        setRemaining(Math.max(0, ts - now))
      } else {
        setRemaining(0)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [nextDrawTs])
  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60
  // const [isConnected, setIsConnected] = useState(false) // Mock connection status

  // Simulate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(65)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleDepositClick = () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deposit.",
        variant: "destructive",
      })
    } else {
      // Navigate to the vault page if connected
      window.location.href = "/vault"
    }
  }

  // Execute draw action
  const { data: execHash, writeContract: writeExecute, isPending: execPending } = useContractWrite()
  const { isLoading: execMining, isSuccess: execSuccess, isError: execError } = useWaitForTransactionReceipt({ hash: execHash })
  useEffect(() => {
    if (execSuccess) {
      toast({ title: 'Draw executed', description: 'A new draw has been executed successfully.' })
      // Refresh on-chain state
      refetchDrawHistory()
      refetchNextDraw()
    }
  }, [execSuccess, toast, refetchDrawHistory, refetchNextDraw])
  useEffect(() => {
    if (execError) {
      toast({ title: 'Execution failed', description: 'Transaction failed or was rejected.', variant: 'destructive' })
    }
  }, [execError, toast])
  const onExecuteDraw = () => {
    if (wrongNetwork) {
      toast({ title: 'Wrong network', description: 'Please switch to Mantle Sepolia (5003).', variant: 'destructive' })
      return
    }
    writeExecute({
      address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
      abi: vaultAbi,
      functionName: 'executeDraw',
    })
  }

  // const handleConnectWallet = () => {
  //   // Mock connect wallet function
  //   setIsConnected(true)
  //   toast({
  //     title: "Wallet Connected",
  //     description: "Your wallet is now connected.",
  //   })
  // }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <ConnectButton />
      </header>

      {/* Main content */}
      <main className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2 space-y-6">
            {/* Welcome card */}
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

                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Welcome to SaveFi</h2>
                  <p className="text-gray-300 mb-6 max-w-lg">
                    Start saving with our no-loss lottery vault. Deposit your stablecoins, earn yield, and get a chance
                    to win weekly prizes.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="bg-white text-purple-700 hover:bg-white/90" onClick={handleDepositClick}>
                      <Link href="/vault">
                        Deposit Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Wallet className="mr-2 h-4 w-4 text-purple-400" />
                    Your Deposits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userBal ? `${Number(formatUnits(userBal as bigint, 6)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} USDC` : (connected ? '0.00 USDC' : 'Connect wallet')}</div>
                  <p className="text-sm text-gray-400">
                    {connected ? "Your deposits will appear here" : "Connect wallet to view your deposits"}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 p-0">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-cyan-400" />
                    Your Chances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{connected ? formatPercent(userChance as bigint | undefined) : '0%'}</div>
                  <p className="text-sm text-gray-400">
                    {connected
                      ? "Deposit to increase your winning chances"
                      : "Connect wallet to view your winning chances"}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-0">
                    Increase Odds
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Recent winners (from draw history) */}
            <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Recent Winners
                </CardTitle>
                <CardDescription>The latest lucky winners from our weekly draws</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(drawHistory) && (drawHistory as any[]).length > 0 ? (
                    (drawHistory as any[]).map((d: any, i: number) => (
                      <div key={`${String(d.id)}-${i}`} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div>
                            <div className="font-medium">{`${String(d.winner).slice(0,6)}...${String(d.winner).slice(-4)}`}</div>
                            <div className="text-sm text-gray-400">Draw #{String(d.id)} • {new Date(Number(d.timestamp) * 1000).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{`${Number(formatUnits(d.prizeAmount as bigint, 6)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} USDC`}</div>
                          <div className="text-sm text-cyan-400 flex items-center justify-end">
                            View
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400">No draws yet</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-purple-500/20 hover:bg-purple-500/10 bg-transparent">
                  View All Winners
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Next draw card */}
            <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-purple-400" />
                  Next Draw
                </CardTitle>
                <div className="flex items-center justify-between">
                  <CardDescription>Next draw countdown</CardDescription>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => { refetchNextDraw(); refetchDrawHistory(); }}>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Time Remaining</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{days}</div><div className="text-xs text-gray-400">Days</div></div>
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{hours}</div><div className="text-xs text-gray-400">Hours</div></div>
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{minutes}</div><div className="text-xs text-gray-400">Mins</div></div>
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{seconds}</div><div className="text-xs text-gray-400">Secs</div></div>
                  </div>
                  {Number(nextDrawTs ?? 0) === 0 && (
                    <div className="text-xs text-gray-400 mt-2">Not scheduled yet</div>
                  )}
                  {process.env.NODE_ENV !== 'production' && (
                    <div className="text-[10px] text-gray-500 mt-1">nextDrawTs: {String(nextDrawTs ?? '—')} • now: {Math.floor(Date.now()/1000)}</div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm text-gray-400 cursor-help">Prize Pool</div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Current available pot for the next draw from accrued yield. On testnets this may be small.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="text-sm font-medium">{typeof prize !== 'undefined' ? `${Number(formatUnits(prize as bigint, 6)).toLocaleString()} USDC` : '—'}</div>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-white/10"
                  />
                </div>

                <div className="p-3 rounded-lg bg-white/10 mb-4">
                  <div className="flex justify-between mb-1">
                    <div className="text-sm">Total Deposits</div>
                    <div className="text-sm font-medium">{typeof tvl !== 'undefined' ? `${Number(formatUnits(tvl as bigint, 6)).toLocaleString()} USDC` : '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">Your Deposits</div>
                    <div className="text-sm font-medium">{typeof userBal !== 'undefined' ? `${Number(formatUnits(userBal as bigint, 6)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} USDC` : (connected ? '0.00 USDC' : 'Connect wallet')}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {remaining <= 0 && Number(nextDrawTs ?? 0) > 0 ? (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
                    onClick={onExecuteDraw}
                    disabled={!connected || wrongNetwork || execPending || execMining}
                  >
                    {wrongNetwork ? 'Switch to Mantle Sepolia' : (execPending || execMining ? 'Executing…' : 'Execute Draw')}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
                    onClick={() => {
                      if (!connected) {
                        toast({
                          title: "Wallet Not Connected",
                          description: "Please connect your wallet to deposit.",
                          variant: "destructive",
                        })
                      } else {
                        window.location.href = "/vault"
                      }
                    }}
                  >
                    Deposit to Enter
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Protocol stats (on-chain) */}
            <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Protocol Stats</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm text-gray-400 cursor-help">Total Value Locked</div>
                      </TooltipTrigger>
                      <TooltipContent side="top">Total value of all user deposits currently in the vault (USDC).</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="font-medium">{typeof tvl !== 'undefined' ? `${Number(formatUnits(tvl as bigint, 6)).toLocaleString()} USDC` : '—'}</div>
                </div>
                <div className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm text-gray-400 cursor-help">Total Prizes Awarded</div>
                      </TooltipTrigger>
                      <TooltipContent side="top">Cumulative USDC prizes distributed across all draws.</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="font-medium">{typeof totalYield !== 'undefined' ? formatUsdc(totalYield as bigint) : '—'}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-400">Total Participants</div>
                  <div className="font-medium">{totalParticipants ? Number(totalParticipants as bigint).toLocaleString() : '—'}</div>
                </div>
                <div className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm text-gray-400 cursor-help">Current APY</div>
                      </TooltipTrigger>
                      <TooltipContent side="top">Current annualized yield rate used to grow the prize pool. May fluctuate.</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="font-medium text-green-400">{typeof apy !== 'undefined' ? formatPercent(apy as bigint) : '—'}</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent activity (user stats when connected) */}
            <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isConnected && userStats ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total Deposited</span><span className="font-medium">{`${Number(formatUnits((userStats as any).totalDeposited as bigint, 6)).toLocaleString()} USDC`}</span></div>
                    <div className="flex justify-between"><span>Total Winnings</span><span className="font-medium">{`${Number(formatUnits((userStats as any).totalWinnings as bigint, 6)).toLocaleString()} USDC`}</span></div>
                    <div className="flex justify-between"><span>Draws Won</span><span className="font-medium">{`${Number((userStats as any).drawsWon)}`}</span></div>
                    <div className="flex justify-between"><span>Last Deposit</span><span className="font-medium">{Number((userStats as any).lastDepositTime) > 0 ? new Date(Number((userStats as any).lastDepositTime) * 1000).toLocaleString() : '—'}</span></div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 text-center py-6">{isConnected ? 'No recent data' : 'Connect your wallet to view your activity'}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-500/20 hover:bg-purple-500/10 bg-transparent"
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
