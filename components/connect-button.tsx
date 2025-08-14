"use client"

import { Button } from '@/components/ui/button'

export function ConnectButton() {
  return (
    <Button disabled title="Wallet connect disabled" variant="secondary">
      Connect (disabled)
    </Button>
  )
}
