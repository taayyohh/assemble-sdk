import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AssembleClient, EventVisibility, RSVPStatus } from '../../src'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

describe('Assemble SDK Unit Tests', () => {
  const mockAccount = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.llamarpc.com')
  })

  const walletClient = createWalletClient({
    chain: mainnet,
    transport: http('https://eth.llamarpc.com'),
    account: mockAccount
  })

  describe('Client Creation & Structure', () => {
    it('should create SDK client with all managers', () => {
      const client = AssembleClient.create({
        contractAddress,
        publicClient,
        walletClient
      })

      expect(client).toBeInstanceOf(AssembleClient)
      expect(client.events).toBeDefined()
      expect(client.tickets).toBeDefined()
      expect(client.social).toBeDefined()
      expect(client.protocol).toBeDefined()
      expect(client.config.contractAddress).toBe(contractAddress)
    })

    it('should work without wallet client', () => {
      const client = AssembleClient.create({
        contractAddress,
        publicClient
      })

      expect(client.isConnected).toBe(false)
      expect(client.account).toBeUndefined()
      expect(client.events).toBeDefined()
    })

    it('should handle wallet connection state', () => {
      const client = AssembleClient.create({
        contractAddress,
        publicClient,
        walletClient
      })

      expect(client.isConnected).toBe(true)
      expect(client.account).toBe(mockAccount.address)

      client.disconnect()
      expect(client.isConnected).toBe(false)
      expect(client.account).toBeUndefined()
    })
  })

  describe('Type System', () => {
    it('should export EventVisibility enum correctly', () => {
      expect(EventVisibility.PUBLIC).toBe(0)
      expect(EventVisibility.PRIVATE).toBe(1)
      expect(EventVisibility.INVITE_ONLY).toBe(2)
    })

    it('should export RSVPStatus enum correctly', () => {
      expect(RSVPStatus.NOT_GOING).toBe(0)
      expect(RSVPStatus.MAYBE).toBe(1)
      expect(RSVPStatus.GOING).toBe(2)
    })
  })

  describe('Error Classes', () => {
    it('should have custom error classes', async () => {
      const { WalletError, ContractError, ValidationError } = await import('../../src/errors')
      
      expect(() => { throw new WalletError('test') }).toThrow('test')
      expect(() => { throw new ContractError('test') }).toThrow('test')
      expect(() => { throw new ValidationError('test') }).toThrow('test')
    })
  })

  describe('Validation Utilities', () => {
    it('should validate addresses', async () => {
      const { validateAddress } = await import('../../src/utils')
      
      expect(() => validateAddress('0x1234567890123456789012345678901234567890', 'test'))
        .not.toThrow()
      
      expect(() => validateAddress('invalid', 'test'))
        .toThrow('Invalid test')
    })

    it('should validate basis points', async () => {
      const { validateBasisPoints } = await import('../../src/utils')
      
      expect(() => validateBasisPoints(500, 1000)).not.toThrow()
      expect(() => validateBasisPoints(1500, 1000)).toThrow('between 0 and 1000')
    })

    it('should validate event timing', async () => {
      const { validateEventTiming } = await import('../../src/utils')
      
      const now = BigInt(Math.floor(Date.now() / 1000))
      const future = now + 3600n
      const farFuture = now + 7200n
      
      expect(() => validateEventTiming(future, farFuture)).not.toThrow()
      expect(() => validateEventTiming(now - 3600n, future)).toThrow('future')
      expect(() => validateEventTiming(future, future - 1n)).toThrow('after start time')
    })

    it('should validate payment splits', async () => {
      const { validatePaymentSplits } = await import('../../src/utils')
      
      const validSplits = [
        { recipient: mockAccount.address, basisPoints: 8000 },
        { recipient: mockAccount.address, basisPoints: 2000 }
      ]
      
      const invalidSplits = [
        { recipient: mockAccount.address, basisPoints: 5000 }
      ]
      
      expect(() => validatePaymentSplits(validSplits)).not.toThrow()
      expect(() => validatePaymentSplits(invalidSplits)).toThrow('100%')
    })
  })

  describe('Manager Structure', () => {
    let client: AssembleClient

    beforeEach(() => {
      client = AssembleClient.create({
        contractAddress,
        publicClient,
        walletClient
      })
    })

    it('should have EventManager with all methods', () => {
      expect(typeof client.events.createEvent).toBe('function')
      expect(typeof client.events.getEvent).toBe('function')
      expect(typeof client.events.cancelEvent).toBe('function')
      expect(typeof client.events.inviteToEvent).toBe('function')
      expect(typeof client.events.updateRSVP).toBe('function')
      expect(typeof client.events.hasAttended).toBe('function')
    })

    it('should have TicketManager with all methods', () => {
      expect(typeof client.tickets.purchaseTickets).toBe('function')
      expect(typeof client.tickets.getTickets).toBe('function')
      expect(typeof client.tickets.transferTickets).toBe('function')
      expect(typeof client.tickets.checkIn).toBe('function')
      expect(typeof client.tickets.claimRefund).toBe('function')
      expect(typeof client.tickets.generateTokenId).toBe('function')
    })

    it('should have SocialManager with all methods', () => {
      expect(typeof client.social.addFriend).toBe('function')
      expect(typeof client.social.getFriends).toBe('function')
      expect(typeof client.social.postComment).toBe('function')
      expect(typeof client.social.likeComment).toBe('function')
      expect(typeof client.social.tipEvent).toBe('function')
      expect(typeof client.social.banUser).toBe('function')
    })

    it('should have ProtocolManager with all methods', () => {
      expect(typeof client.protocol.setProtocolFee).toBe('function')
      expect(typeof client.protocol.claimFunds).toBe('function')
      expect(typeof client.protocol.setFeeTo).toBe('function')
      expect(typeof client.protocol.claimOrganizerCredential).toBe('function')
    })
  })

  describe('Chain Utilities', () => {
    it('should export supported chains', async () => {
      const { SUPPORTED_CHAINS } = await import('../../src/constants/chains')
      
      expect(SUPPORTED_CHAINS).toBeDefined()
      expect(SUPPORTED_CHAINS.mainnet).toBeDefined()
      expect(SUPPORTED_CHAINS.sepolia).toBeDefined()
      expect(SUPPORTED_CHAINS.base).toBeDefined()
      expect(SUPPORTED_CHAINS.baseSepolia).toBeDefined()
    })
  })

  // Test validation utilities without relying on actual imports working
  describe('Basic Structure Tests', () => {
    let client: AssembleClient

    beforeEach(() => {
      client = AssembleClient.create({
        contractAddress,
        publicClient,
        walletClient
      })
    })

    it('should have EventManager with core methods', () => {
      expect(typeof client.events.createEvent).toBe('function')
      expect(typeof client.events.getEvent).toBe('function')
      expect(typeof client.events.cancelEvent).toBe('function')
    })

    it('should have TicketManager with core methods', () => {
      expect(typeof client.tickets.purchaseTickets).toBe('function')
      expect(typeof client.tickets.getTickets).toBe('function')
      expect(typeof client.tickets.transferTickets).toBe('function')
    })

    it('should have SocialManager with core methods', () => {
      expect(typeof client.social.addFriend).toBe('function')
      expect(typeof client.social.getFriends).toBe('function')
      expect(typeof client.social.postComment).toBe('function')
    })
  })
}) 