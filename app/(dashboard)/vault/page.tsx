"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Clock, Info, RefreshCw, Shield, Wallet, ChevronDown } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState("deposit")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()
  const [isTransactionLoading, setIsTransactionLoading] = useState(false)

  const handleDeposit = async () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount to deposit.",
        variant: "destructive",
      })
      return
    }

    // Simulate wallet connection check
    const isWalletConnected = false // Replace with actual wallet connection check

    if (!isWalletConnected) {
      toast({
        title: "Warning",
        description: "Please connect your wallet to deposit.",
        variant: "warning",
      })
      return
    }

    setIsTransactionLoading(true)

    // Simulate transaction processing
    setTimeout(() => {
      setIsTransactionLoading(false)
      const isSuccess = true // Replace with actual transaction result

      if (isSuccess) {
        toast({
          title: "Success",
          description: `Successfully deposited ${amount} USDC.`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to deposit. Please try again.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  const handleWithdraw = async () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount to withdraw.",
        variant: "destructive",
      })
      return
    }

    // Simulate wallet connection check
    const isWalletConnected = false // Replace with actual wallet connection check

    if (!isWalletConnected) {
      toast({
        title: "Warning",
        description: "Please connect your wallet to withdraw.",
        variant: "warning",
      })
      return
    }

    setIsTransactionLoading(true)

    // Simulate transaction processing
    setTimeout(() => {
      setIsTransactionLoading(false)
      const isSuccess = true // Replace with actual transaction result

      if (isSuccess) {
        toast({
          title: "Success",
          description: `Successfully withdrew ${amount} USDC.`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to withdraw. Please try again.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Vault</h1>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
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
                    <div className="font-medium">$24,750.00</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Current APY</div>
                    <div className="font-medium text-green-400">4.2%</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Next Draw</div>
                    <div className="font-medium">2d 14h 35m</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-400">Prize Pool</div>
                    <div className="font-medium">~325.75 USDC</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-500/20 hover:bg-purple-500/10 bg-transparent"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
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
                    <div className="font-medium">0.00 USDC</div>
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
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-xs text-gray-400">Days</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">14</div>
                      <div className="text-xs text-gray-400">Hours</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">35</div>
                      <div className="text-xs text-gray-400">Mins</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">22</div>
                      <div className="text-xs text-gray-400">Secs</div>
                    </div>
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
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Select Token</label>
                            <div className="text-sm text-gray-400">Balance: 0.00</div>
                          </div>
                          <Select defaultValue="usdc">
                            <SelectTrigger className="bg-white/10 border-purple-500/20">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="usdc">USDC</SelectItem>
                              <SelectItem value="usdt">USDT</SelectItem>
                              <SelectItem value="dai">DAI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Amount</label>
                            <button className="text-sm text-purple-400 hover:text-purple-300">MAX</button>
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
                              Winning Chance
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="ml-1 h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      Your chance of winning is proportional to your deposit amount relative to the
                                      total pool size.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-sm font-medium">0%</div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-sm">Estimated Weekly Yield</div>
                            <div className="text-sm font-medium">0.00 USDC</div>
                          </div>
                        </div>
                      </div>

                      <Button
                        disabled={isTransactionLoading}
                        onClick={handleDeposit}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
                      >
                        {isTransactionLoading ? "Depositing..." : "Connect Wallet to Deposit"}
                      </Button>
                    </TabsContent>

                    <TabsContent value="withdraw" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Your Deposits</label>
                            <div className="text-sm text-gray-400">Balance: 0.00 USDC</div>
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
                            <div className="text-sm font-medium">0.00 USDC</div>
                          </div>
                        </div>
                      </div>

                      <Button
                        disabled={isTransactionLoading}
                        onClick={handleWithdraw}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
                      >
                        {isTransactionLoading ? "Withdrawing..." : "Connect Wallet to Withdraw"}
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
