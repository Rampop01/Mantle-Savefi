import { http } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Custom chain: Mantle Sepolia (chainId 5003)
export const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia',
  nativeCurrency: { name: 'Mantle', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    public: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MantleScan', url: 'https://explorer.sepolia.mantle.xyz' },
  },
} as const

// Memoized Wagmi config to prevent multiple WalletConnect Core inits
let _config: ReturnType<typeof getDefaultConfig> | undefined
export function getWagmiConfig() {
  if (_config) return _config
  // Cache on globalThis to persist across HMR in dev
  const g = globalThis as any
  if (g.__savefi_wagmi_config) return (_config = g.__savefi_wagmi_config)
  _config = getDefaultConfig({
    appName: 'SaveFi',
    projectId: '96aab5ed69f1740a6cb82d7c7a4203e5',
    chains: [mantleSepolia],
    transports: {
      [mantleSepolia.id]: http('https://rpc.sepolia.mantle.xyz'),
    },
    // Keep SSR support; memoization avoids duplicate init across renders
    ssr: true,
    // Prevent automatic reconnection on reload to avoid being immediately reconnected to a previous address
    autoConnect: false,
  })
  g.__savefi_wagmi_config = _config
  return _config
}

export const CONTRACT_ADDRESSES = {
  SAVE_FI_VAULT: '0x896E731065Da2CBa4B289F769755630d0823AD46',
  SAVE_TOKEN: '0x3Bd9369511B5efCfD693147B6c32d6cC04A03a33',
  MOCK_USDC: '0x68310Ee20f3D4611DE39E40fE352692cf48168bA',
  // Not used on Mantle Sepolia right now
  AAVE_YIELD_STRATEGY: '0x0000000000000000000000000000000000000000',
  MOCK_RANDOMNESS_PROVIDER: '0x0000000000000000000000000000000000000000',
}
