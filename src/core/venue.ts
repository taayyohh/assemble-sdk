import { Address, keccak256, toBytes } from 'viem'
import { AssembleClientConfig, VenueData, VenueCredential, LocationCoordinates, Event } from '../types'
import { ContractError, ValidationError } from '../errors'
import { validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for venue-related operations
 */
export class VenueManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Generate venue hash from venue name (matches protocol implementation)
   */
  getVenueHash(venueName: string): bigint {
    if (!venueName || venueName.trim().length === 0) {
      throw new ValidationError('Venue name cannot be empty')
    }

    // Use keccak256 hash of venue name (as bytes32)
    const hash = keccak256(toBytes(venueName))
    return BigInt(hash)
  }

  /**
   * Get venue event count
   */
  async getVenueEventCount(venueHash: bigint): Promise<number> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'venueEventCount',
        args: [venueHash],
      })

      return Number(result as bigint)
    } catch (error) {
      throw new ContractError('Failed to get venue event count', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get venue data including event count and basic info
   */
  async getVenueData(venueHash: bigint, venueName?: string): Promise<VenueData> {
    const eventCount = await this.getVenueEventCount(venueHash)

    return {
      hash: venueHash,
      name: venueName || `Venue ${venueHash.toString().slice(0, 8)}...`,
      eventCount,
    }
  }

  /**
   * Get all events for a specific venue
   * Note: This requires indexing events by venue hash off-chain or via event logs
   */
  async getVenueEvents(_venueHash: bigint): Promise<Event[]> {
    // This would typically require event log filtering or off-chain indexing
    // For now, returning empty array - would need to implement event filtering
    // based on the venue hash in event creation logs
    
    // TODO: Implement via event log filtering:
    // 1. Filter EventCreated logs
    // 2. Extract venue hash from event data
    // 3. Match against requested venueHash
    // 4. Fetch full event data for matches
    
    console.warn('getVenueEvents requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Check if an organizer has venue credentials for a specific venue
   */
  async hasVenueCredential(organizer: Address, venueHash: bigint): Promise<boolean> {
    validateAddress(organizer, 'organizer')

    try {
      // Venue credentials are ERC-6909 tokens with type VENUE_CRED (4)
      // Token ID format: (type << 224) | (venueHash << 128) | (0 << 64) | serialNumber
      const tokenType = 4n // VENUE_CRED
      const baseTokenId = (tokenType << 224n) | (venueHash << 128n)
      
      // Check if organizer has any venue credential tokens for this venue
      // Note: This is simplified - in practice might need to check multiple serial numbers
      const balance = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'balanceOf',
        args: [organizer, baseTokenId],
      })

      return (balance as bigint) > 0n
    } catch (error) {
      throw new ContractError('Failed to check venue credential', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get all venue credentials for an organizer
   * Note: This would typically require event log analysis or off-chain indexing
   */
  async getOrganizerVenues(organizer: Address): Promise<VenueCredential[]> {
    validateAddress(organizer, 'organizer')

    // This would require:
    // 1. Filter Transfer events for VENUE_CRED tokens to this organizer
    // 2. Extract venue hashes from token IDs
    // 3. Get venue event counts and metadata
    // 4. Construct VenueCredential objects

    console.warn('getOrganizerVenues requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Pack location coordinates into a single bigint (as done in protocol)
   */
  packLocationData(latitude: number, longitude: number): bigint {
    // Validate coordinates
    if (latitude < -90 || latitude > 90) {
      throw new ValidationError('Latitude must be between -90 and 90')
    }
    if (longitude < -180 || longitude > 180) {
      throw new ValidationError('Longitude must be between -180 and 180')
    }

    // Convert to fixed-point representation (multiply by 1e6 for 6 decimal precision)
    const latFixed = BigInt(Math.round(latitude * 1000000))
    const lonFixed = BigInt(Math.round(longitude * 1000000))

    // Pack into single 256-bit value: high 128 bits = lat, low 128 bits = lon
    const packed = (latFixed << 128n) | (lonFixed & ((1n << 128n) - 1n))
    
    return packed
  }

  /**
   * Unpack location coordinates from bigint (reverse of pack operation)
   */
  unpackLocationData(locationData: bigint): LocationCoordinates {
    // Extract latitude (high 128 bits) and longitude (low 128 bits)
    const lonMask = (1n << 128n) - 1n
    const lonFixed = locationData & lonMask
    const latFixed = locationData >> 128n

    // Handle signed values (convert from unsigned to signed)
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

    // Convert back to decimal (divide by 1e6)
    const latitude = Number(latSigned) / 1000000
    const longitude = Number(lonSigned) / 1000000

    return { latitude, longitude }
  }

  /**
   * Find venues by name pattern (requires off-chain indexing)
   */
  async searchVenues(_namePattern: string, _limit: number = 10): Promise<VenueData[]> {
    // This would require off-chain indexing of venue names from events
    console.warn('searchVenues requires off-chain venue name indexing - returning empty array for now')
    return []
  }

  /**
   * Get top venues by event count (requires off-chain aggregation)
   */
  async getTopVenues(_limit: number = 10): Promise<VenueData[]> {
    // This would require:
    // 1. Index all venue hashes from events
    // 2. Aggregate event counts per venue
    // 3. Sort by event count
    // 4. Return top N venues

    console.warn('getTopVenues requires off-chain venue aggregation - returning empty array for now')
    return []
  }
} 