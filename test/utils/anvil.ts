import { spawn, ChildProcess } from 'child_process'
import { createPublicClient, createWalletClient, http, PublicClient, WalletClient, Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'

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

/**
 * Start Anvil instance for testing
 */
export async function startAnvil(): Promise<AnvilInstance> {
  const rpcUrl = 'http://127.0.0.1:8545'
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
      '--port', '8545',
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
  if (anvil.process && !anvil.process.killed) {
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
  // We'll use the ABI and bytecode from the compiled contract
  // For now, we'll use a placeholder address until we get the actual bytecode
  
  // This would normally deploy the contract:
  // const hash = await walletClient.deployContract({
  //   abi: ASSEMBLE_ABI,
  //   bytecode: ASSEMBLE_BYTECODE,
  //   args: [walletClient.account!.address] // feeTo address
  // })
  
  // const receipt = await publicClient.waitForTransactionReceipt({ hash })
  // return receipt.contractAddress!

  // For testing purposes, we'll return a mock address
  // This should be replaced with actual deployment logic
  return '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address
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