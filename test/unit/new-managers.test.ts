import { describe, it, expect, beforeEach } from 'vitest'
import { AssembleClient, TokenType, EventStatus, InvitationStatus } from '../../src'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

describe('🆕 New Managers Unit Tests', () => {
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

  let client: AssembleClient

  beforeEach(() => {
    client = AssembleClient.create({
      contractAddress,
      publicClient,
      walletClient
    })
  })

  describe('🏢 VenueManager Integration', () => {
    it('should have VenueManager properly initialized', () => {
      expect(client.venues).toBeDefined()
      expect(typeof client.venues.getVenueHash).toBe('function')
      expect(typeof client.venues.getVenueEventCount).toBe('function')
      expect(typeof client.venues.packLocationData).toBe('function')
      expect(typeof client.venues.unpackLocationData).toBe('function')
      expect(typeof client.venues.hasVenueCredential).toBe('function')
    })

    it('should handle venue hash generation', () => {
      const venueName = 'Madison Square Garden'
      const hash = client.venues.getVenueHash(venueName)
      expect(typeof hash).toBe('bigint')
      expect(hash).toBeGreaterThan(0n)
    })

    it('should pack and unpack location data correctly', () => {
      const lat = 40.7505
      const lon = -73.9934
      
      const packed = client.venues.packLocationData(lat, lon)
      expect(typeof packed).toBe('bigint')
      
      const unpacked = client.venues.unpackLocationData(packed)
      expect(Math.abs(unpacked.latitude - lat)).toBeLessThan(0.000001)
      expect(Math.abs(unpacked.longitude - lon)).toBeLessThan(0.000001)
    })
  })

  describe('💰 ERC20Manager Integration', () => {
    it('should have ERC20Manager properly initialized', () => {
      expect(client.erc20).toBeDefined()
      expect(typeof client.erc20.purchaseTicketsERC20).toBe('function')
      expect(typeof client.erc20.tipEventERC20).toBe('function')
      expect(typeof client.erc20.claimERC20Funds).toBe('function')
      expect(typeof client.erc20.isSupportedToken).toBe('function')
    })
  })

  describe('🔒 PrivateEventManager Integration', () => {
    it('should have PrivateEventManager properly initialized', () => {
      expect(client.privateEvents).toBeDefined()
      expect(typeof client.privateEvents.inviteToEvent).toBe('function')
      expect(typeof client.privateEvents.isInvited).toBe('function')
      expect(typeof client.privateEvents.canPurchaseTickets).toBe('function')
      expect(typeof client.privateEvents.acceptInvitation).toBe('function')
      expect(typeof client.privateEvents.declineInvitation).toBe('function')
    })
  })

  describe('💸 PlatformFeeManager Integration', () => {
    it('should have PlatformFeeManager properly initialized', () => {
      expect(client.platformFees).toBeDefined()
      expect(typeof client.platformFees.calculatePlatformFee).toBe('function')
      expect(typeof client.platformFees.calculateTotalPrice).toBe('function')
      expect(typeof client.platformFees.estimateTotalCost).toBe('function')
      expect(typeof client.platformFees.validatePlatformFeeBps).toBe('function')
    })

    it('should calculate platform fees correctly', () => {
      const baseAmount = 1000n
      const feeBps = 250 // 2.5%
      
      const fee = client.platformFees.calculatePlatformFee(baseAmount, feeBps)
      expect(fee).toBe(25n) // 2.5% of 1000
      
      const totalPrice = client.platformFees.calculateTotalPrice(baseAmount, feeBps)
      expect(totalPrice).toBe(1025n) // 1000 + 25
    })

    it('should validate fee rates correctly', () => {
      expect(client.platformFees.validatePlatformFeeBps(250)).toBe(true) // 2.5%
      expect(client.platformFees.validatePlatformFeeBps(500)).toBe(true) // 5%
      expect(client.platformFees.validatePlatformFeeBps(600)).toBe(false) // 6% - too high
      expect(client.platformFees.validatePlatformFeeBps(-10)).toBe(false) // negative
    })

    it('should convert between basis points and percentages', () => {
      expect(client.platformFees.bpsToPercentage(250)).toBe(2.5)
      expect(client.platformFees.percentageToBps(2.5)).toBe(250)
    })
  })

  describe('🔄 RefundManager Integration', () => {
    it('should have RefundManager properly initialized', () => {
      expect(client.refunds).toBeDefined()
      expect(typeof client.refunds.getRefundAmounts).toBe('function')
      expect(typeof client.refunds.canClaimRefund).toBe('function')
      expect(typeof client.refunds.claimTicketRefund).toBe('function')
      expect(typeof client.refunds.claimTipRefund).toBe('function')
      expect(typeof client.refunds.claimAllRefunds).toBe('function')
    })
  })

  describe('🎫 TokenManager Integration', () => {
    it('should have TokenManager properly initialized', () => {
      expect(client.tokens).toBeDefined()
      expect(typeof client.tokens.parseTokenId).toBe('function')
      expect(typeof client.tokens.constructTokenId).toBe('function')
      expect(typeof client.tokens.isSoulboundToken).toBe('function')
      expect(typeof client.tokens.getTokenBalance).toBe('function')
      expect(typeof client.tokens.hasAttendanceBadge).toBe('function')
    })

    it('should parse and construct token IDs correctly', () => {
      const tokenId = 1234567890123456789n
      const components = client.tokens.parseTokenId(tokenId)
      
      expect(components).toHaveProperty('tokenType')
      expect(components).toHaveProperty('eventId') 
      expect(components).toHaveProperty('tierId')
      expect(components).toHaveProperty('serialNumber')
      
      const reconstructed = client.tokens.constructTokenId({
        tokenType: components.tokenType,
        eventId: components.eventId,
        tierId: components.tierId,
        serialNumber: components.serialNumber
      })
      
      expect(reconstructed).toBe(tokenId)
    })

    it('should identify soulbound tokens correctly', () => {
      expect(client.tokens.isSoulboundToken(TokenType.EVENT_TICKET)).toBe(false)
      expect(client.tokens.isSoulboundToken(TokenType.ATTENDANCE_BADGE)).toBe(true)
      expect(client.tokens.isSoulboundToken(TokenType.ORGANIZER_CRED)).toBe(true)
      expect(client.tokens.isSoulboundToken(TokenType.VENUE_CRED)).toBe(true)
    })

    it('should provide token type names', () => {
      expect(client.tokens.getTokenTypeName(TokenType.EVENT_TICKET)).toBe('Event Ticket')
      expect(client.tokens.getTokenTypeName(TokenType.ATTENDANCE_BADGE)).toBe('Attendance Badge')
      expect(client.tokens.getTokenTypeName(TokenType.ORGANIZER_CRED)).toBe('Organizer Credential')
      expect(client.tokens.getTokenTypeName(TokenType.VENUE_CRED)).toBe('Venue Credential')
    })
  })

  describe('🔗 Enhanced EventManager Integration', () => {
    it('should have enhanced EventManager methods', () => {
      expect(typeof client.events.getEventLocation).toBe('function')
      expect(typeof client.events.getEventVenue).toBe('function')
      expect(typeof client.events.getEventsByVenue).toBe('function')
      expect(typeof client.events.getEventStatus).toBe('function')
    })
  })

  describe('🎯 Complete SDK Structure Validation', () => {
    it('should have all 10 managers initialized', () => {
      const expectedManagers = [
        'events',
        'tickets', 
        'social',
        'protocol',
        'erc20',
        'venues',
        'privateEvents',
        'platformFees', 
        'refunds',
        'tokens'
      ]
      
      expectedManagers.forEach(manager => {
        expect(client[manager]).toBeDefined()
        expect(typeof client[manager]).toBe('object')
      })
    })

    it('should export new enums correctly', () => {
      expect(EventStatus.ACTIVE).toBe(0)
      expect(EventStatus.CANCELLED).toBe(1)
      expect(EventStatus.COMPLETED).toBe(2)
      
      expect(TokenType.EVENT_TICKET).toBe(1)
      expect(TokenType.ATTENDANCE_BADGE).toBe(2)
      expect(TokenType.ORGANIZER_CRED).toBe(3)
      expect(TokenType.VENUE_CRED).toBe(4)
      
      expect(InvitationStatus.PENDING).toBe(0)
      expect(InvitationStatus.ACCEPTED).toBe(1)
      expect(InvitationStatus.DECLINED).toBe(2)
    })
  })
}) 