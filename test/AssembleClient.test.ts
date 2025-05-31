import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { AssembleClient } from '../src'
import { startAnvil, stopAnvil, createTestClients, deployAssembleContract, AnvilInstance, TestClients } from './utils/anvil'

describe('AssembleClient', () => {
  let anvil: AnvilInstance
  let clients: TestClients
  let contractAddress: string

  beforeAll(async () => {
    anvil = await startAnvil()
    clients = createTestClients(anvil)
    contractAddress = await deployAssembleContract(clients.walletClient, clients.publicClient)
  })

  afterAll(() => {
    stopAnvil(anvil)
  })

  describe('Client Creation', () => {
    it('should create client with static factory method', () => {
      const client = AssembleClient.create({
        contractAddress: contractAddress as `0x${string}`,
        publicClient: clients.publicClient,
        walletClient: clients.walletClient
      })

      expect(client).toBeInstanceOf(AssembleClient)
      expect(client.config.contractAddress).toBe(contractAddress)
      expect(client.config.publicClient).toBe(clients.publicClient)
      expect(client.config.walletClient).toBe(clients.walletClient)
    })

    it('should create client with constructor', () => {
      const config = {
        contractAddress: contractAddress as `0x${string}`,
        publicClient: clients.publicClient,
        walletClient: clients.walletClient
      }

      const client = new AssembleClient(config)

      expect(client).toBeInstanceOf(AssembleClient)
      expect(client.config).toEqual(config)
    })

    it('should initialize all managers', () => {
      const client = AssembleClient.create({
        contractAddress: contractAddress as `0x${string}`,
        publicClient: clients.publicClient,
        walletClient: clients.walletClient
      })

      expect(client.events).toBeDefined()
      expect(client.tickets).toBeDefined()
      expect(client.social).toBeDefined()
      expect(client.protocol).toBeDefined()
    })
  })

  describe('Account Management', () => {
    let client: AssembleClient

    beforeEach(() => {
      client = AssembleClient.create({
        contractAddress: contractAddress as `0x${string}`,
        publicClient: clients.publicClient,
        walletClient: clients.walletClient
      })
    })

    it('should return current account address', () => {
      expect(client.account).toBe(clients.account)
    })

    it('should report connected status correctly', () => {
      expect(client.isConnected).toBe(true)
    })

    it('should report disconnected when no wallet', () => {
      const clientWithoutWallet = AssembleClient.create({
        contractAddress: contractAddress as `0x${string}`,
        publicClient: clients.publicClient
      })

      expect(clientWithoutWallet.isConnected).toBe(false)
      expect(clientWithoutWallet.account).toBeUndefined()
    })

    it('should set new wallet client', () => {
      const newClients = createTestClients(anvil, 1)
      client.setWalletClient(newClients.walletClient)

      expect(client.config.walletClient).toBe(newClients.walletClient)
      expect(client.account).toBe(newClients.account)
    })

    it('should disconnect wallet', () => {
      client.disconnect()

      expect(client.config.walletClient).toBeUndefined()
      expect(client.isConnected).toBe(false)
      expect(client.account).toBeUndefined()
    })
  })

  describe('Chain Management', () => {
    let client: AssembleClient

    beforeEach(() => {
      client = AssembleClient.create({
        contractAddress: contractAddress as `0x${string}`,
        publicClient: clients.publicClient,
        walletClient: clients.walletClient
      })
    })

    it('should get current chain ID', async () => {
      const chainId = await client.getChainId()
      expect(chainId).toBe(anvil.chainId)
    })

    it('should throw error when switching chain without wallet', async () => {
      client.disconnect()
      
      await expect(client.switchChain(1)).rejects.toThrow('No wallet connected')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid contract address', () => {
      expect(() => {
        AssembleClient.create({
          contractAddress: 'invalid' as any,
          publicClient: clients.publicClient,
          walletClient: clients.walletClient
        })
      }).not.toThrow() // viem handles address validation
    })
  })
}) 