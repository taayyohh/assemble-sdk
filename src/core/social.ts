import { Address, Hash } from 'viem'
import { AssembleClientConfig, Friend, Comment, CommentsResponse, PaymentSplit } from '../types'
import { WalletError, ContractError, ValidationError } from '../errors'
import { validateAddress } from '../utils'
import { ASSEMBLE_ABI } from '../constants/abi'

/**
 * Manager for social features (friends, comments, etc.)
 */
export class SocialManager {
  constructor(private config: AssembleClientConfig) {}

  /**
   * Add a friend
   */
  async addFriend(friendAddress: Address): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(friendAddress, 'friend address')

    if (friendAddress === this.config.walletClient.account?.address) {
      throw new ValidationError('Cannot add yourself as a friend')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'addFriend',
        args: [friendAddress],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to add friend', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Remove a friend
   */
  async removeFriend(friendAddress: Address): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(friendAddress, 'friend address')

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'removeFriend',
        args: [friendAddress],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to remove friend', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get friends list for an address
   */
  async getFriends(userAddress: Address): Promise<Address[]> {
    validateAddress(userAddress, 'user address')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'getFriends',
        args: [userAddress],
      })

      return result as Address[]
    } catch (error) {
      throw new ContractError('Failed to get friends', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if two addresses are friends
   */
  async isFriend(user1: Address, user2: Address): Promise<boolean> {
    validateAddress(user1, 'user1 address')
    validateAddress(user2, 'user2 address')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'isFriend',
        args: [user1, user2],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to check friendship', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Post a comment on an event
   */
  async postComment(eventId: bigint, content: string, parentId = 0n): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    if (!content.trim()) {
      throw new ValidationError('Comment content cannot be empty')
    }

    if (content.length > 1000) {
      throw new ValidationError('Comment content cannot exceed 1000 characters')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'postComment',
        args: [eventId, content, parentId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to post comment', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Delete a comment (moderator only)
   */
  async deleteComment(commentId: bigint, eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'deleteComment',
        args: [commentId, eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to delete comment', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Like a comment
   */
  async likeComment(commentId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'likeComment',
        args: [commentId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to like comment', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Unlike a comment
   */
  async unlikeComment(commentId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'unlikeComment',
        args: [commentId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to unlike comment', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get comments for an event
   */
  async getComments(eventId: bigint): Promise<Comment[]> {
    try {
      // Get all comments for the event using the contract function
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'getEventComments',
        args: [eventId],
      })

      return result as Comment[]
    } catch (error) {
      throw new ContractError('Failed to get comments', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get all comments for an event (enhanced version)
   */
  async getEventComments(eventId: bigint): Promise<CommentsResponse> {
    try {
      // Get comment IDs from the contract (returns uint256[])
      const commentIds = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'getEventComments',
        args: [eventId],
      }) as bigint[]

      // Fetch individual comments by ID
      const comments: Comment[] = []
      for (const commentId of commentIds) {
        try {
          const comment = await this.getComment(commentId)
          if (comment) {
            comments.push({ ...comment, id: commentId })
          }
        } catch (error) {
          // Skip comments that can't be fetched
          console.warn(`Failed to fetch comment ${commentId}:`, error)
        }
      }
      
      // Separate top-level comments and replies
      const topLevelComments = comments.filter(c => c.parentId === 0n)
      const replies = comments.filter(c => c.parentId !== 0n)
      
      // Organize comments with their replies
      const commentsWithReplies = topLevelComments.map(comment => ({
        ...comment,
        replies: replies.filter(reply => reply.parentId === comment.id)
      }))

      return {
        comments: commentsWithReplies,
        total: comments.length
      }
    } catch (error) {
      throw new ContractError('Failed to get event comments', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get a specific comment by ID
   */
  async getComment(commentId: bigint): Promise<Comment | null> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'getComment',
        args: [commentId],
      }) as any

      if (!result || !result.author || result.author === '0x0000000000000000000000000000000000000000') {
        return null
      }

      // Contract returns: [author, timestamp, content, parentId, isDeleted, likes]
      const { author, timestamp, content, parentId, isDeleted, likes } = result

      return {
        id: commentId,
        author: author as Address,
        timestamp: BigInt(timestamp),
        content: content as string,
        parentId: BigInt(parentId),
        isDeleted: Boolean(isDeleted),
        likes: Number(likes),
      } as Comment
    } catch (error) {
      throw new ContractError('Failed to get comment', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Check if a user has liked a comment
   */
  async hasLikedComment(commentId: bigint, userAddress: Address): Promise<boolean> {
    validateAddress(userAddress, 'user address')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'hasLikedComment',
        args: [commentId, userAddress],
      })

      return result as boolean
    } catch (error) {
      throw new ContractError('Failed to check comment like status', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Ban a user from an event
   */
  async banUser(user: Address, eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(user, 'user address')

    if (user === this.config.walletClient.account?.address) {
      throw new ValidationError('Cannot ban yourself')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'banUser',
        args: [user, eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to ban user', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Unban a user from an event
   */
  async unbanUser(user: Address, eventId: bigint): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    validateAddress(user, 'user address')

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'unbanUser',
        args: [user, eventId],
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to unban user', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get payment splits for an event
   */
  async getPaymentSplits(eventId: bigint): Promise<PaymentSplit[]> {
    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'getPaymentSplits',
        args: [eventId],
      }) as any[]

      // Contract returns array of tuples: [{recipient, basisPoints}, ...]
      return result.map(split => ({
        recipient: split.recipient as Address,
        basisPoints: Number(split.basisPoints),
      }))
    } catch (error) {
      throw new ContractError('Failed to get payment splits', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Get pending withdrawals for a user
   */
  async getPendingWithdrawals(user: Address): Promise<bigint> {
    validateAddress(user, 'user address')

    try {
      const result = await this.config.publicClient.readContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'pendingWithdrawals',
        args: [user],
      })

      return result as bigint
    } catch (error) {
      throw new ContractError('Failed to get pending withdrawals', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Tip an event organizer
   */
  async tipEvent(eventId: bigint, amount: bigint, referrer?: Address, platformFeeBps?: number): Promise<Hash> {
    if (!this.config.walletClient) {
      throw new WalletError('Wallet not connected')
    }

    if (amount <= 0n) {
      throw new ValidationError('Tip amount must be greater than 0')
    }

    try {
      const hash = await this.config.walletClient.writeContract({
        address: this.config.contractAddress,
        abi: ASSEMBLE_ABI,
        functionName: 'tipEvent',
        args: [
          eventId,
          referrer || '0x0000000000000000000000000000000000000000',
          platformFeeBps || 0,
        ],
        value: amount,
      })

      return hash
    } catch (error) {
      throw new ContractError('Failed to tip event', error instanceof Error ? error.message : 'Unknown error')
    }
  }
} 