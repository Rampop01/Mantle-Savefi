'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function DepositForm() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-lg font-semibold">Deposit USDC</h2>
      <div className="flex gap-2">
        <Input type="number" placeholder="Amount" disabled value="" onChange={() => {}} />
        <Button disabled title="Wallet features are disabled">Deposit (disabled)</Button>
      </div>
      <p className="text-sm text-muted-foreground">Deposits are currently disabled while wallet functionality is removed.</p>
    </div>
  )
}
