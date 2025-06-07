import { Address, Hash } from 'viem'
import { AssembleClientConfig, Event, CreateEventParams, EventsResponse, RSVPStatus, LocationData, LocationCoordinates, VenueData, EventStatus } from '../types'
import { WalletError, ContractError, ValidationError } from '../errors'
import { validateEventTiming, validateCapacity, validatePaymentSplits, validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for event-related operations
 */
export class EventManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Create a new event with enhanced location/venue support
   */
  async createEvent(params: CreateEventParams): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    validateEventTiming(params.startTime, params.endTime)
    validateCapacity(params.capacity)
    validatePaymentSplits(params.paymentSplits)

    // ✅ NEW: Validate location coordinates
    if (params.latitude < -90 || params.latitude > 90) {
      throw new ValidationError('Latitude must be between -90 and 90')
    }
    if (params.longitude < -180 || params.longitude > 180) {
      throw new ValidationError('Longitude must be between -180 and 180')
    }
    if (!params.venueName || params.venueName.trim().length === 0) {
      throw new ValidationError('Venue name is required')
    }

    try {
      // ✅ NEW: Pack location data (as done in protocol)
      const latFixed = BigInt(Math.round(params.latitude * 1000000))
      const lonFixed = BigInt(Math.round(params.longitude * 1000000))
      const locationData = (latFixed << 128n) | (lonFixed & ((1n << 128n) - 1n))

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
        locationData, // ✅ NEW: Packed GPS coordinates
        venueName: params.venueName, // ✅ NEW: Venue name
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
   * Get event by ID with enhanced venue/location data
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
      // [basePrice, startTime, capacity, venueId, visibility, status, locationData, venueName, venueHash, tierCount]
      const [basePrice, startTime, capacity, venueId, visibility, status, locationData, venueName, venueHash, tierCount] = eventData

      // ✅ NEW: Unpack location data
      const lonMask = (1n << 128n) - 1n
      const lonFixed = BigInt(locationData) & lonMask
      const latFixed = BigInt(locationData) >> 128n
      
      // Handle signed values
      const signBit = 1n << 127n
      const signMask = signBit - 1n

      let latSigned = latFixed
      if (latFixed & signBit) {
        latSigned = latFixed | ~signMask
      }

      let lonSigned = lonFixed
      if (lonFixed & signBit) {
        lonSigned = lonFixed | ~signMask
      }

      const latitude = Number(latSigned) / 1000000
      const longitude = Number(lonSigned) / 1000000

      return {
        id: eventId,
        // Note: title, description, imageUri, endTime would need to be from event logs or off-chain
        title: `Event #${eventId}`, // Fallback since metadata not available from contract getters
        description: '', // Not available from contract getters
        imageUri: '', // Not available from contract getters
        startTime: BigInt(startTime),
        endTime: BigInt(startTime) + 7200n, // Fallback: assume 2 hours duration
        capacity: Number(capacity),
        venueId: BigInt(venueId), // Legacy field
        visibility: Number(visibility),
        organizer,
        isCancelled: Boolean(isCancelled),
        // ✅ NEW: Enhanced event fields
        latitude,
        longitude,
        venueName: venueName || 'Unknown Venue',
        venueHash: BigInt(venueHash),
        status: Number(status),
        tierCount: Number(tierCount),
        basePrice: BigInt(basePrice),
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
   * Check if an event is cancelled (enhanced)
   */
  async isEventCancelled(eventId: bigint): Promise<boolean> {
    try {
      const event = await this.getEvent(eventId)
      if (!event) {
        throw new ValidationError('Event not found')
      }

      return event.isCancelled || event.status === EventStatus.CANCELLED
    } catch (error) {
      throw new ContractError('Failed to check if event is cancelled', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * ✅ NEW: Get event location data
   */
  async getEventLocation(eventId: bigint): Promise<LocationData> {
    const event = await this.getEvent(eventId)
    if (!event) {
      throw new ValidationError('Event not found')
    }

    const coordinates: LocationCoordinates = {
      latitude: event.latitude,
      longitude: event.longitude,
    }

    const venue: VenueData = {
      hash: event.venueHash,
      name: event.venueName,
      eventCount: 0, // Would need separate call to get venue event count
      coordinates,
    }

    return {
      coordinates,
      venue,
    }
  }

  /**
   * ✅ NEW: Get event venue data
   */
  async getEventVenue(eventId: bigint): Promise<VenueData> {
    const event = await this.getEvent(eventId)
    if (!event) {
      throw new ValidationError('Event not found')
    }

    // Get venue event count
    const venueEventCount = await this.config.publicClient.readContract({
      address: this.config.contractAddress,
      abi: ASSEMBLE_ABI,
      functionName: 'venueEventCount',
      args: [event.venueHash],
    }) as bigint

    return {
      hash: event.venueHash,
      name: event.venueName,
      eventCount: Number(venueEventCount),
      coordinates: {
        latitude: event.latitude,
        longitude: event.longitude,
      },
    }
  }

  /**
   * ✅ NEW: Get events by venue hash
   */
  async getEventsByVenue(venueHash: bigint): Promise<Event[]> {
    // This would typically require event log filtering or off-chain indexing
    // For now, we'll scan through events and filter by venue hash
    try {
      const allEvents = await this.getEvents({ limit: 100 })
      return allEvents.events.filter(event => event.venueHash === venueHash)
    } catch (error) {
      throw new ContractError('Failed to get events by venue', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * ✅ NEW: Get event status
   */
  async getEventStatus(eventId: bigint): Promise<EventStatus> {
    const event = await this.getEvent(eventId)
    if (!event) {
      throw new ValidationError('Event not found')
    }

    return event.status as EventStatus
  }
} 