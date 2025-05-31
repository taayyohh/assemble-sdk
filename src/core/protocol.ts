import { Address, Hash } from 'viem'
import { AssembleClientConfig } from '../types'
import { WalletError, ContractError, ValidationError } from '../errors'
import { validateAddress, validateBasisPoints } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for protocol-level admin operations
 */
export class ProtocolManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Claim accumulated protocol funds
   */
  async claimFunds(): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'claimFunds',
        args: [],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to claim funds', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Claim organizer credential for an event
   */
  async claimOrganizerCredential(eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'claimOrganizerCredential',
        args: [eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to claim organizer credential', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Set protocol fee (admin only)
   */
  async setProtocolFee(newFeeBps: number): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateBasisPoints(newFeeBps, 10000) // Max 100%

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'setProtocolFee',
        args: [newFeeBps],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to set protocol fee', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Set fee recipient address (admin only)
   */
  async setFeeTo(newFeeTo: Address): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(newFeeTo, 'fee recipient')

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'setFeeTo',
        args: [newFeeTo],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to set fee recipient', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get maximum payment splits allowed
   */
  async getMaxPaymentSplits(): Promise<number> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'MAX_PAYMENT_SPLITS',
        args: [],
      })

      return Number(result)
    } catch (error) {
      throw new ContractError('Failed to get max payment splits', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get maximum platform fee
   */
  async getMaxPlatformFee(): Promise<number> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'MAX_PLATFORM_FEE',
        args: [],
      })

      return Number(result)
    } catch (error) {
      throw new ContractError('Failed to get max platform fee', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get maximum protocol fee
   */
  async getMaxProtocolFee(): Promise<number> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'MAX_PROTOCOL_FEE',
        args: [],
      })

      return Number(result)
    } catch (error) {
      throw new ContractError('Failed to get max protocol fee', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get maximum ticket quantity per purchase
   */
  async getMaxTicketQuantity(): Promise<number> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'MAX_TICKET_QUANTITY',
        args: [],
      })

      return Number(result)
    } catch (error) {
      throw new ContractError('Failed to get max ticket quantity', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get refund claim deadline
   */
  async getRefundClaimDeadline(): Promise<bigint> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'REFUND_CLAIM_DEADLINE',
        args: [],
      })

      return result as bigint
    } catch (error) {
      throw new ContractError('Failed to get refund claim deadline', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get current protocol fee in basis points
   */
  async getProtocolFee(): Promise<number> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'protocolFeeBps',
        args: [],
      })

      return Number(result)
    } catch (error) {
      throw new ContractError('Failed to get protocol fee', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get current fee recipient address
   */
  async getFeeTo(): Promise<Address> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'feeTo',
        args: [],
      })

      return result as Address
    } catch (error) {
      throw new ContractError('Failed to get fee recipient', error instanceof Error ? error.message : 'Unknown error')
    }
  }
} 