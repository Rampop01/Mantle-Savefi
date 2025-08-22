"use client"

import { createPublicClient, http, Hex } from "viem"

const FEATURE_AA = process.env.NEXT_PUBLIC_FEATURE_AA === 'true'
const PIMLICO_BUNDLER_URL = process.env.NEXT_PUBLIC_PIMLICO_BUNDLER_URL || ''
const PIMLICO_PAYMASTER_URL = process.env.NEXT_PUBLIC_PIMLICO_PAYMASTER_URL || ''
const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || ''

export function isAAEnabled() {
  return FEATURE_AA && !!PIMLICO_BUNDLER_URL
}

export type AAContext = {
  bundlerUrl: string
  paymasterUrl?: string
  apiKey?: string
}

export function getAAContext(): AAContext | null {
  if (!isAAEnabled()) return null
  return {
    bundlerUrl: PIMLICO_BUNDLER_URL,
    paymasterUrl: PIMLICO_PAYMASTER_URL || undefined,
    apiKey: PIMLICO_API_KEY || undefined,
  }
}

// Placeholder helpers to integrate with a 4337 client library later
export async function aaApproveAndDeposit(_params: {
  owner: `0x${string}`
  token: `0x${string}`
  vault: `0x${string}`
  amount: bigint
  chainId: number
}): Promise<{ userOpHash?: Hex; txHash?: Hex }> {
  // This is a stub. In the next step we will wire a real 4337 client (e.g. permissionless + pimlico)
  throw new Error('AA not configured yet: add Pimlico bundler/paymaster URLs to .env and implement client')
}
