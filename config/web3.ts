import { http } from 'wagmi'
import { morphHolesky } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'SaveFi',
  projectId: '96aab5ed69f1740a6cb82d7c7a4203e5',
  chains: [morphHolesky],
  transports: {
    [morphHolesky.id]: http(),
  },
  ssr: true,
})

export const CONTRACT_ADDRESSES = {
  SAVE_FI_VAULT: '0xF9095E37f0231Ff6B242602f0cf8AB2A01012C84',
  AAVE_YIELD_STRATEGY: '0x26368A13d07002cc369eAeedd5D8bC4c90A1841C',
  MOCK_RANDOMNESS_PROVIDER: '0xAa1deb4Cc3c3386D813E7f7b2fF52a7c4EFB675e',
  SAVE_TOKEN: '0xFD6ADb6A498a6F9f4068DAc7f2271b5e988a13d0',
  MOCK_USDC: '0x274f499201b0716e6CB632FF5BEc10cAD508eAD6'
}
