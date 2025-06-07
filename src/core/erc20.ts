import { Address, Hash } from 'viem'
import { AssembleClientConfig, ERC20PurchaseParams, ERC20PurchaseWithFeeParams, ERC20TipParams, ERC20TipWithFeeParams } from '../types'
import { WalletError, ContractError, ValidationError } from '../errors'
import { validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for ERC20 payment operations
 */
export class ERC20Manager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Purchase tickets using ERC20 tokens
   */
  async purchaseTicketsERC20(params: ERC20PurchaseParams): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    validateAddress(params.token, 'token')
    if (params.quantity === 0) {
      throw new ValidationError('Quantity must be greater than 0')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'purchaseTicketsERC20',
        args: [params.eventId, params.tierId, params.quantity, params.token],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to purchase tickets with ERC20', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Purchase tickets using ERC20 tokens with platform fee
   */
  async purchaseTicketsERC20WithPlatformFee(params: ERC20PurchaseWithFeeParams): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    validateAddress(params.token, 'token')
    validateAddress(params.referrer, 'referrer')
    if (params.quantity === 0) {
      throw new ValidationError('Quantity must be greater than 0')
    }
    if (params.platformFeeBps > 500) {
      throw new ValidationError('Platform fee cannot exceed 5%')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'purchaseTicketsERC20',
        args: [params.eventId, params.tierId, params.quantity, params.token, params.referrer, params.platformFeeBps],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to purchase tickets with ERC20 and platform fee', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Tip event using ERC20 tokens
   */
  async tipEventERC20(params: ERC20TipParams): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    validateAddress(params.token, 'token')
    if (params.amount === 0n) {
      throw new ValidationError('Tip amount must be greater than 0')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'tipEventERC20',
        args: [params.eventId, params.token, params.amount],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to tip event with ERC20', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Tip event using ERC20 tokens with platform fee
   */
  async tipEventERC20WithPlatformFee(params: ERC20TipWithFeeParams): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    // Validate parameters
    validateAddress(params.token, 'token')
    validateAddress(params.referrer, 'referrer')
    if (params.amount === 0n) {
      throw new ValidationError('Tip amount must be greater than 0')
    }
    if (params.platformFeeBps > 500) {
      throw new ValidationError('Platform fee cannot exceed 5%')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'tipEventERC20',
        args: [params.eventId, params.token, params.amount, params.referrer, params.platformFeeBps],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to tip event with ERC20 and platform fee', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Claim ERC20 funds from pending withdrawals
   */
  async claimERC20Funds(token: Address): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(token, 'token')

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'claimERC20Funds',
        args: [token],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to claim ERC20 funds', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get pending ERC20 withdrawals for a user
   */
  async getPendingERC20Withdrawals(user: Address, token: Address): Promise<bigint> {
    validateAddress(user, 'user')
    validateAddress(token, 'token')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'pendingERC20Withdrawals',
        args: [token, user],
      })

      return result as bigint
    } catch (error) {
      throw new ContractError('Failed to get pending ERC20 withdrawals', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if a token is supported for payments
   */
  async isSupportedToken(token: Address): Promise<boolean> {
    validateAddress(token, 'token')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'supportedTokens',
        args: [token],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to check token support', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get all supported tokens (would need to be tracked off-chain or via events)
   * For now, returns common tokens that are typically supported
   */
  async getSupportedTokens(): Promise<Address[]> {
    // Note: This would typically need to track TokenSupportUpdated events
    // For now, returning a basic implementation
    const commonTokens: Address[] = [
      // Add common token addresses as they're added to the protocol
    ]

    const supportedTokens: Address[] = []
    for (const token of commonTokens) {
      try {
        const isSupported = await this.isSupportedToken(token)
        if (isSupported) {
          supportedTokens.push(token)
        }
      } catch {
        // Skip tokens that can't be checked
        continue
      }
    }

    return supportedTokens
  }
} 