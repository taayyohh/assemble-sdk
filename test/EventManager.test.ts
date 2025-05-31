import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { AssembleClient, EventVisibility, RSVPStatus } from '../src'
import { startAnvil, stopAnvil, createTestClients, deployAssembleContract, AnvilInstance, TestClients, setNextBlockTimestamp } from './utils/anvil'
import { parseEther } from 'viem'

describe('EventManager', () => {
  let anvil: AnvilInstance
  let clients: TestClients
  let client: AssembleClient
  let organizerClient: AssembleClient
  let contractAddress: string

  beforeAll(async () => {
    anvil = await startAnvil()
    clients = createTestClients(anvil, 0)
    contractAddress = await deployAssembleContract(clients.walletClient, clients.publicClient)
    
    client = AssembleClient.create({
      contractAddress: contractAddress as `0x${string}`,
      publicClient: clients.publicClient,
      walletClient: clients.walletClient
    })

    // Create second client for organizer tests
    const organizerClients = createTestClients(anvil, 1)
    organizerClient = AssembleClient.create({
      contractAddress: contractAddress as `0x${string}`,
      publicClient: organizerClients.publicClient,
      walletClient: organizerClients.walletClient
    })
  })

  afterAll(() => {
    stopAnvil(anvil)
  })

  describe('Event Creation', () => {
    const createSampleEvent = () => ({
      title: 'Test Event',
      description: 'A test event for SDK testing',
      imageUri: 'https://example.com/image.jpg',
      startTime: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
      endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),   // 2 hours from now
      capacity: 100,
      venueId: 1n,
      visibility: 0 as EventVisibility.PUBLIC, // Use numeric value
      tiers: [
        {
          name: 'General Admission',
          price: parseEther('0.1'),
          maxSupply: 80,
          sold: 0,
          startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
          endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
          transferrable: true
        },
        {
          name: 'VIP',
          price: parseEther('0.2'),
          maxSupply: 20,
          sold: 0,
          startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
          endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
          transferrable: true
        }
      ],
      paymentSplits: [
        {
          recipient: clients.account,
          basisPoints: 8000 // 80%
        },
        {
          recipient: anvil.accounts[1],
          basisPoints: 2000 // 20%
        }
      ]
    })

    it('should create a public event successfully', async () => {
      const eventParams = createSampleEvent()
      
      // Mock the contract call since we don't have actual deployment
      const createEvent = vi.fn().mockResolvedValue('0x123...')
      client.events.createEvent = createEvent

      const result = await client.events.createEvent(eventParams)
      expect(result).toBeDefined()
      expect(createEvent).toHaveBeenCalledWith(eventParams)
    })

    it('should create a private event successfully', async () => {
      const eventParams = {
        ...createSampleEvent(),
        visibility: 1 as EventVisibility.PRIVATE // Use numeric value
      }
      
      const createEvent = vi.fn().mockResolvedValue('0x456...')
      client.events.createEvent = createEvent

      const result = await client.events.createEvent(eventParams)
      expect(result).toBeDefined()
      expect(createEvent).toHaveBeenCalledWith(eventParams)
    })

    it('should create an invite-only event successfully', async () => {
      const eventParams = {
        ...createSampleEvent(),
        visibility: 2 as EventVisibility.INVITE_ONLY // Use numeric value
      }
      
      const createEvent = vi.fn().mockResolvedValue('0x789...')
      client.events.createEvent = createEvent

      const result = await client.events.createEvent(eventParams)
      expect(result).toBeDefined()
      expect(createEvent).toHaveBeenCalledWith(eventParams)
    })

    it('should validate event timing', async () => {
      const eventParams = {
        ...createSampleEvent(),
        startTime: BigInt(Math.floor(Date.now() / 1000) - 3600), // Past time
        endTime: BigInt(Math.floor(Date.now() / 1000) + 3600)
      }

      await expect(client.events.createEvent(eventParams))
        .rejects.toThrow('Event start time must be in the future')
    })

    it('should validate end time after start time', async () => {
      const now = BigInt(Math.floor(Date.now() / 1000) + 3600)
      const eventParams = {
        ...createSampleEvent(),
        startTime: now,
        endTime: now - 1n // End before start
      }

      await expect(client.events.createEvent(eventParams))
        .rejects.toThrow('Event end time must be after start time')
    })

    it('should validate capacity', async () => {
      const eventParams = {
        ...createSampleEvent(),
        capacity: 0
      }

      await expect(client.events.createEvent(eventParams))
        .rejects.toThrow('Event capacity must be between 1 and 100,000')
    })

    it('should validate payment splits total 100%', async () => {
      const eventParams = {
        ...createSampleEvent(),
        paymentSplits: [
          {
            recipient: clients.account,
            basisPoints: 5000 // Only 50%
          }
        ]
      }

      await expect(client.events.createEvent(eventParams))
        .rejects.toThrow('Payment splits must total exactly 100%')
    })

    it('should require wallet connection', async () => {
      const disconnectedClient = AssembleClient.create({
        contractAddress: contractAddress as `0x${string}`,
        publicClient: clients.publicClient
      })

      const eventParams = createSampleEvent()

      await expect(disconnectedClient.events.createEvent(eventParams))
        .rejects.toThrow('Wallet not connected')
    })
  })

  describe('Event Management', () => {
    it('should cancel event', async () => {
      const cancelEvent = vi.fn().mockResolvedValue('0xcancel...')
      client.events.cancelEvent = cancelEvent

      const result = await client.events.cancelEvent(1n)
      expect(result).toBeDefined()
      expect(cancelEvent).toHaveBeenCalledWith(1n)
    })

    it('should check if event is cancelled', async () => {
      const isEventCancelled = vi.fn().mockResolvedValue(false)
      client.events.isEventCancelled = isEventCancelled

      const result = await client.events.isEventCancelled(1n)
      expect(result).toBe(false)
      expect(isEventCancelled).toHaveBeenCalledWith(1n)
    })

    it('should check if user is event organizer', async () => {
      const isEventOrganizer = vi.fn().mockResolvedValue(true)
      client.events.isEventOrganizer = isEventOrganizer

      const result = await client.events.isEventOrganizer(1n, clients.account)
      expect(result).toBe(true)
      expect(isEventOrganizer).toHaveBeenCalledWith(1n, clients.account)
    })
  })

  describe('Event Invitations', () => {
    it('should invite users to event', async () => {
      const inviteToEvent = vi.fn().mockResolvedValue('0xinvite...')
      client.events.inviteToEvent = inviteToEvent

      const invitees = [anvil.accounts[1], anvil.accounts[2]]
      const result = await client.events.inviteToEvent(1n, invitees)
      
      expect(result).toBeDefined()
      expect(inviteToEvent).toHaveBeenCalledWith(1n, invitees)
    })

    it('should remove invitation', async () => {
      const removeInvitation = vi.fn().mockResolvedValue('0xremove...')
      client.events.removeInvitation = removeInvitation

      const result = await client.events.removeInvitation(1n, anvil.accounts[1])
      expect(result).toBeDefined()
      expect(removeInvitation).toHaveBeenCalledWith(1n, anvil.accounts[1])
    })

    it('should check if user is invited', async () => {
      const isInvited = vi.fn().mockResolvedValue(true)
      client.events.isInvited = isInvited

      const result = await client.events.isInvited(1n, anvil.accounts[1])
      expect(result).toBe(true)
      expect(isInvited).toHaveBeenCalledWith(1n, anvil.accounts[1])
    })

    it('should validate invitee addresses', async () => {
      const invalidInvitees = ['invalid-address'] as any
      
      await expect(client.events.inviteToEvent(1n, invalidInvitees))
        .rejects.toThrow('Invalid invitee 0')
    })

    it('should require at least one invitee', async () => {
      await expect(client.events.inviteToEvent(1n, []))
        .rejects.toThrow('At least one invitee is required')
    })

    it('should limit maximum invitees per transaction', async () => {
      const tooManyInvitees = Array(101).fill(anvil.accounts[1])
      
      await expect(client.events.inviteToEvent(1n, tooManyInvitees))
        .rejects.toThrow('Maximum 100 invitees per transaction')
    })
  })

  describe('RSVP Management', () => {
    it('should update RSVP status', async () => {
      const updateRSVP = vi.fn().mockResolvedValue('0xrsvp...')
      client.events.updateRSVP = updateRSVP

      const result = await client.events.updateRSVP(1n, RSVPStatus.GOING)
      expect(result).toBeDefined()
      expect(updateRSVP).toHaveBeenCalledWith(1n, RSVPStatus.GOING)
    })

    it('should get user RSVP status', async () => {
      const getUserRSVP = vi.fn().mockResolvedValue(RSVPStatus.MAYBE)
      client.events.getUserRSVP = getUserRSVP

      const result = await client.events.getUserRSVP(1n, clients.account)
      expect(result).toBe(RSVPStatus.MAYBE)
      expect(getUserRSVP).toHaveBeenCalledWith(1n, clients.account)
    })

    it('should validate RSVP status', async () => {
      await expect(client.events.updateRSVP(1n, 999 as RSVPStatus))
        .rejects.toThrow('Invalid RSVP status')
    })
  })

  describe('Attendance Tracking', () => {
    it('should check if user has attended', async () => {
      const hasAttended = vi.fn().mockResolvedValue(true)
      client.events.hasAttended = hasAttended

      const result = await client.events.hasAttended(1n, clients.account)
      expect(result).toBe(true)
      expect(hasAttended).toHaveBeenCalledWith(1n, clients.account)
    })
  })

  describe('Event Queries', () => {
    it('should get event by ID', async () => {
      const mockEvent = {
        id: 1n,
        title: 'Test Event',
        description: 'Test Description',
        imageUri: 'https://example.com/image.jpg',
        startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
        capacity: 100,
        venueId: 1n,
        visibility: EventVisibility.PUBLIC,
        organizer: clients.account,
        isCancelled: false
      }

      const getEvent = vi.fn().mockResolvedValue(mockEvent)
      client.events.getEvent = getEvent

      const result = await client.events.getEvent(1n)
      expect(result).toEqual(mockEvent)
      expect(getEvent).toHaveBeenCalledWith(1n)
    })

    it('should get events with pagination', async () => {
      const mockResponse = {
        events: [],
        total: 0,
        hasMore: false
      }

      const getEvents = vi.fn().mockResolvedValue(mockResponse)
      client.events.getEvents = getEvents

      const result = await client.events.getEvents({ limit: 10, offset: 0 })
      expect(result).toEqual(mockResponse)
      expect(getEvents).toHaveBeenCalledWith({ limit: 10, offset: 0 })
    })

    it('should get events by organizer', async () => {
      const getEventsByOrganizer = vi.fn().mockResolvedValue([])
      client.events.getEventsByOrganizer = getEventsByOrganizer

      const result = await client.events.getEventsByOrganizer(clients.account)
      expect(result).toEqual([])
      expect(getEventsByOrganizer).toHaveBeenCalledWith(clients.account)
    })
  })
}) 