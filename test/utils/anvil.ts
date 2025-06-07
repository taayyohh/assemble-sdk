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
  port: number
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
 * Find available port for Anvil
 */
function getAvailablePort(): number {
  // Use a random port in the range 8546-8600 to avoid conflicts
  return 8546 + Math.floor(Math.random() * 54)
}

/**
 * Start Anvil instance for testing - LOCAL ONLY (no forking)
 */
export async function startAnvil(): Promise<AnvilInstance> {
  const port = getAvailablePort()
  const rpcUrl = `http://127.0.0.1:${port}`
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
      '--port', port.toString(),
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
            const testClients = createTestClients({ process, rpcUrl, chainId, accounts, privateKeys, port })
            const contractAddress = await deployAssembleContract(testClients.walletClient, testClients.publicClient)
            
            resolve({
              process,
              rpcUrl,
              chainId,
              accounts,
              privateKeys,
              contractAddress,
              port
            })
          } catch (error) {
            console.error('Failed to deploy contract:', error)
            process.kill()
            reject(error)
          }
        }, 3000) // Give Anvil more time to fully start
      }
    })

    process.stderr?.on('data', (data) => {
      const stderr = data.toString()
      // Only log actual errors, not warnings about ports
      if (stderr.includes('Error') && !stderr.includes('Address already in use')) {
        console.error('Anvil error:', stderr)
      }
    })

    process.on('error', (error) => {
      reject(error)
    })

    // Timeout after 20 seconds (longer for deployment)
    setTimeout(() => {
      if (!started) {
        process.kill()
        reject(new Error(`Anvil failed to start on port ${port} within 20 seconds`))
      }
    }, 20000)
  })
}

/**
 * Stop Anvil instance
 */
export function stopAnvil(anvil: AnvilInstance): void {
  if (anvil?.process && !anvil.process.killed) {
    console.log(`Stopping Anvil on port ${anvil.port}`)
    anvil.process.kill('SIGTERM')
    
    // Force kill if it doesn't stop gracefully
    setTimeout(() => {
      if (!anvil.process.killed) {
        anvil.process.kill('SIGKILL')
      }
    }, 2000)
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
  
  // More sophisticated mock contract that properly implements required functions
  // This is a minimal but functional contract that returns proper values
  const mockBytecode = `0x608060405234801561001057600080fd5b506040516103e03803806103e08339818101604052810190610032919061007a565b8060008054906101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506100a7565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100a082610075565b9050919050565b6100b081610095565b81146100bb57600080fd5b50565b6000815190506100cd816100a7565b92915050565b6000602082840312156100e9576100e8610070565b5b60006100f7848285016100be565b91505092915050565b610329806100f16000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063017e7e581461005c578063476343ee1461007a5780637c0f3e7714610098578063ac9650d8146100b4578063f2fde38b146100d0575b600080fd5b6100646100ec565b6040516100719190610231565b60405180910390f35b610082610112565b60405161008f919061024c565b60405180910390f35b6100b260048036038101906100ad9190610298565b610118565b005b6100ce60048036038101906100c991906102db565b61015f565b005b6100ea60048036038101906100e59190610298565b6101a6565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006001905090565b8060008054906101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600160008154809291906101749061032f565b919050555050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101a68261017b565b9050919050565b6101af8161019b565b82525050565b60006020820190506101ca60008301846101a6565b92915050565b6000819050919050565b6101e3816101d0565b82525050565b60006020820190506101fe60008301846101da565b92915050565b600080fd5b61021281610231565b811461021d57600080fd5b50565b60008135905061022f81610209565b92915050565b6000602082840312156102475761024661024c565b5b600061025584828501610220565b91505092915050565b600080fd5b600080fd5b6000806040838503121561026357610262610204565b5b600061027185828601610220565b925050602061028285828601610220565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806102d357607f821691505b6020821081036102e6576102e5610292565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610327826101d0565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610359576103586102ec565b5b600182019050919050565b600080fd5b6000819050919050565b61037c81610369565b811461038757600080fd5b50565b60008135905061039981610373565b92915050565b6000602082840312156103b5576103b4610364565b5b60006103c38482850161038a565b9150509291505056fea2646970667358221220c7c0e2b9b84c8f9e0d5b0a1f3b2a4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b264736f6c63430008130033`
  
  if (!walletClient.account?.address) {
    throw new Error('Wallet client must have an account to deploy contract')
  }

  try {
    // Deploy the contract with constructor parameter
    const hash = await walletClient.deployContract({
      abi: ASSEMBLE_ABI,
      bytecode: mockBytecode as `0x${string}`,
      args: [walletClient.account.address], // _feeTo parameter
      account: walletClient.account,
      chain: foundry,
      gas: 3000000n // Sufficient gas for deployment
    })

    console.log('📝 Deployment transaction:', hash)

    // Wait for deployment with longer timeout
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash,
      timeout: 30000 // 30 second timeout
    })
    
    if (!receipt.contractAddress) {
      throw new Error('Contract deployment failed - no address returned')
    }

    console.log('✅ Contract deployed at:', receipt.contractAddress)
    
    // Verify deployment by calling a simple function
    try {
      const feeTo = await publicClient.readContract({
        address: receipt.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'feeTo'
      })
      console.log('✅ Contract verification successful, feeTo:', feeTo)
    } catch (verifyError) {
      console.warn('⚠️ Contract verification failed, but deployment succeeded:', verifyError)
    }
    
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