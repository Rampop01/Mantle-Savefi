'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CONTRACT_ADDRESSES } from '@/config/web3'
import { abi as usdcAbi } from '@/hooks/abi/MockUSDC'
import { abi as vaultAbi } from '@/hooks/abi/SaveFiVault'
import { useAccount, useContractWrite, useContractRead, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'

export function DepositForm() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')

  const amountIn6 = useMemo(() => {
    try {
      return amount ? parseUnits(amount, 6) : undefined
    } catch {
      return undefined
    }
  }, [amount])

  // Read allowance
  const { data: allowance } = useContractRead({
    address: CONTRACT_ADDRESSES.MOCK_USDC as `0x${string}`,
    abi: usdcAbi,
    functionName: 'allowance',
    args: address ? [address as `0x${string}`, CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`] : undefined,
    enabled: isConnected && !!address,
  } as any)

  const needsApproval = useMemo(() => {
    if (!amountIn6 || !allowance) return true
    try {
      return (allowance as bigint) < (amountIn6 as bigint)
    } catch {
      return true
    }
  }, [allowance, amountIn6])

  // Approve
  const { data: approveHash, writeContract: writeApprove, isPending: approving } = useContractWrite()
  const { isLoading: approvingMining } = useWaitForTransactionReceipt({ hash: approveHash })

  // Deposit
  const { data: depositHash, writeContract: writeDeposit, isPending: depositing } = useContractWrite()
  const { isLoading: depositingMining } = useWaitForTransactionReceipt({ hash: depositHash })

  const onApprove = () => {
    if (!amountIn6) return
    writeApprove({
      address: CONTRACT_ADDRESSES.MOCK_USDC as `0x${string}`,
      abi: usdcAbi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`, amountIn6 as bigint],
    })
  }

  const onDeposit = () => {
    if (!amountIn6) return
    writeDeposit({
      address: CONTRACT_ADDRESSES.SAVE_FI_VAULT as `0x${string}`,
      abi: vaultAbi,
      functionName: 'deposit',
      args: [amountIn6 as bigint],
    })
  }

  const busy = approving || approvingMining || depositing || depositingMining

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Deposit USDC</h2>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Amount"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!isConnected || busy}
        />
        {needsApproval ? (
          <Button onClick={onApprove} disabled={!isConnected || !amountIn6 || busy}>
            {approving || approvingMining ? 'Approving…' : 'Approve'}
          </Button>
        ) : (
          <Button onClick={onDeposit} disabled={!isConnected || !amountIn6 || busy}>
            {depositing || depositingMining ? 'Depositing…' : 'Deposit'}
          </Button>
        )}
      </div>
      {!isConnected && (
        <p className="text-sm text-muted-foreground">Connect your wallet to deposit.</p>
      )}
      <p className="text-xs text-muted-foreground">USDC uses 6 decimals. Minimum deposit is 1 USDC.</p>
    </div>
  )
}
