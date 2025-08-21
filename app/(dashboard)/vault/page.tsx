"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Clock, Info, RefreshCw, Shield, ChevronDown, Wallet } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { ConnectButton } from "@/components/connect-button"
import { DepositForm } from "@/components/vault/deposit-form"
import { CONTRACT_ADDRESSES } from "@/config/web3"
import { abi as vaultAbi } from "@/hooks/abi/SaveFiVault"
import { useAccount, useContractRead, useContractWrite, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState("deposit")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()
  const { address, isConnected } = useAccount()

  // Reads: TVL, APY, Prize, Next Draw Time, User balance
  const { data: tvl } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getTotalValueLocked',
  } as any)
  const { data: apy } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getCurrentAPY',
  } as any)
  const { data: prize } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getCurrentPrizePool',
  } as any)
  const { data: nextDrawTs } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'getNextDrawTime',
  } as any)
  const { data: userBal } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    enabled: isConnected && !!address,
  } as any)

  // Next draw countdown
  const [remaining, setRemaining] = useState<number>(0)
  useEffect(() => {
    const id = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const ts = Number(nextDrawTs ?? 0n)
      setRemaining(Math.max(0, ts - now))
    }, 1000)
    return () => clearInterval(id)
  }, [nextDrawTs])
  const dd = Math.floor(remaining / 86400)
  const hh = Math.floor((remaining % 86400) / 3600)
  const mm = Math.floor((remaining % 3600) / 60)
  const ss = remaining % 60

  // Withdraw
  const amountIn6 = useMemo(() => {
    try { return amount ? parseUnits(amount, 6) : undefined } catch { return undefined }
  }, [amount])
  const { data: withdrawHash, writeContract: writeWithdraw, isPending: withdrawing } = useContractWrite()
  const { isLoading: withdrawingMining } = useWaitForTransactionReceipt({ hash: withdrawHash })

  const handleWithdraw = () => {
    if (!amountIn6) {
      toast({ title: 'Error', description: 'Enter amount', variant: 'destructive' })
      return
    }
    writeWithdraw({
      address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
      abi: vaultAbi,
      functionName: 'withdraw',
      args: [amountIn6 as bigint],
    })
  }

  // Execute draw
  const { data: drawHash, writeContract: writeExecute, isPending: executing } = useContractWrite()
  const { isLoading: executingMining } = useWaitForTransactionReceipt({ hash: drawHash })
  const onExecuteDraw = () => writeExecute({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'executeDraw',
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Vault</h1>
        </div>
        <ConnectButton />
      </header>

      {/* Main content */}
      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Vault info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-purple-400" />
                    Vault Info
                  </CardTitle>
                  <CardDescription>USDC Savings Vault</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Total Value Locked</div>
                    <div className="font-medium">{tvl ? `${Number((tvl as bigint)/10n**6n).toLocaleString()} USDC` : '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Current APY</div>
                    <div className="font-medium text-green-400">{apy ? `${Number(apy as bigint)/100}%` : '—'}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Next Draw</div>
                    <div className="font-medium">{`${dd}d ${hh}h ${mm}m`}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Prize Pool</div>
                    <div className="font-medium">{prize ? `${Number((prize as bigint)/10n**6n).toLocaleString()} USDC` : '—'}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-500/20 hover:bg-purple-500/10 bg-transparent"
                    onClick={onExecuteDraw}
                    disabled={executing || executingMining || remaining > 0}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {executing || executingMining ? 'Executing Draw…' : remaining > 0 ? 'Execute Draw (after timer)' : 'Execute Draw'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-cyan-400" />
                    Your Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Your Deposits</div>
                    <div className="font-medium">{userBal ? `${Number((userBal as bigint)/10n**6n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} USDC` : (isConnected ? '0.00 USDC' : 'Connect')}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Winning Chance</div>
                    <div className="font-medium">0%</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Estimated Yield</div>
                    <div className="font-medium">0.00 USDC/week</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-violet-400" />
                    Next Draw
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{dd}</div><div className="text-xs text-gray-400">Days</div></div>
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{hh}</div><div className="text-xs text-gray-400">Hours</div></div>
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{mm}</div><div className="text-xs text-gray-400">Mins</div></div>
                    <div className="bg-white/10 rounded-lg p-2"><div className="text-2xl font-bold">{ss}</div><div className="text-xs text-gray-400">Secs</div></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Deposit/Withdraw */}
            <div className="md:col-span-2">
              <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Manage Your Funds</CardTitle>
                  <CardDescription>Deposit or withdraw from the SaveFi vault</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="deposit" className="data-[state=active]:bg-purple-500/20">
                        <ArrowDown className="mr-2 h-4 w-4" />
                        Deposit
                      </TabsTrigger>
                      <TabsTrigger value="withdraw" className="data-[state=active]:bg-purple-500/20">
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Withdraw
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="deposit" className="space-y-6">
                      <DepositForm />
                    </TabsContent>

                    <TabsContent value="withdraw" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Your Deposits</label>
                            <div className="text-sm text-gray-400">Balance: {userBal ? `${Number((userBal as bigint)/10n**6n).toFixed(2)} USDC` : '—'}</div>
                          </div>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="bg-white/10 border-purple-500/20 pr-16"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium">USDC</div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/10 space-y-2">
                          <div className="flex justify-between">
                            <div className="text-sm flex items-center">
                              Withdrawal Fee
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="ml-1 h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">No withdrawal fee except for gas costs.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-sm font-medium">0.00 USDC</div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-sm">You Will Receive</div>
                            <div className="text-sm font-medium">{amount || '0.00'} USDC</div>
                          </div>
                        </div>
                      </div>

                      <Button
                        disabled={!isConnected || !amountIn6 || withdrawing || withdrawingMining}
                        onClick={handleWithdraw}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
                      >
                        {withdrawing || withdrawingMining ? "Withdrawing..." : isConnected ? "Withdraw" : "Connect Wallet to Withdraw"}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="w-full p-4 rounded-lg bg-purple-500/10 mb-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">No-Loss Guarantee</h4>
                        <p className="text-sm text-gray-400">
                          Your principal is always safe. You can withdraw your full deposit at any time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                        Advanced Options
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="flex justify-between mb-1">
                            <div className="text-sm">Gas Price (Gwei)</div>
                            <div className="text-sm font-medium">Auto</div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-sm">Slippage Tolerance</div>
                            <div className="text-sm font-medium">0.5%</div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
