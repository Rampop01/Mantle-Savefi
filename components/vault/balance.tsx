'use client'

import { useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/web3'
import { abi as vaultAbi } from '@/hooks/abi/SaveFiVault'
import { useMounted } from '@/hooks/use-mounted'

export function Balance() {
  const mounted = useMounted()
  const { address, isConnected } = useAccount()
  const connected = mounted && isConnected

  const { data: bal } = useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: connected && !!address },
  } as any)

  const formatted = bal ? Number((bal as bigint) / 10n ** 6n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">Your Balance</h2>
      <p className="text-2xl font-bold mt-2">{connected ? `${formatted} USDC` : 'Connect wallet'}</p>
    </div>
  )
}
