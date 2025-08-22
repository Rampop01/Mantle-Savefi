"use client"

import { useState } from "react"
import { HelpCircle, Search, Book, MessageCircle, Mail, ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "How does SaveFi work?",
      answer:
        "SaveFi is a no-loss lottery vault where you deposit stablecoins (USDC, USDT, DAI) that generate yield through DeFi protocols. This yield is distributed as prizes in weekly draws, while your principal remains safe and withdrawable at any time.",
    },
    {
      question: "Is my money safe?",
      answer:
        "Yes! SaveFi is designed as a no-loss protocol. Your principal deposit is never at risk. Only the yield generated from your deposits is used for prizes. You can withdraw your full deposit amount at any time.",
    },
    {
      question: "How are winners selected?",
      answer:
        "Winners are selected using provably fair randomness. Your chances of winning are proportional to your deposit amount relative to the total pool size. The selection process is transparent and verifiable on-chain.",
    },
    {
      question: "When do draws happen?",
      answer:
        "Draws happen automatically every 7 days (weekly). The exact time is displayed in the countdown timer on your dashboard. All depositors are automatically eligible for each draw.",
    },
    {
      question: "Can I withdraw my funds anytime?",
      answer:
        "Yes, you can withdraw your principal at any time without penalties. There's only a small gas fee for the transaction. Your funds are never locked or at risk.",
    },
    {
      question: "What tokens can I deposit?",
      answer:
        "Currently, SaveFi supports USDC, USDT, and DAI stablecoins. More tokens may be added through DAO governance in the future.",
    },
    {
      question: "How do I increase my winning chances?",
      answer:
        "Your winning chances are proportional to your deposit size. The more you deposit, the higher your chances of winning. However, even small deposits have a chance to win!",
    },
    {
      question: "What is the $SAVE token?",
      answer:
        "$SAVE is the governance token that will be distributed to early depositors and active community members in Phase 2. It allows holders to vote on protocol decisions and upgrades.",
    },
  ]

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn how to make your first deposit and participate in draws",
      icon: Book,
      link: "#",
    },
    {
      title: "Smart Contract Documentation",
      description: "Technical documentation for developers and advanced users",
      icon: Book,
      link: "#",
    },
    {
      title: "Security Audit Reports",
      description: "View our security audit reports and safety measures",
      icon: Book,
      link: "#",
    },
  ]

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-purple-900/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Help & Support</h1>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Search */}
        <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help articles, FAQs, or guides..."
                className="pl-9 bg-white/10 border-purple-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-400">Get instant help from our support team</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-400">Send us a detailed message</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="h-12 w-12 text-violet-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-gray-400">Browse our comprehensive guides</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-purple-400" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find answers to common questions about SaveFi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqs.map((faq, index) => (
              <Collapsible
                key={index}
                open={openFaq === index}
                onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto text-left hover:bg-white/5">
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Helpful Resources</CardTitle>
            <CardDescription>Additional documentation and guides</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <resource.icon className="h-5 w-5 text-purple-400" />
                  <div>
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-400">{resource.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-cyan-900/30 border-purple-500/20 overflow-hidden mt-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Still need help?</h3>
              <p className="text-gray-300 mb-4">
                Our support team is here to help you with any questions or issues you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-purple-700 hover:bg-white/90">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
