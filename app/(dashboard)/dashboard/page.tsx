"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Clock, TrendingUp, Trophy, Wallet, ArrowRight, RefreshCw, ChevronRight } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 22,
  })
  const { toast } = useToast()
  const isConnected = false
  const address: string | undefined = undefined
  // const [isConnected, setIsConnected] = useState(false) // Mock connection status

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(65)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleDepositClick = () => {
    if (!isConnected) {
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
        <Button
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
          onClick={() => {
            if (!isConnected) {
              // This would open the wallet modal in a real implementation
              toast({
                title: "Connect Wallet",
                description: "Please connect your wallet from the landing page first.",
                variant: "destructive",
              })
            }
          }}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
        </Button>
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
                  <div className="text-3xl font-bold">0.00 USDC</div>
                  <p className="text-sm text-gray-400">
                    {isConnected ? "Your deposits will appear here" : "Connect wallet to view your deposits"}
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
                  <div className="text-3xl font-bold">0%</div>
                  <p className="text-sm text-gray-400">
                    {isConnected
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

            {/* Recent winners */}
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
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="font-medium">0x7a...3f9{i}</div>
                          <div className="text-sm text-gray-400">
                            Draw #{42 - i} • {i} week{i > 1 ? "s" : ""} ago
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{(150 / i).toFixed(2)} USDC</div>
                        <div className="text-sm text-cyan-400 flex items-center justify-end">
                          View
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  ))}
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
                <CardDescription>Draw #43 is coming soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Time Remaining</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">{timeLeft.days}</div>
                      <div className="text-xs text-gray-400">Days</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">{timeLeft.hours}</div>
                      <div className="text-xs text-gray-400">Hours</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                      <div className="text-xs text-gray-400">Mins</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                      <div className="text-xs text-gray-400">Secs</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <div className="text-sm text-gray-400">Prize Pool</div>
                    <div className="text-sm font-medium">~325.75 USDC</div>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-white/10"
                    indicatorClassName="bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                </div>

                <div className="p-3 rounded-lg bg-white/10 mb-4">
                  <div className="flex justify-between mb-1">
                    <div className="text-sm">Total Deposits</div>
                    <div className="text-sm font-medium">24,750 USDC</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm">Your Deposits</div>
                    <div className="text-sm font-medium">{isConnected ? "0.00 USDC" : "Connect wallet"}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
                  onClick={() => {
                    if (!isConnected) {
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
              </CardFooter>
            </Card>

            {/* Protocol stats */}
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
                  <div className="text-sm text-gray-400">Total Value Locked</div>
                  <div className="font-medium">$24,750.00</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-400">Total Prizes Awarded</div>
                  <div className="font-medium">$12,345.67</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-400">Total Participants</div>
                  <div className="font-medium">1,234</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-400">Current APY</div>
                  <div className="font-medium text-green-400">4.2%</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent activity */}
            <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-400 text-center py-6">
                  {isConnected ? "No recent activity" : "Connect your wallet to view your activity"}
                </div>
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
