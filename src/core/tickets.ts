import { Address, Hash } from 'viem'
import { AssembleClientConfig, Ticket, PurchaseTicketsParams, TicketsResponse, CheckInParams, RefundAmounts } from '../types'
import { WalletError, ContractError, ValidationError } from '../errors'
import { validateAddress, validateBasisPoints } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for ticket-related operations
 */
export class TicketManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Purchase tickets for an event
   */
  async purchaseTickets(params: PurchaseTicketsParams, value: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    if (params.quantity <= 0 || params.quantity > 50) {
      throw new ValidationError('Ticket quantity must be between 1 and 50')
    }

    if (params.referrer) {
      validateAddress(params.referrer, 'referrer')
    }

    if (params.platformFeeBps !== undefined) {
      validateBasisPoints(params.platformFeeBps, 500) // Max 5%
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'purchaseTickets',
        args: [
          params.eventId,
          params.tierId,
          params.quantity,
          params.referrer || '0x0000000000000000000000000000000000000000',
          params.platformFeeBps || 0,
        ],
        value,
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to purchase tickets', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get ticket price for specific quantity
   */
  async calculatePrice(eventId: bigint, tierId: number, quantity: number): Promise<bigint> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'calculatePrice',
        args: [eventId, tierId, quantity],
      })

      return result as bigint
    } catch (error) {
      throw new ContractError('Failed to calculate price', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get tickets owned by an address
   */
  async getTickets(owner: Address): Promise<TicketsResponse> {
    try {
      // Get next event ID to determine range
      const nextEventId = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'nextEventId',
        args: [],
      }) as bigint

      const tickets: Ticket[] = []

      // Check ticket balances for all events and tiers
      for (let eventId = 1n; eventId < nextEventId; eventId++) {
        try {
          // Get event to check tier count
          const event = await this.config.publicClient.readContract({
            address: this.config.contractAddress,
            abi: ASSEMBLE_ABI,
            functionName: 'events',
            args: [eventId],
          })

          if (!event) continue

          // Check each tier (assuming max 10 tiers per event)
          for (let tierId = 0; tierId < 10; tierId++) {
            try {
              const balance = await this.getTicketBalance(owner, eventId, tierId)
              if (balance > 0) {
                const tokenId = await this.generateTokenId(eventId, tierId)
                
                // Create ticket objects for each balance
                for (let i = 0; i < balance; i++) {
                  tickets.push({
                    eventId,
                    tierId,
                    tokenId: tokenId + BigInt(i),
                    owner,
                    isUsed: false, // Would need to check actual usage status
                  })
                }
              }
            } catch {
              // No more tiers for this event
              break
            }
          }
        } catch {
          // Skip invalid events
          continue
        }
      }
      
      return {
        tickets,
        total: tickets.length,
      }
    } catch (error) {
      throw new ContractError('Failed to get tickets', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get ticket balance for a specific event and tier
   */
  async getTicketBalance(owner: Address, eventId: bigint, tierId: number): Promise<number> {
    try {
      const tokenId = await this.generateTokenId(eventId, tierId)
      
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'balanceOf',
        args: [owner, tokenId],
      })

      return Number(result)
    } catch (error) {
      throw new ContractError('Failed to get ticket balance', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Transfer tickets to another address
   */
  async transferTickets(
    to: Address,
    eventId: bigint,
    tierId: number,
    amount: number
  ): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(to, 'recipient')

    try {
      const tokenId = await this.generateTokenId(eventId, tierId)
      
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'safeTransferFrom',
        args: [
          this.config.walletClient.account!.address,
          to,
          tokenId,
          amount,
          '0x',
        ],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to transfer tickets', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Use/check-in a ticket
   */
  async useTicket(eventId: bigint, tierId: number): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'useTicket',
        args: [eventId, tierId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to use ticket', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Basic check-in to an event
   */
  async checkIn(eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'checkIn',
        args: [eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to check in', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check-in with a specific ticket token
   */
  async checkInWithTicket(eventId: bigint, ticketTokenId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'checkInWithTicket',
        args: [eventId, ticketTokenId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to check in with ticket', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Delegate check-in for another attendee
   */
  async checkInDelegate(eventId: bigint, ticketTokenId: bigint, attendee: Address): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(attendee, 'attendee')

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'checkInDelegate',
        args: [eventId, ticketTokenId, attendee],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to delegate check in', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Validate if a ticket is valid for an event
   */
  async isValidTicketForEvent(tokenId: bigint, eventId: bigint): Promise<boolean> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'isValidTicketForEvent',
        args: [tokenId, eventId],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to validate ticket', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get refund amounts for a cancelled event
   */
  async getRefundAmounts(eventId: bigint, user: Address): Promise<RefundAmounts> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'getRefundAmounts',
        args: [eventId, user],
      })

      const [ticketRefund, tipRefund] = result as [bigint, bigint]
      return { ticketRefund, tipRefund }
    } catch (error) {
      throw new ContractError('Failed to get refund amounts', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Claim refund for cancelled event
   */
  async claimRefund(eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'claimTicketRefund',
        args: [eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to claim refund', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Claim tip refund for cancelled event
   */
  async claimTipRefund(eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'claimTipRefund',
        args: [eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to claim tip refund', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get total supply of a token
   */
  async totalSupply(tokenId: bigint): Promise<bigint> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'totalSupply',
        args: [tokenId],
      })

      return result as bigint
    } catch (error) {
      throw new ContractError('Failed to get total supply', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Generate token ID for ERC6909 tokens
   * This should match the contract's token ID generation logic
   */
  public async generateTokenId(eventId: bigint, tierId: number, serialNumber = 0n): Promise<bigint> {
    try {
      // Call the contract's generateTokenId function for consistency
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'generateTokenId',
        args: [0, eventId, tierId, serialNumber], // 0 = EVENT_TICKET type
      })
      return result as bigint
    } catch (error) {
      // Fallback to manual calculation if contract function not available
      // This should match your contract's logic
      return (eventId << 32n) | BigInt(tierId)
    }
  }
} 