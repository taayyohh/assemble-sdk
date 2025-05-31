import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { AssembleClient, EventVisibility } from '../../src'
import { startAnvil, stopAnvil, createTestClients, deployAssembleContract, AnvilInstance } from '../utils/anvil'
import { parseEther } from 'viem'

// Tests that run against a local Anvil instance with deployed contract
describe('Anvil Integration Tests', () => {
  let anvil: AnvilInstance
  let client: AssembleClient

  beforeAll(async () => {
    // Start Anvil
    anvil = await startAnvil()
    const { publicClient, walletClient } = createTestClients(anvil)

    // Deploy contract
    const contractAddress = await deployAssembleContract(walletClient, publicClient)
    
    client = AssembleClient.create({
      contractAddress,
      publicClient,
      walletClient
    })
  })

  afterAll(() => {
    if (anvil) {
      stopAnvil(anvil)
    }
  })

  describe('Contract Connection', () => {
    it('should connect to deployed Anvil contract', () => {
      expect(client.config.contractAddress).toBeDefined()
      expect(client.isConnected).toBe(true)
    })

    it('should have correct chain ID', async () => {
      const chainId = await client.getChainId()
      expect(chainId).toBe(31337) // Foundry/Anvil chain ID
    })
  })

  describe('Read-Only Contract Calls', () => {
    it('should get protocol fee', async () => {
      const result = await client.protocol.getProtocolFee()
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(1000) // Max 10%
    })

    it('should get fee recipient', async () => {
      const feeTo = await client.protocol.getFeeTo()
      expect(feeTo).toMatch(/^0x[a-fA-F0-9]{40}$/) // Valid address format
    })

    it('should get protocol constants', async () => {
      const [maxPaymentSplits, maxPlatformFee, maxProtocolFee, maxTicketQuantity] = await Promise.all([
        client.protocol.getMaxPaymentSplits(),
        client.protocol.getMaxPlatformFee(),
        client.protocol.getMaxProtocolFee(),
        client.protocol.getMaxTicketQuantity()
      ])

      expect(maxPaymentSplits).toBe(20)
      expect(maxPlatformFee).toBe(500) // 5%
      expect(maxProtocolFee).toBe(1000) // 10%
      expect(maxTicketQuantity).toBe(50)
    })
  })

  describe('Event Operations', () => {
    it('should handle getting non-existent event', async () => {
      const event = await client.events.getEvent(999999n)
      // Contract returns empty struct for non-existent events, not null
      expect(event).toBeDefined()
      expect(event?.title).toBe('')
      expect(event?.capacity).toBe(0)
    })

    it('should get events with pagination', async () => {
      const response = await client.events.getEvents({ limit: 5, offset: 0 })
      expect(response).toHaveProperty('events')
      expect(response).toHaveProperty('total')
      expect(response).toHaveProperty('hasMore')
      expect(Array.isArray(response.events)).toBe(true)
    })

    it('should create an event with free Anvil ETH', async () => {
      const eventParams = {
        title: 'SDK Test Event',
        description: 'Testing the Assemble SDK on Anvil',
        imageUri: 'https://example.com/test.jpg',
        startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
        capacity: 100,
        venueId: 1n,
        visibility: EventVisibility.PUBLIC,
        tiers: [
          {
            name: 'General',
            price: parseEther('0.01'),
            maxSupply: 50,
            sold: 0,
            startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
            endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
            transferrable: true
          }
        ],
        paymentSplits: [
          {
            recipient: client.account!,
            basisPoints: 10000 // 100%
          }
        ]
      }

      const hash = await client.events.createEvent(eventParams)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })
  })

  describe('SDK Manager Coverage', () => {
    it('should have all EventManager methods available', () => {
      const eventMethods = [
        'createEvent', 'getEvent', 'getEvents', 'cancelEvent',
        'inviteToEvent', 'removeInvitation', 'isInvited',
        'updateRSVP', 'getUserRSVP', 'hasAttended', 'isEventCancelled',
        'getEventsByOrganizer', 'isEventOrganizer'
      ]
      
      eventMethods.forEach(method => {
        expect(typeof (client.events as any)[method]).toBe('function')
      })
    })

    it('should have all TicketManager methods available', () => {
      const ticketMethods = [
        'purchaseTickets', 'calculatePrice', 'getTickets', 'getTicketBalance',
        'transferTickets', 'useTicket', 'checkIn', 'checkInWithTicket',
        'checkInDelegate', 'isValidTicketForEvent', 'getRefundAmounts',
        'claimRefund', 'claimTipRefund', 'totalSupply', 'generateTokenId'
      ]
      
      ticketMethods.forEach(method => {
        expect(typeof (client.tickets as any)[method]).toBe('function')
      })
    })

    it('should have all SocialManager methods available', () => {
      const socialMethods = [
        'addFriend', 'removeFriend', 'getFriends', 'isFriend',
        'postComment', 'deleteComment', 'likeComment', 'unlikeComment',
        'getComments', 'getEventComments', 'getComment', 'hasLikedComment',
        'banUser', 'unbanUser', 'getPaymentSplits', 'getPendingWithdrawals',
        'tipEvent'
      ]
      
      socialMethods.forEach(method => {
        expect(typeof (client.social as any)[method]).toBe('function')
      })
    })

    it('should have all ProtocolManager methods available', () => {
      const protocolMethods = [
        'setProtocolFee', 'getProtocolFee', 'setFeeTo', 'getFeeTo',
        'claimFunds', 'claimOrganizerCredential', 'getMaxPaymentSplits',
        'getMaxPlatformFee', 'getMaxProtocolFee', 'getMaxTicketQuantity'
      ]
      
      protocolMethods.forEach(method => {
        expect(typeof (client.protocol as any)[method]).toBe('function')
      })
    })
  })
})

// Optional Sepolia integration tests - requires real ETH
describe.skip('Sepolia Integration Tests (Manual Only)', () => {
  let client: AssembleClient

  beforeAll(() => {
    const SEPOLIA_CONTRACT_ADDRESS = '0x9A5F66b4dB17f6546D4A224Eb41468f7C2079B59'
    // Only runs if explicitly enabled - requires manual setup and Sepolia ETH
  })

  // ... existing Sepolia tests moved here but skipped by default
}) 