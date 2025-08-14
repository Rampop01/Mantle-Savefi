'use client'

import { DepositForm } from '@/components/vault/deposit-form'
import { Balance } from '@/components/vault/balance'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Balance />
          <DepositForm />
        </div>
        <div className="space-y-6">
          {/* Prize Pool Section - Coming Soon */}
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Prize Pool</h2>
            <p className="text-muted-foreground">Prize pool features coming soon!</p>
          </div>
          
          {/* History Section - Coming Soon */}
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Your History</h2>
            <p className="text-muted-foreground">Transaction history coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
