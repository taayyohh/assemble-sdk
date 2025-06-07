import { Address } from 'viem'
import { AssembleClientConfig, TokenIdComponents, SoulboundToken, TokenType } from '../types'
import { ContractError } from '../errors'
import { validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for ERC-6909 token operations
 */
export class TokenManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Parse token ID into its components
   * Token ID format: (type << 224) | (eventId << 128) | (tierId << 64) | serialNumber
   */
  parseTokenId(tokenId: bigint): TokenIdComponents {
    const tokenType = Number((tokenId >> 224n) & 0xFFn) as TokenType
    const eventId = (tokenId >> 128n) & 0xFFFFFFFFFFFFFFFFFFFFFFFFn
    const tierId = Number((tokenId >> 64n) & 0xFFFFFFFFFFFFFFFFn)
    const serialNumber = tokenId & 0xFFFFFFFFFFFFFFFFn
    const metadata = 0n // Reserved for future use

    return {
      tokenType,
      eventId,
      tierId,
      serialNumber,
      metadata,
    }
  }

  /**
   * Construct token ID from components
   */
  constructTokenId(components: Omit<TokenIdComponents, 'metadata'>): bigint {
    const { tokenType, eventId, tierId, serialNumber } = components
    
    return (BigInt(tokenType) << 224n) | 
           (eventId << 128n) | 
           (BigInt(tierId) << 64n) | 
           serialNumber
  }

  /**
   * Check if a token is soulbound (non-transferable)
   */
  isSoulboundToken(tokenType: TokenType): boolean {
    return tokenType === TokenType.ATTENDANCE_BADGE || 
           tokenType === TokenType.ORGANIZER_CRED || 
           tokenType === TokenType.VENUE_CRED
  }

  /**
   * Get token balance for a user
   */
  async getTokenBalance(user: Address, tokenId: bigint): Promise<bigint> {
    validateAddress(user, 'user')

    try {
      const balance = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'balanceOf',
        args: [user, tokenId],
      })

      return balance as bigint
    } catch (error) {
      throw new ContractError('Failed to get token balance', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get all token balances for a user (requires event log analysis)
   */
  async getUserTokens(user: Address): Promise<SoulboundToken[]> {
    validateAddress(user, 'user')

    // This would require:
    // 1. Filter Transfer events to this user
    // 2. Parse token IDs to get types and metadata
    // 3. Filter for current balances > 0
    // 4. Construct SoulboundToken objects

    console.warn('getUserTokens requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Get attendance badges for a user
   */
  async getAttendanceBadges(user: Address): Promise<SoulboundToken[]> {
    validateAddress(user, 'user')

    // This would filter getUserTokens for ATTENDANCE_BADGE type
    console.warn('getAttendanceBadges requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Get organizer credentials for a user
   */
  async getOrganizerCredentials(user: Address): Promise<SoulboundToken[]> {
    validateAddress(user, 'user')

    // This would filter getUserTokens for ORGANIZER_CRED type
    console.warn('getOrganizerCredentials requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Get venue credentials for a user
   */
  async getVenueCredentials(user: Address): Promise<SoulboundToken[]> {
    validateAddress(user, 'user')

    // This would filter getUserTokens for VENUE_CRED type
    console.warn('getVenueCredentials requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Check if user has attended a specific event
   */
  async hasAttendanceBadge(user: Address, eventId: bigint): Promise<boolean> {
    validateAddress(user, 'user')

    try {
      // Construct attendance badge token ID
      const tokenId = this.constructTokenId({
        tokenType: TokenType.ATTENDANCE_BADGE,
        eventId,
        tierId: 0,
        serialNumber: 0n, // For attendance badges, serial number might be 0 or user-specific
      })

      const balance = await this.getTokenBalance(user, tokenId)
      return balance > 0n
    } catch (error) {
      throw new ContractError('Failed to check attendance badge', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if user has organizer credentials for a specific event
   */
  async hasOrganizerCredential(user: Address, eventId: bigint): Promise<boolean> {
    validateAddress(user, 'user')

    try {
      // Construct organizer credential token ID
      const tokenId = this.constructTokenId({
        tokenType: TokenType.ORGANIZER_CRED,
        eventId,
        tierId: 0,
        serialNumber: 0n,
      })

      const balance = await this.getTokenBalance(user, tokenId)
      return balance > 0n
    } catch (error) {
      throw new ContractError('Failed to check organizer credential', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if user has venue credentials for a specific venue
   */
  async hasVenueCredential(user: Address, venueHash: bigint): Promise<boolean> {
    validateAddress(user, 'user')

    try {
      // For venue credentials, the eventId field contains the venue hash
      const tokenId = this.constructTokenId({
        tokenType: TokenType.VENUE_CRED,
        eventId: venueHash, // Venue hash stored in eventId field
        tierId: 0,
        serialNumber: 0n,
      })

      const balance = await this.getTokenBalance(user, tokenId)
      return balance > 0n
    } catch (error) {
      throw new ContractError('Failed to check venue credential', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get total supply of a token
   */
  async getTotalSupply(tokenId: bigint): Promise<bigint> {
    try {
      const supply = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'totalSupply',
        args: [tokenId],
      })

      return supply as bigint
    } catch (error) {
      throw new ContractError('Failed to get total supply', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get token type name
   */
  getTokenTypeName(tokenType: TokenType): string {
    switch (tokenType) {
      case TokenType.NONE:
        return 'None'
      case TokenType.EVENT_TICKET:
        return 'Event Ticket'
      case TokenType.ATTENDANCE_BADGE:
        return 'Attendance Badge'
      case TokenType.ORGANIZER_CRED:
        return 'Organizer Credential'
      case TokenType.VENUE_CRED:
        return 'Venue Credential'
      default:
        return 'Unknown'
    }
  }

  /**
   * Validate token ID format
   */
  isValidTokenId(tokenId: bigint): boolean {
    try {
      const components = this.parseTokenId(tokenId)
      return Object.values(TokenType).includes(components.tokenType)
    } catch {
      return false
    }
  }
} 