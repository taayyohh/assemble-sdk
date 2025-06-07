import { Address, Hash } from 'viem'
import { AssembleClientConfig, RefundAmounts, RefundRecord, RefundType } from '../types'
import { WalletError, ContractError } from '../errors'
import { validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for refund operations
 */
export class RefundManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Get refund amounts for a user for an event
   */
  async getRefundAmounts(eventId: bigint, user: Address): Promise<RefundAmounts> {
    validateAddress(user, 'user')

    try {
      // Get ticket refund amount
      const ticketRefund = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'userTicketPayments',
        args: [eventId, user],
      }) as bigint

      // Get tip refund amount
      const tipRefund = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'userTipPayments',
        args: [eventId, user],
      }) as bigint

      return {
        ticketRefund,
        tipRefund,
      }
    } catch (error) {
      throw new ContractError('Failed to get refund amounts', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if a user can claim refunds for an event
   */
  async canClaimRefund(eventId: bigint, user: Address): Promise<boolean> {
    validateAddress(user, 'user')

    try {
      // Check if event is cancelled
      const isCancelled = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'eventCancelled',
        args: [eventId],
      }) as boolean

      if (!isCancelled) {
        return false
      }

      // Check if user has any refunds available
      const refundAmounts = await this.getRefundAmounts(eventId, user)
      return refundAmounts.ticketRefund > 0n || refundAmounts.tipRefund > 0n
    } catch (error) {
      throw new ContractError('Failed to check refund eligibility', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get the refund claim deadline for an event
   */
  async getRefundDeadline(_eventId: bigint): Promise<bigint> {
    try {
      // Note: The protocol implements a 90-day refund window from cancellation
      // This would typically be stored or calculated from cancellation timestamp
      // For now, we'll estimate based on current time + 90 days
      const currentTime = BigInt(Math.floor(Date.now() / 1000))
      const ninetyDays = 90n * 24n * 60n * 60n // 90 days in seconds
      
      return currentTime + ninetyDays
    } catch (error) {
      throw new ContractError('Failed to get refund deadline', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Claim ticket refund for an event
   */
  async claimTicketRefund(eventId: bigint): Promise<Hash> {
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
      throw new ContractError('Failed to claim ticket refund', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Claim tip refund for an event
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
   * Claim all refunds (tickets and tips) for an event
   */
  async claimAllRefunds(eventId: bigint): Promise<Hash[]> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    const hashes: Hash[] = []

    try {
      // Get refund amounts to see what's available
      const account = this.config.walletClient.account?.address
      if (!account) {
        throw new WalletError('No account connected')
      }

      const refunds = await this.getRefundAmounts(eventId, account)

      // Claim ticket refund if available
      if (refunds.ticketRefund > 0n) {
        const ticketHash = await this.claimTicketRefund(eventId)
        hashes.push(ticketHash)
      }

      // Claim tip refund if available
      if (refunds.tipRefund > 0n) {
        const tipHash = await this.claimTipRefund(eventId)
        hashes.push(tipHash)
      }

      return hashes
    } catch (error) {
      throw new ContractError('Failed to claim all refunds', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get refund history for a user
   * Note: This requires event log analysis or off-chain indexing
   */
  async getRefundHistory(user: Address): Promise<RefundRecord[]> {
    validateAddress(user, 'user')

    // This would require:
    // 1. Filter TicketRefundClaimed and TipRefundClaimed events for this user
    // 2. Extract event IDs, amounts, and timestamps
    // 3. Construct RefundRecord objects

    console.warn('getRefundHistory requires event log indexing - returning empty array for now')
    return []
  }

  /**
   * Check if refunds have been claimed for an event by a user
   */
  async hasClaimedRefunds(eventId: bigint, user: Address): Promise<{
    ticketRefundClaimed: boolean
    tipRefundClaimed: boolean
  }> {
    validateAddress(user, 'user')

    try {
      // Check current refund amounts - if 0, they may have been claimed
      // Note: This isn't foolproof as amounts could be 0 if user never paid
      const currentRefunds = await this.getRefundAmounts(eventId, user)
      
      // This is a simplified check - ideally we'd track claimed status separately
      return {
        ticketRefundClaimed: currentRefunds.ticketRefund === 0n,
        tipRefundClaimed: currentRefunds.tipRefund === 0n,
      }
    } catch (error) {
      throw new ContractError('Failed to check refund claim status', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Estimate gas cost for refund claims
   */
  async estimateRefundGas(eventId: bigint, refundType: RefundType): Promise<bigint> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const functionName = refundType === RefundType.TICKET ? 'claimTicketRefund' : 'claimTipRefund'
      
      const gasEstimate = await this.config.publicClient.estimateContractGas({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName,
        args: [eventId],
        account: this.config.walletClient.account?.address,
      })

      return gasEstimate
    } catch (error) {
      throw new ContractError('Failed to estimate gas for refund', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get total refunds available for a user across all events
   */
  async getTotalRefundsAvailable(user: Address): Promise<bigint> {
    validateAddress(user, 'user')

    // This would require:
    // 1. Get all events user has payments for
    // 2. Check which are cancelled
    // 3. Sum up all available refunds
    // 4. For now, returning 0

    console.warn('getTotalRefundsAvailable requires comprehensive event analysis - returning 0 for now')
    return 0n
  }
} 