import { spawn, ChildProcess } from 'child_process'
import { createPublicClient, createWalletClient, http, PublicClient, WalletClient, Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry, sepolia } from 'viem/chains'

export interface AnvilInstance {
  process: ChildProcess
  rpcUrl: string
  chainId: number
  accounts: Address[]
  privateKeys: `0x${string}`[]
}

export interface TestClients {
  publicClient: PublicClient
  walletClient: WalletClient
  account: Address
}

// Real deployed contract on Sepolia
export const SEPOLIA_CONTRACT_ADDRESS = '0x9A5F66b4dB17f6546D4A224Eb41468f7C2079B59' as Address

/**
 * Create clients for testing against real Sepolia deployment
 */
export function createSepoliaTestClients(accountIndex = 0): TestClients {
  // Known Anvil test accounts
  const privateKeys = [
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  ] as `0x${string}`[]

  const account = privateKeyToAccount(privateKeys[accountIndex])
  
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http('https://eth-sepolia.api.onfinality.io/public')
  })

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: http('https://eth-sepolia.api.onfinality.io/public'),
    account
  })

  return {
    publicClient,
    walletClient,
    account: account.address
  }
}

/**
 * Start Anvil instance for testing
 */
export async function startAnvil(): Promise<AnvilInstance> {
  const rpcUrl = 'http://127.0.0.1:8546'
  const chainId = 31337

  // Known Anvil test accounts
  const privateKeys = [
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  ] as `0x${string}`[]

  const accounts = privateKeys.map(pk => privateKeyToAccount(pk).address)

  return new Promise((resolve, reject) => {
    const process = spawn('anvil', [
      '--host', '127.0.0.1',
      '--port', '8546',
      '--fork-url', 'https://eth-sepolia.api.onfinality.io/public',
      '--chain-id', chainId.toString(),
      '--accounts', '10',
      '--balance', '10000',
      '--gas-limit', '30000000',
      '--gas-price', '1000000000',
      '--base-fee', '1000000000',
      '--hardfork', 'shanghai'
    ])

    let started = false

    process.stdout?.on('data', (data) => {
      const output = data.toString()
      if (output.includes('Listening on') && !started) {
        started = true
        setTimeout(() => {
          resolve({
            process,
            rpcUrl,
            chainId,
            accounts,
            privateKeys
          })
        }, 1000) // Give Anvil time to fully start
      }
    })

    process.stderr?.on('data', (data) => {
      console.error('Anvil error:', data.toString())
    })

    process.on('error', (error) => {
      reject(error)
    })

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!started) {
        process.kill()
        reject(new Error('Anvil failed to start within 10 seconds'))
      }
    }, 10000)
  })
}

/**
 * Stop Anvil instance
 */
export function stopAnvil(anvil: AnvilInstance): void {
  if (anvil?.process && !anvil.process.killed) {
    anvil.process.kill('SIGTERM')
  }
}

/**
 * Create test clients for interacting with Anvil
 */
export function createTestClients(anvil: AnvilInstance, accountIndex = 0): TestClients {
  const account = privateKeyToAccount(anvil.privateKeys[accountIndex])
  
  const publicClient = createPublicClient({
    chain: foundry,
    transport: http(anvil.rpcUrl)
  })

  const walletClient = createWalletClient({
    chain: foundry,
    transport: http(anvil.rpcUrl),
    account
  })

  return {
    publicClient,
    walletClient,
    account: account.address
  }
}

/**
 * Deploy Assemble contract to Anvil
 */
export async function deployAssembleContract(
  walletClient: WalletClient,
  publicClient: PublicClient
): Promise<Address> {
  // Since we're forking Sepolia, the real contract is already deployed
  return SEPOLIA_CONTRACT_ADDRESS
}

/**
 * Mine blocks on Anvil
 */
export async function mineBlocks(publicClient: PublicClient, blocks: number): Promise<void> {
  for (let i = 0; i < blocks; i++) {
    await publicClient.request({
      method: 'evm_mine',
      params: [] as any
    } as any)
  }
}

/**
 * Set next block timestamp
 */
export async function setNextBlockTimestamp(
  publicClient: PublicClient, 
  timestamp: number
): Promise<void> {
  await publicClient.request({
    method: 'evm_setNextBlockTimestamp',
    params: [`0x${timestamp.toString(16)}`] as any
  } as any)
  await mineBlocks(publicClient, 1)
} 