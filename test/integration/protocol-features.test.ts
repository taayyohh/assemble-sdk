import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { AssembleClient, EventVisibility, RSVPStatus } from '../../src'
import { startAnvil, stopAnvil, createTestClients, deployAssembleContract, AnvilInstance, setNextBlockTimestamp } from '../utils/anvil'
import { parseEther, Address } from 'viem'

// Comprehensive test suite for all Assemble protocol features
describe('Protocol Features Integration Tests', () => {
  let anvil: AnvilInstance
  let organizerClient: AssembleClient
  let userClient: AssembleClient
  let user2Client: AssembleClient
  let contractAddress: Address
  
  let organizer: Address
  let user: Address
  let user2: Address
  
  let eventId: bigint

  beforeAll(async () => {
    // Start Anvil with Sepolia fork
    anvil = await startAnvil()
    
    // Create multiple test clients for different users
    const organizerClients = createTestClients(anvil, 0)
    const userClients = createTestClients(anvil, 1)
    const user2Clients = createTestClients(anvil, 2)
    
    organizer = organizerClients.account
    user = userClients.account
    user2 = user2Clients.account

    // Deploy contract
    contractAddress = await deployAssembleContract(organizerClients.walletClient, organizerClients.publicClient)
    
    // Create SDK clients for each user
    organizerClient = AssembleClient.create({
      contractAddress,
      publicClient: organizerClients.publicClient,
      walletClient: organizerClients.walletClient
    })

    userClient = AssembleClient.create({
      contractAddress,
      publicClient: userClients.publicClient,
      walletClient: userClients.walletClient
    })

    user2Client = AssembleClient.create({
      contractAddress,
      publicClient: user2Clients.publicClient,
      walletClient: user2Clients.walletClient
    })
  })

  afterAll(() => {
    if (anvil) {
      stopAnvil(anvil)
    }
  })

  describe('🎫 Event Lifecycle', () => {
    it('should create a public event with multiple tiers', async () => {
      const eventParams = {
        title: 'DevCon 2024',
        description: 'The biggest Ethereum developer conference',
        imageUri: 'https://example.com/devcon.jpg',
        startTime: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
        endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),   // 2 hours from now
        capacity: 1000,
        venueId: 1n,
        visibility: EventVisibility.PUBLIC,
        tiers: [
          {
            name: 'General Admission',
            price: parseEther('0.1'),
            maxSupply: 800,
            sold: 0,
            startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
            endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 3000),
            transferrable: true
          },
          {
            name: 'VIP Access',
            price: parseEther('0.3'),
            maxSupply: 200,
            sold: 0,
            startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
            endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 3000),
            transferrable: true
          }
        ],
        paymentSplits: [
          {
            recipient: organizer,
            basisPoints: 9500 // 95% to organizer
          },
          {
            recipient: user2, // Co-organizer
            basisPoints: 500  // 5% to co-organizer
          }
        ]
      }

      const hash = await organizerClient.events.createEvent(eventParams)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Get the created event
      eventId = 1n // First event
      const event = await organizerClient.events.getEvent(eventId)
      expect(event).toBeDefined()
      expect(event?.title).toBe('DevCon 2024')
      expect(event?.capacity).toBe(1000)
      expect(event?.organizer).toBe(organizer)
    })

    it('should verify organizer permissions', async () => {
      const isOrganizer = await organizerClient.events.isEventOrganizer(eventId, organizer)
      expect(isOrganizer).toBe(true)

      const isUserOrganizer = await userClient.events.isEventOrganizer(eventId, user)
      expect(isUserOrganizer).toBe(false)
    })
  })

  describe('🎟️ Ticket Sales & Management', () => {
    it('should purchase general admission tickets', async () => {
      const tierIndex = 0 // General admission
      const quantity = 2
      const price = await userClient.tickets.calculatePrice(eventId, tierIndex, quantity)
      
      expect(price).toBeGreaterThan(0n)

      const hash = await userClient.tickets.purchaseTickets({
        eventId,
        tierId: tierIndex,
        quantity
      }, price)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Verify ticket balance
      const balance = await userClient.tickets.getTicketBalance(user, eventId, tierIndex)
      expect(balance).toBe(2)
    })

    it('should purchase VIP tickets', async () => {
      const tierIndex = 1 // VIP
      const quantity = 1
      const price = await user2Client.tickets.calculatePrice(eventId, tierIndex, quantity)

      const hash = await user2Client.tickets.purchaseTickets({
        eventId,
        tierId: tierIndex,
        quantity
      }, price)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      const balance = await user2Client.tickets.getTicketBalance(user2, eventId, tierIndex)
      expect(balance).toBe(1)
    })

    it('should get user tickets', async () => {
      const userTicketsResponse = await userClient.tickets.getTickets(user)
      expect(userTicketsResponse.tickets.length).toBeGreaterThan(0)
      
      const eventTickets = userTicketsResponse.tickets.filter(ticket => ticket.eventId === eventId)
      expect(eventTickets.length).toBe(2) // 2 general admission tickets
    })

    it('should transfer tickets between users', async () => {
      // Transfer 1 ticket from user to user2
      const hash = await userClient.tickets.transferTickets(user2, eventId, 0, 1) // tier 0, amount 1
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Verify balances
      const userBalance = await userClient.tickets.getTicketBalance(user, eventId, 0)
      const user2Balance = await user2Client.tickets.getTicketBalance(user2, eventId, 0)
      
      expect(userBalance).toBe(1) // Down from 2
      expect(user2Balance).toBe(1) // Should have 1 transferred ticket
    })
  })

  describe('👥 Social Features', () => {
    it('should add and manage friends', async () => {
      // User adds user2 as friend
      const hash = await userClient.social.addFriend(user2)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Check friendship status
      const isFriend = await userClient.social.isFriend(user, user2)
      expect(isFriend).toBe(true)

      // Get friends list
      const friends = await userClient.social.getFriends(user)
      expect(friends).toContain(user2)
    })

    it('should post and interact with comments', async () => {
      // Post a comment on the event
      const commentText = "Can't wait for this event! 🎉"
      const hash = await userClient.social.postComment(eventId, commentText)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Get event comments
      const comments = await userClient.social.getEventComments(eventId)
      expect(comments.length).toBeGreaterThan(0)
      
      const userComment = comments.find(c => c.author === user)
      expect(userComment).toBeDefined()
      expect(userComment?.content).toBe(commentText)

      // Like the comment
      if (userComment) {
        const likeHash = await user2Client.social.likeComment(userComment.id)
        expect(likeHash).toMatch(/^0x[a-fA-F0-9]{64}$/)

        // Check if user2 liked the comment
        const hasLiked = await user2Client.social.hasLikedComment(userComment.id, user2)
        expect(hasLiked).toBe(true)
      }
    })

    it('should tip the event', async () => {
      const tipAmount = parseEther('0.05')
      const hash = await userClient.social.tipEvent(eventId, {
        value: tipAmount
      })
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Check pending withdrawals for organizer
      const pendingWithdrawals = await organizerClient.social.getPendingWithdrawals(organizer)
      expect(pendingWithdrawals).toBeGreaterThan(0n)
    })
  })

  describe('📝 RSVP Management', () => {
    it('should manage RSVP responses', async () => {
      // User RSVPs as "Going"
      const hash = await userClient.events.updateRSVP(eventId, RSVPStatus.GOING)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Check RSVP status
      const rsvpStatus = await userClient.events.getUserRSVP(eventId, user)
      expect(rsvpStatus).toBe(RSVPStatus.GOING)

      // User2 RSVPs as "Maybe"
      await user2Client.events.updateRSVP(eventId, RSVPStatus.MAYBE)
      const user2RsvpStatus = await user2Client.events.getUserRSVP(eventId, user2)
      expect(user2RsvpStatus).toBe(RSVPStatus.MAYBE)
    })
  })

  describe('✅ Check-in Process', () => {
    it('should check in attendees with tickets', async () => {
      // Generate token ID for user's ticket
      const tokenId = await userClient.tickets.generateTokenId(eventId, user, 0) // Tier 0, first ticket
      
      // Check in the user
      const hash = await organizerClient.tickets.checkInWithTicket(eventId, user, tokenId)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Verify attendance
      const hasAttended = await organizerClient.events.hasAttended(eventId, user)
      expect(hasAttended).toBe(true)
    })

    it('should use tickets after check-in', async () => {
      const tokenId = await userClient.tickets.generateTokenId(eventId, user, 0)
      
      const hash = await userClient.tickets.useTicket(tokenId)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })
  })

  describe('🏛️ Protocol Administration', () => {
    it('should read protocol settings', async () => {
      // Get protocol fee (should be 50 bps = 0.5%)
      const protocolFee = await organizerClient.protocol.getProtocolFee()
      expect(protocolFee).toBe(50)

      // Get fee recipient
      const feeTo = await organizerClient.protocol.getFeeTo()
      expect(feeTo).toMatch(/^0x[a-fA-F0-9]{40}$/)

      // Get protocol constants
      const maxPaymentSplits = await organizerClient.protocol.getMaxPaymentSplits()
      const maxPlatformFee = await organizerClient.protocol.getMaxPlatformFee()
      const maxProtocolFee = await organizerClient.protocol.getMaxProtocolFee()
      
      expect(maxPaymentSplits).toBe(20)
      expect(maxPlatformFee).toBe(500) // 5%
      expect(maxProtocolFee).toBe(1000) // 10%
    })

    it('should claim organizer credentials', async () => {
      const hash = await organizerClient.protocol.claimOrganizerCredential(eventId)
      expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })
  })

  describe('💰 Payment & Withdrawal System', () => {
    it('should handle payment splits correctly', async () => {
      const paymentSplits = await organizerClient.social.getPaymentSplits(eventId)
      expect(paymentSplits.length).toBe(2) // Organizer + co-organizer
      
      // Check that splits add up to 100%
      const totalBasisPoints = paymentSplits.reduce((sum, split) => sum + split.basisPoints, 0)
      expect(totalBasisPoints).toBe(10000) // 100%
    })
  })

  describe('❌ Event Cancellation & Refunds', () => {
    it('should handle event cancellation and refunds', async () => {
      // First, let's create a separate event for cancellation testing
      const cancelEventParams = {
        title: 'Test Event for Cancellation',
        description: 'This event will be cancelled',
        imageUri: 'https://example.com/cancel-test.jpg',
        startTime: BigInt(Math.floor(Date.now() / 1000) + 7200), // 2 hours from now
        endTime: BigInt(Math.floor(Date.now() / 1000) + 10800),  // 3 hours from now
        capacity: 100,
        venueId: 2n,
        visibility: EventVisibility.PUBLIC,
        tiers: [
          {
            name: 'Test Tier',
            price: parseEther('0.01'),
            maxSupply: 100,
            sold: 0,
            startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
            endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 6000),
            transferrable: true
          }
        ],
        paymentSplits: [
          {
            recipient: organizer,
            basisPoints: 10000 // 100% to organizer
          }
        ]
      }

      // Create the event
      await organizerClient.events.createEvent(cancelEventParams)
      const cancelEventId = 2n // Second event

      // User purchases tickets
      const price = await userClient.tickets.calculatePrice(cancelEventId, 0, 1)
      await userClient.tickets.purchaseTickets(cancelEventId, 0, 1, { value: price.totalPrice })

      // Cancel the event
      const cancelHash = await organizerClient.events.cancelEvent(cancelEventId)
      expect(cancelHash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Verify event is cancelled
      const isCancelled = await organizerClient.events.isEventCancelled(cancelEventId)
      expect(isCancelled).toBe(true)

      // Check refund amounts
      const refundAmounts = await userClient.tickets.getRefundAmounts(cancelEventId, user)
      expect(refundAmounts.ticketRefund).toBeGreaterThan(0n)

      // Claim refund
      const refundHash = await userClient.tickets.claimRefund(cancelEventId)
      expect(refundHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
    })
  })

  describe('🔍 Query & Discovery Features', () => {
    it('should get events with pagination', async () => {
      const eventsPage1 = await organizerClient.events.getEvents({ limit: 1, offset: 0 })
      expect(eventsPage1.events.length).toBe(1)
      expect(eventsPage1.total).toBeGreaterThanOrEqual(2)
      expect(eventsPage1.hasMore).toBe(true)

      const eventsPage2 = await organizerClient.events.getEvents({ limit: 1, offset: 1 })
      expect(eventsPage2.events.length).toBe(1)
      expect(eventsPage1.events[0].id).not.toBe(eventsPage2.events[0].id)
    })

    it('should get events by organizer', async () => {
      const organizerEvents = await organizerClient.events.getEventsByOrganizer(organizer)
      expect(organizerEvents.length).toBeGreaterThanOrEqual(2) // Both events created by organizer
      
      const userEvents = await userClient.events.getEventsByOrganizer(user)
      expect(userEvents.length).toBe(0) // User is not an organizer
    })

    it('should get total ticket supply', async () => {
      const totalSupply = await organizerClient.tickets.totalSupply(eventId)
      expect(totalSupply).toBeGreaterThan(0) // Tickets were sold
    })
  })

  describe('🔐 Private Events & Invitations', () => {
    it('should create and manage private events', async () => {
      const privateEventParams = {
        title: 'Exclusive VIP Event',
        description: 'Invitation only event',
        imageUri: 'https://example.com/vip.jpg',
        startTime: BigInt(Math.floor(Date.now() / 1000) + 14400), // 4 hours from now
        endTime: BigInt(Math.floor(Date.now() / 1000) + 18000),   // 5 hours from now
        capacity: 50,
        venueId: 3n,
        visibility: EventVisibility.INVITE_ONLY,
        tiers: [
          {
            name: 'VIP Only',
            price: parseEther('0.5'),
            maxSupply: 50,
            sold: 0,
            startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
            endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 12000),
            transferrable: false // Non-transferrable VIP tickets
          }
        ],
        paymentSplits: [
          {
            recipient: organizer,
            basisPoints: 10000
          }
        ]
      }

      await organizerClient.events.createEvent(privateEventParams)
      const privateEventId = 3n

      // Invite users to the private event
      const inviteHash = await organizerClient.events.inviteToEvent(privateEventId, [user, user2])
      expect(inviteHash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Check invitation status
      const userInvited = await organizerClient.events.isInvited(privateEventId, user)
      const user2Invited = await organizerClient.events.isInvited(privateEventId, user2)
      
      expect(userInvited).toBe(true)
      expect(user2Invited).toBe(true)

      // Remove one invitation
      const removeHash = await organizerClient.events.removeInvitation(privateEventId, user2)
      expect(removeHash).toMatch(/^0x[a-fA-F0-9]{64}$/)

      // Verify removal
      const user2StillInvited = await organizerClient.events.isInvited(privateEventId, user2)
      expect(user2StillInvited).toBe(false)
    })
  })
}) 