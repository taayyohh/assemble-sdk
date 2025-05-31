import { Address, Hash } from 'viem'
import { AssembleClientConfig, Event, CreateEventParams, EventsResponse, RSVPStatus } from '../types'
import { WalletError, ContractError, ValidationError } from '../errors'
import { validateEventTiming, validateCapacity, validatePaymentSplits, validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for event-related operations
 */
export class EventManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Create a new event
   */
  async createEvent(params: CreateEventParams): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    validateEventTiming(params.startTime, params.endTime)
    validateCapacity(params.capacity)
    validatePaymentSplits(params.paymentSplits)

    try {
      // Format event parameters according to contract structure
      const eventParams = {
        title: params.title,
        description: params.description,
        imageUri: params.imageUri,
        startTime: params.startTime,
        endTime: params.endTime,
        capacity: params.capacity,
        venueId: params.venueId,
        visibility: params.visibility,
      }

      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'createEvent',
        args: [eventParams, params.tiers, params.paymentSplits],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to create event', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get event by ID
   */
  async getEvent(eventId: bigint): Promise<Event | null> {
    try {
      // Get basic event data from events mapping
      const eventData = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'events',
        args: [eventId],
      }) as any

      // Get organizer from separate mapping
      const organizer = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'eventOrganizers',
        args: [eventId],
      }) as Address

      // Get cancellation status from separate mapping
      const isCancelled = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'eventCancelled',
        args: [eventId],
      }) as boolean

      // Check if event exists (organizer is zero address for non-existent events)
      if (!organizer || organizer === '0x0000000000000000000000000000000000000000') {
        return null
      }

      // Contract structure based on ABI:
      // [basePrice, startTime, capacity, venueId, visibility, status]
      const [, startTime, capacity, venueId, visibility] = eventData

      return {
        id: eventId,
        // Note: title, description, imageUri, endTime are not available from contract getters
        title: `Event #${eventId}`, // Fallback since metadata not available
        description: '', // Not available from contract
        imageUri: '', // Not available from contract  
        startTime: BigInt(startTime),
        endTime: BigInt(startTime) + 7200n, // Fallback: assume 2 hours duration
        capacity: Number(capacity),
        venueId: BigInt(venueId),
        visibility: Number(visibility),
        organizer,
        isCancelled: Boolean(isCancelled),
      } as Event
    } catch (error) {
      throw new ContractError('Failed to get event', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get multiple events with pagination
   */
  async getEvents(options?: {
    offset?: number
    limit?: number
    organizer?: Address
  }): Promise<EventsResponse> {
    try {
      // Get next event ID to determine range
      const nextEventId = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'nextEventId',
        args: [],
      }) as bigint

      const offset = options?.offset || 0
      const limit = options?.limit || 10
      const events: Event[] = []

      // Fetch events in range
      const startId = Math.max(1, Number(nextEventId) - offset - limit)
      const endId = Math.max(1, Number(nextEventId) - offset)

      for (let i = startId; i < endId && events.length < limit; i++) {
        try {
          const event = await this.getEvent(BigInt(i))
          if (event && (!options?.organizer || event.organizer === options.organizer)) {
            events.push(event)
          }
        } catch {
          // Skip invalid events
          continue
        }
      }

      return {
        events: events.reverse(), // Most recent first
        total: Number(nextEventId) - 1,
        hasMore: offset + limit < Number(nextEventId) - 1,
      }
    } catch (error) {
      throw new ContractError('Failed to get events', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Cancel an event
   */
  async cancelEvent(eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'cancelEvent',
        args: [eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to cancel event', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get events organized by a specific address
   */
  async getEventsByOrganizer(organizer: Address): Promise<Event[]> {
    try {
      const response = await this.getEvents({ organizer, limit: 100 })
      return response.events
    } catch (error) {
      throw new ContractError('Failed to get events by organizer', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if an address is the organizer of an event
   */
  async isEventOrganizer(eventId: bigint, address: Address): Promise<boolean> {
    try {
      const organizer = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'eventOrganizers',
        args: [eventId],
      }) as Address

      return organizer?.toLowerCase() === address.toLowerCase()
    } catch (error) {
      throw new ContractError('Failed to check event organizer', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Invite users to a private event
   */
  async inviteToEvent(eventId: bigint, invitees: Address[]): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    if (invitees.length === 0) {
      throw new ValidationError('At least one invitee is required')
    }

    if (invitees.length > 100) {
      throw new ValidationError('Maximum 100 invitees per transaction')
    }

    // Validate all addresses
    invitees.forEach((address, index) => {
      validateAddress(address, `invitee ${index}`)
    })

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'inviteToEvent',
        args: [eventId, invitees],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to invite users to event', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Remove invitation from a user
   */
  async removeInvitation(eventId: bigint, invitee: Address): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(invitee, 'invitee')

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'removeInvitation',
        args: [eventId, invitee],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to remove invitation', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if a user is invited to an event
   */
  async isInvited(eventId: bigint, user: Address): Promise<boolean> {
    validateAddress(user, 'user')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'isInvited',
        args: [eventId, user],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to check invitation status', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Update RSVP status for an event
   */
  async updateRSVP(eventId: bigint, status: RSVPStatus): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'updateRSVP',
        args: [eventId, status],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to update RSVP', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get user's RSVP status for an event
   */
  async getUserRSVP(eventId: bigint, user: Address): Promise<RSVPStatus> {
    validateAddress(user, 'user')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'getUserRSVP',
        args: [eventId, user],
      })

      return result as RSVPStatus
    } catch (error) {
      throw new ContractError('Failed to get RSVP status', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if a user has attended an event
   */
  async hasAttended(eventId: bigint, user: Address): Promise<boolean> {
    validateAddress(user, 'user')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'hasAttended',
        args: [user, eventId],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to check attendance', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if an event is cancelled
   */
  async isEventCancelled(eventId: bigint): Promise<boolean> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'isEventCancelled',
        args: [eventId],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to check if event is cancelled', error instanceof Error ? error.message : 'Unknown error')
    }
  }
} 