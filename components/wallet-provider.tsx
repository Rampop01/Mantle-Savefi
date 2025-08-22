"use client"

import { ReactNode } from "react"
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount } from 'wagmi'
import { getWagmiConfig } from '@/config/web3'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()
const config = getWagmiConfig()

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Convenience hook for wallet state/actions
export function useWallet() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  return {
    address,
    isConnected,
    connect: openConnectModal,
  }
}
