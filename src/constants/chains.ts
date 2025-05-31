import { Chain } from 'viem'
import { mainnet, sepolia, base, baseSepolia } from 'viem/chains'

// Placeholder contract address - will be updated with actual vanity address
export const ASSEMBLE_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as const

export const SUPPORTED_CHAINS = {
  mainnet,
  sepolia,
  base,
  baseSepolia,
} as const

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS

export const CHAIN_CONTRACT_ADDRESSES: Record<SupportedChainId, `0x${string}`> = {
  mainnet: ASSEMBLE_CONTRACT_ADDRESS,
  sepolia: ASSEMBLE_CONTRACT_ADDRESS,
  base: ASSEMBLE_CONTRACT_ADDRESS,
  baseSepolia: ASSEMBLE_CONTRACT_ADDRESS,
}

export function getContractAddress(chain: Chain): `0x${string}` {
  const chainName = Object.keys(SUPPORTED_CHAINS).find(
    (key) => SUPPORTED_CHAINS[key as SupportedChainId].id === chain.id
  ) as SupportedChainId | undefined

  if (!chainName) {
    throw new Error(`Unsupported chain: ${chain.name} (${chain.id})`)
  }

  return CHAIN_CONTRACT_ADDRESSES[chainName]
}

// Re-export ABI for convenience
export { ASSEMBLE_ABI } from './abi' 