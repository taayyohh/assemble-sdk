import { Address, Hash } from 'viem'
import { AssembleClientConfig, EventInvitation, EventVisibility, InvitationStatus } from '../types'
import { WalletError, ContractError, ValidationError } from '../errors'
import { validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for private event operations
 */
export class PrivateEventManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Invite users to an event
   */
  async inviteToEvent(eventId: bigint, invitees: Address[]): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    if (invitees.length === 0) {
      throw new ValidationError('Must invite at least one user')
    }

    invitees.forEach((invitee, index) => {
      validateAddress(invitee, `invitee ${index}`)
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
   * Remove an invitation from an event
   */
  async removeInvitation(eventId: bigint, invitee: Address): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(invitee, 'invitee')

    try {
      // Note: The protocol doesn't have a removeInvitation function in the current ABI
      // This would need to be added to the protocol or handled via reinviting without the user
      throw new ContractError('Remove invitation functionality not available in current protocol')
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
        functionName: 'eventInvites',
        args: [eventId, user],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to check invitation status', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get all invitations for an event
   * Note: This requires event log analysis or off-chain indexing
   */
  async getEventInvitations(_eventId: bigint): Promise<Address[]> {
    // This would require:
    // 1. Filter InviteToEvent logs for this eventId
    // 2. Extract invited addresses
    // 3. Remove any that were later uninvited

    console.warn('getEventInvitations requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Get all invitations for a user
   * Note: This requires event log analysis or off-chain indexing
   */
  async getUserInvitations(user: Address): Promise<EventInvitation[]> {
    validateAddress(user, 'user')

    // This would require:
    // 1. Filter InviteToEvent logs for this user
    // 2. Get event data for each invitation
    // 3. Check current invitation status
    // 4. Construct EventInvitation objects

    console.warn('getUserInvitations requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Check if a user can purchase tickets for an event
   */
  async canPurchaseTickets(eventId: bigint, user: Address): Promise<boolean> {
    validateAddress(user, 'user')

    try {
      // Get event details to check visibility
      const eventData = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'events',
        args: [eventId],
      }) as any

      const [, , , , visibility] = eventData

      // Check visibility rules
      switch (visibility) {
        case EventVisibility.PUBLIC:
          return true
        case EventVisibility.PRIVATE:
          return false
        case EventVisibility.INVITE_ONLY:
          return await this.isInvited(eventId, user)
        default:
          return false
      }
    } catch (error) {
      throw new ContractError('Failed to check purchase permissions', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get event visibility
   */
  async getEventVisibility(eventId: bigint): Promise<EventVisibility> {
    try {
      const eventData = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'events',
        args: [eventId],
      }) as any

      const [, , , , visibility] = eventData
      return Number(visibility) as EventVisibility
    } catch (error) {
      throw new ContractError('Failed to get event visibility', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check invitation status for a user and event
   */
  async getInvitationStatus(eventId: bigint, user: Address): Promise<InvitationStatus> {
    validateAddress(user, 'user')

    try {
      const isInvited = await this.isInvited(eventId, user)
      
      if (!isInvited) {
        // Not invited at all - but this doesn't map to our enum
        // For now, treating as pending (could also be a separate state)
        return InvitationStatus.PENDING
      }

      // Note: The protocol doesn't track invitation response status
      // It only tracks if someone is invited or not
      // For ACCEPTED/DECLINED status, we'd need additional contract state
      
      return InvitationStatus.PENDING
    } catch (error) {
      throw new ContractError('Failed to get invitation status', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Accept an invitation (via RSVP)
   * Note: Invitation acceptance could be tracked via RSVP status
   */
  async acceptInvitation(eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      // Use RSVP system to indicate acceptance
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'updateRSVP',
        args: [eventId, 2], // RSVPStatus.GOING = 2
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to accept invitation', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Decline an invitation (via RSVP)
   */
  async declineInvitation(eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      // Use RSVP system to indicate decline
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'updateRSVP',
        args: [eventId, 0], // RSVPStatus.NOT_GOING = 0
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to decline invitation', error instanceof Error ? error.message : 'Unknown error')
    }
  }
} 