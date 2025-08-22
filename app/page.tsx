"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import {
  Shield,
  TrendingUp,
  Wallet,
  Users,
  DollarSign,
  Lock,
  Sparkles,
  Star,
  CheckCircle,
  Github,
  Twitter,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingParticles } from "@/components/floating-particles"
import { GlowingOrbs } from "@/components/glowing-orbs"
import { HeroCarousel } from "@/components/hero-carousel"

export default function Home() {
  const controls = useAnimation()
  const [isVisible, setIsVisible] = useState(false)
  const isConnected = false

  useEffect(() => {
    setIsVisible(true)
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    })
  }, [controls])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />

      {/* Glowing orbs */}
      <GlowingOrbs />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="relative w-8 h-8"
          >
            <div className="absolute inset-0 bg-purple-600 rounded-full opacity-70 blur-sm"></div>
            <div className="absolute inset-0.5 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-full"></div>
            <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
              <motion.div
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
            SaveFi
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/10 hidden md:block">
            Docs
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 hidden md:block">
            Community
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
          >
            <Link href="/dashboard">
              <Wallet className="mr-2 h-4 w-4" />
              Launch App
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              Why Choose SaveFi?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience the future of savings with our innovative no-loss lottery protocol
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "No-Loss Guarantee",
                description: "Your principal is always protected. Withdraw anytime without penalties.",
                color: "text-green-400",
              },
              {
                icon: DollarSign,
                title: "Competitive Yields",
                description: "Earn up to 4.2% APY on your stablecoins through optimized DeFi strategies.",
                color: "text-yellow-400",
              },
              {
                icon: Users,
                title: "Fair & Transparent",
                description: "Provably fair draws with transparent on-chain randomness.",
                color: "text-blue-400",
              },
              {
                icon: Sparkles,
                title: "Weekly Prizes",
                description: "Regular opportunities to win big from the collective yield pool.",
                color: "text-purple-400",
              },
              {
                icon: Shield,
                title: "Audited & Secure",
                description: "Smart contracts audited by leading security firms.",
                color: "text-cyan-400",
              },
              {
                icon: TrendingUp,
                title: "Growing Community",
                description: "Join thousands of users already saving and winning with SaveFi.",
                color: "text-violet-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <feature.icon className={`h-8 w-8 ${feature.color} mb-4`} />
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              How SaveFi Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              A simple, secure way to save and win with your stablecoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Deposit Stablecoins",
                description:
                  "Deposit your USDC, USDT, or DAI into the SaveFi vault. Your funds are always yours to withdraw.",
                color: "purple",
              },
              {
                number: "02",
                title: "Generate Yield",
                description: "Your deposits are put to work in battle-tested DeFi protocols, generating yield safely.",
                color: "cyan",
              },
              {
                number: "03",
                title: "Win Prizes",
                description: "Weekly draws distribute yield as prizes. The more you deposit, the better your chances.",
                color: "violet",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm overflow-hidden relative group h-full">
                  <CardContent className="p-6 relative z-10">
                    <span className={`inline-block text-5xl font-bold text-${step.color}-500/50 mb-4`}>
                      {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              SaveFi by the Numbers
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Join a growing community of smart savers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$24.7M", label: "Total Value Locked" },
              { value: "1,234", label: "Active Users" },
              { value: "$12.3K", label: "Prizes Awarded" },
              { value: "42", label: "Weekly Draws" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              What Users Say
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Real feedback from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "SaveFi changed how I think about savings. I've won twice and my principal is always safe!",
                author: "0x7a...3f91",
                role: "Early Adopter",
                rating: 5,
              },
              {
                quote:
                  "The no-loss guarantee gives me peace of mind. It's like a savings account with lottery tickets.",
                author: "0x3b...8e72",
                role: "DeFi Enthusiast",
                rating: 5,
              },
              {
                quote: "Finally, a protocol that makes saving fun and rewarding. The weekly draws are exciting!",
                author: "0x5f...2d45",
                role: "Community Member",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-medium text-white">{testimonial.author}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
              Roadmap
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Our journey to revolutionize savings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                phase: "Phase 1",
                title: "Launch",
                status: "completed",
                items: ["USDC Vault", "Weekly Draws", "Basic UI"],
              },
              {
                phase: "Phase 2",
                title: "Expansion",
                status: "current",
                items: ["Multi-token Support", "$SAVE Token", "DAO Governance"],
              },
              {
                phase: "Phase 3",
                title: "Scale",
                status: "upcoming",
                items: ["Mobile App", "L2 Integration", "Advanced Analytics"],
              },
              {
                phase: "Phase 4",
                title: "Evolve",
                status: "future",
                items: ["Cross-chain", "NFT Rewards", "Institutional Features"],
              },
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`bg-white/5 border-purple-500/20 backdrop-blur-sm h-full ${
                    phase.status === "current" ? "ring-2 ring-purple-500/50" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-purple-400">{phase.phase}</span>
                      {phase.status === "completed" && <CheckCircle className="h-5 w-5 text-green-400" />}
                      {phase.status === "current" && (
                        <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-center">
                          <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none overflow-hidden relative">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to start saving and winning?</h2>
                  <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                    Join thousands of users who are already saving with SaveFi. Start with as little as 1 USDC and
                    participate in the next draw.
                  </p>
                  {isConnected ? (
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-white/90 relative overflow-hidden group"
                    >
                      <Link href="/dashboard">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Launch App
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowWalletModal(true)}
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-white/90 relative overflow-hidden group"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-purple-600 rounded-full opacity-70 blur-sm"></div>
                  <div className="absolute inset-0.5 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-full"></div>
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
                  SaveFi
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                The future of savings. No-loss lottery protocol built for everyone.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Audits
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Governance
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Brand Kit
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-purple-900/20">
            <div className="flex gap-6 text-sm text-gray-400 mb-4 md:mb-0">
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mt-8">© 2025 SaveFi. All rights reserved.</div>
        </div>
      </footer>

      {/** Wallet connect removed */}
    </div>
  )
}
