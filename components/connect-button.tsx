"use client"

import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from "@/components/ui/button"

function truncate(addr?: string) {
  if (!addr) return ""
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function ConnectButton() {
  return (
    <RKConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!connected) {
          return (
            <Button
              onClick={openConnectModal}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
            >
              Connect Wallet
            </Button>
          )
        }

        // If chain unsupported, prompt network change
        if (chain?.unsupported) {
          return (
            <Button
              variant="destructive"
              onClick={openChainModal}
            >
              Wrong Network
            </Button>
          )
        }

        // Connected: show account button styled with gradient
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={openChainModal}
              variant="outline"
              className="border-purple-500/20 bg-white/5 text-white hover:bg-white/10"
            >
              {chain?.iconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={chain.name ?? "chain"} src={chain.iconUrl} className="w-4 h-4 mr-2 rounded-full" />
              )}
              {chain?.name ?? "Network"}
            </Button>
            <Button
              onClick={openAccountModal}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
            >
              {truncate(account?.address)}
            </Button>
          </div>
        )
      }}
    </RKConnectButton.Custom>
  )
}
