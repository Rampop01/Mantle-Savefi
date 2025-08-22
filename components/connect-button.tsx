"use client"

import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from "@/components/ui/button"
import { useDisconnect } from 'wagmi'

function truncate(addr?: string) {
  if (!addr) return ""
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

type Props = { compact?: boolean }

export function ConnectButton({ compact = false }: Props) {
  const { disconnect } = useDisconnect()

  const hardReset = () => {
    try {
      // Disconnect via wagmi
      disconnect()
      // Clear common persisted keys
      const keys = [
        'wagmi.store',
        'wagmi.connected',
        'rainbowkit.connectedWallets',
        'rainbowkit.recentConnectorId',
        // WalletConnect v2 client cache
        'wc@2:client',
        'walletconnect',
      ]
      keys.forEach((k) => {
        try { localStorage.removeItem(k) } catch {}
        try { sessionStorage.removeItem(k) } catch {}
      })
    } catch {}
    // Reload to ensure clean state
    try { window.location.reload() } catch {}
  }
  return (
    <RKConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!connected) {
          if (compact) {
            return (
              <Button size="sm" onClick={openConnectModal} variant="outline" className="w-full justify-center border-purple-500/20 bg-white/5 text-white hover:bg-white/10">
                Connect
              </Button>
            )
          } else {
            return (
              <Button
                onClick={openConnectModal}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none"
              >
                Connect Wallet
              </Button>
            )
          }
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

        // Connected
        if (compact) {
          // Single small button that opens account modal
          return (
            <Button size="sm" onClick={openAccountModal} variant="outline" className="w-full justify-center border-purple-500/20 bg-white/5 text-white hover:bg-white/10">
              {chain?.iconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={chain.name ?? "chain"} src={chain.iconUrl} className="w-4 h-4 mr-2 rounded-full" />
              )}
              {truncate(account?.address)}
            </Button>
          )
        }
        // Default (full) layout
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
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={hardReset}
              title="Disconnect and clear saved wallet session"
            >
              Reset
            </Button>
          </div>
        )
      }}
    </RKConnectButton.Custom>
  )
}
