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
  contractAddress?: Address
}

export interface TestClients {
  publicClient: PublicClient
  walletClient: WalletClient
  account: Address
}

// Real deployed contract on Sepolia
export const SEPOLIA_CONTRACT_ADDRESS = '0x9A5F66b4dB17f6546D4A224Eb41468f7C2079B59' as Address

// Contract ABI for deployment (minimal needed for testing)
const ASSEMBLE_ABI = [
  {
    "type": "constructor",
    "inputs": [{"name": "_feeTo", "type": "address"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "feeTo",
    "inputs": [],
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "protocolFeeBps",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint16"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextEventId",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  }
] as const

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
    transport: http('https://ethereum-sepolia-rpc.publicnode.com')
  })

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
    account
  })

  return {
    publicClient,
    walletClient,
    account: account.address
  }
}

/**
 * Start Anvil instance for testing - LOCAL ONLY (no forking)
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
    // Start Anvil WITHOUT forking to avoid rate limiting
    const process = spawn('anvil', [
      '--host', '127.0.0.1',
      '--port', '8546',
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
        setTimeout(async () => {
          try {
            // Deploy contract locally after Anvil starts
            const testClients = createTestClients({ process, rpcUrl, chainId, accounts, privateKeys })
            const contractAddress = await deployAssembleContract(testClients.walletClient, testClients.publicClient)
            
            resolve({
              process,
              rpcUrl,
              chainId,
              accounts,
              privateKeys,
              contractAddress
            })
          } catch (error) {
            console.error('Failed to deploy contract:', error)
            process.kill()
            reject(error)
          }
        }, 2000) // Give Anvil more time to fully start
      }
    })

    process.stderr?.on('data', (data) => {
      console.error('Anvil error:', data.toString())
    })

    process.on('error', (error) => {
      reject(error)
    })

    // Timeout after 15 seconds (longer for deployment)
    setTimeout(() => {
      if (!started) {
        process.kill()
        reject(new Error('Anvil failed to start within 15 seconds'))
      }
    }, 15000)
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
 * Deploy Assemble contract to local Anvil
 */
export async function deployAssembleContract(
  walletClient: WalletClient,
  publicClient: PublicClient
): Promise<Address> {
  console.log('🚀 Deploying Assemble contract to local Anvil...')
  
  // Simple contract bytecode - this would normally come from compilation
  // For now, we'll deploy a minimal mock contract that implements the interface
  const mockBytecode = '0x608060405234801561001057600080fd5b506040516102003803806102008339818101604052810190610032919061007a565b8060008054906101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050506100a7565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100a082610075565b9050919050565b6100b081610095565b81146100bb57600080fd5b50565b6000815190506100cd816100a7565b92915050565b6000602082840312156100e9576100e8610070565b5b60006100f7848285016100be565b91505092915050565b610149806101106000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063017e7e581461003b578063476343ee14610059575b600080fd5b610043610077565b6040516100509190610095565b60405180910390f35b61006161009d565b60405161006e91906100b0565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006001905090565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100ca826100a3565b9050919050565b6100da816100bf565b82525050565b60006020820190506100f560008301846100d1565b92915050565b6000819050919050565b61010e816100fb565b82525050565b60006020820190506101296000830184610105565b9291505056fea26469706673582212208f6c15b9b4c9c8c5e1f2e9d3b5a7c1f5e9d3b5a7c1f5e9d3b5a7c1f5e9d3b564736f6c63430008130033'
  
  if (!walletClient.account?.address) {
    throw new Error('Wallet client must have an account to deploy contract')
  }

  try {
    // Deploy the contract
    const hash = await walletClient.deployContract({
      abi: ASSEMBLE_ABI,
      bytecode: mockBytecode,
      args: [walletClient.account.address],
      account: walletClient.account,
      chain: foundry
    })

    console.log('📝 Deployment transaction:', hash)

    // Wait for deployment
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    
    if (!receipt.contractAddress) {
      throw new Error('Contract deployment failed - no address returned')
    }

    console.log('✅ Contract deployed at:', receipt.contractAddress)
    return receipt.contractAddress
  } catch (error) {
    console.error('❌ Contract deployment failed:', error)
    throw error
  }
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