import { Chain } from 'viem'
import { mainnet, sepolia, base, baseSepolia, optimism, arbitrum, polygon, zora } from 'viem/chains'

// Vanity contract address - deployed on all supported networks
export const ASSEMBLE_CONTRACT_ADDRESS = '0x000000000a020d45fFc5cfcF7B28B5020ddd6a85' as const

export const SUPPORTED_CHAINS = {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  optimism,
  arbitrum,
  polygon,
  zora,
} as const

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS

export const CHAIN_CONTRACT_ADDRESSES: Record<SupportedChainId, `0x${string}`> = {
  mainnet: ASSEMBLE_CONTRACT_ADDRESS,
  sepolia: ASSEMBLE_CONTRACT_ADDRESS,
  base: ASSEMBLE_CONTRACT_ADDRESS,
  baseSepolia: ASSEMBLE_CONTRACT_ADDRESS,
  optimism: ASSEMBLE_CONTRACT_ADDRESS,
  arbitrum: ASSEMBLE_CONTRACT_ADDRESS,
  polygon: ASSEMBLE_CONTRACT_ADDRESS,
  zora: ASSEMBLE_CONTRACT_ADDRESS,
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