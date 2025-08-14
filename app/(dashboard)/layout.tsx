import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <SidebarInset className="bg-gradient-to-br from-background to-background/95 overflow-auto">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
