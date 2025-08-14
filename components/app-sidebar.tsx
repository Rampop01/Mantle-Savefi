"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import {
  Home,
  Wallet,
  History,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Trophy,
  Users,
  BarChart3,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ConnectButton } from "@/components/connect-button"

export function AppSidebar() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState("dashboard")

  return (
    <Sidebar className="border-r border-purple-900/20">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="relative w-8 h-8"
          >
            <div className="absolute inset-0 bg-purple-600 rounded-full opacity-70 blur-sm"></div>
            <div className="absolute inset-0.5 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-full"></div>
            <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
            </div>
          </motion.div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
            SaveFi
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Wallet status display removed */}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard")}
              className={cn(
                "transition-all duration-200",
                pathname.startsWith("/dashboard") &&
                  "bg-gradient-to-r from-purple-500/20 to-cyan-500/10 border-l-2 border-purple-500",
              )}
            >
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/vault")}
              className={cn(
                "transition-all duration-200",
                pathname.startsWith("/vault") &&
                  "bg-gradient-to-r from-purple-500/20 to-cyan-500/10 border-l-2 border-purple-500",
              )}
            >
              <Link href="/vault">
                <Wallet className="h-4 w-4" />
                <span>Vault</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/history")}
              className={cn(
                "transition-all duration-200",
                pathname.startsWith("/history") &&
                  "bg-gradient-to-r from-purple-500/20 to-cyan-500/10 border-l-2 border-purple-500",
              )}
            >
              <Link href="/history">
                <History className="h-4 w-4" />
                <span>Draw History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Collapsible className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="transition-all duration-200">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/analytics/yield">Yield Performance</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/analytics/users">User Growth</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="transition-all duration-200">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/leaderboard/weekly">Weekly Winners</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/leaderboard/all-time">All-time Winners</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="transition-all duration-200">
                  <Users className="h-4 w-4" />
                  <span>DAO</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dao/proposals">Proposals</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dao/voting">Voting</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-purple-900/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/help">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ConnectButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
