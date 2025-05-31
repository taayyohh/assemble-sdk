import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { Address, Hash } from 'viem'
import { useAssemble } from '../provider'
import type { 
  Comment, 
  CommentsResponse,
  PaymentSplit 
} from '../../types'

/**
 * Query Keys for Social Features
 */
export const socialKeys = {
  all: ['social'] as const,
  friends: () => [...socialKeys.all, 'friends'] as const,
  friendsList: (user: Address) => [...socialKeys.friends(), user] as const,
  friendship: (user1: Address, user2: Address) => 
    [...socialKeys.friends(), 'status', user1, user2] as const,
  comments: () => [...socialKeys.all, 'comments'] as const,
  eventComments: (eventId: bigint) => [...socialKeys.comments(), 'event', eventId] as const,
  comment: (commentId: bigint) => [...socialKeys.comments(), 'detail', commentId] as const,
  commentLike: (commentId: bigint, user: Address) => 
    [...socialKeys.comments(), 'like', commentId, user] as const,
  withdrawals: (user: Address) => [...socialKeys.all, 'withdrawals', user] as const,
  paymentSplits: (eventId: bigint) => [...socialKeys.all, 'splits', eventId] as const,
}

/**
 * Hook to get friends list for a user
 */
export function useFriends(
  userAddress: Address,
  options?: UseQueryOptions<Address[], Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: socialKeys.friendsList(userAddress),
    queryFn: () => client.social.getFriends(userAddress),
    enabled: !!userAddress,
    ...options,
  })
}

/**
 * Hook to check friendship status between two users
 */
export function useFriendship(
  user1: Address,
  user2: Address,
  options?: UseQueryOptions<boolean, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: socialKeys.friendship(user1, user2),
    queryFn: () => client.social.isFriend(user1, user2),
    enabled: !!user1 && !!user2,
    ...options,
  })
}

/**
 * Hook to get comments for an event
 */
export function useEventComments(
  eventId: bigint,
  options?: UseQueryOptions<CommentsResponse, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: socialKeys.eventComments(eventId),
    queryFn: () => client.social.getEventComments(eventId),
    enabled: !!eventId,
    ...options,
  })
}

/**
 * Hook to get a specific comment
 */
export function useComment(
  commentId: bigint,
  options?: UseQueryOptions<Comment | null, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: socialKeys.comment(commentId),
    queryFn: () => client.social.getComment(commentId),
    enabled: !!commentId,
    ...options,
  })
}

/**
 * Hook to check if a user has liked a comment
 */
export function useCommentLike(
  commentId: bigint,
  userAddress: Address,
  options?: UseQueryOptions<boolean, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: socialKeys.commentLike(commentId, userAddress),
    queryFn: () => client.social.hasLikedComment(commentId, userAddress),
    enabled: !!commentId && !!userAddress,
    ...options,
  })
}

/**
 * Hook to get pending withdrawals for a user
 */
export function usePendingWithdrawals(
  userAddress: Address,
  options?: UseQueryOptions<bigint, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: socialKeys.withdrawals(userAddress),
    queryFn: () => client.social.getPendingWithdrawals(userAddress),
    enabled: !!userAddress,
    ...options,
  })
}

/**
 * Hook to get payment splits for an event
 */
export function usePaymentSplits(
  eventId: bigint,
  options?: UseQueryOptions<PaymentSplit[], Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: socialKeys.paymentSplits(eventId),
    queryFn: () => client.social.getPaymentSplits(eventId),
    enabled: !!eventId,
    ...options,
  })
}

/**
 * Mutation hook to add a friend
 */
export function useAddFriend(
  options?: UseMutationOptions<Hash, Error, Address>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (friendAddress: Address) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.social.addFriend(friendAddress)
    },
    onSuccess: () => {
      // Invalidate friends queries
      queryClient.invalidateQueries({ queryKey: socialKeys.friends() })
    },
    ...options,
  })
}

/**
 * Mutation hook to remove a friend
 */
export function useRemoveFriend(
  options?: UseMutationOptions<Hash, Error, Address>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (friendAddress: Address) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.social.removeFriend(friendAddress)
    },
    onSuccess: () => {
      // Invalidate friends queries
      queryClient.invalidateQueries({ queryKey: socialKeys.friends() })
    },
    ...options,
  })
}

/**
 * Mutation hook to post a comment
 */
export function usePostComment(
  options?: UseMutationOptions<Hash, Error, { 
    eventId: bigint; 
    content: string; 
    parentId?: bigint 
  }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, content, parentId = 0n }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.social.postComment(eventId, content, parentId)
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate comments for this event
      queryClient.invalidateQueries({ queryKey: socialKeys.eventComments(eventId) })
    },
    ...options,
  })
}

/**
 * Mutation hook to like a comment
 */
export function useLikeComment(
  options?: UseMutationOptions<Hash, Error, bigint>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: bigint) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.social.likeComment(commentId)
    },
    onSuccess: (_, commentId) => {
      // Invalidate comment like status and comment details
      queryClient.invalidateQueries({ 
        queryKey: socialKeys.comments(),
        predicate: (query) => 
          query.queryKey.includes('like') && query.queryKey.includes(commentId)
      })
      queryClient.invalidateQueries({ queryKey: socialKeys.comment(commentId) })
    },
    ...options,
  })
}

/**
 * Mutation hook to unlike a comment
 */
export function useUnlikeComment(
  options?: UseMutationOptions<Hash, Error, bigint>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: bigint) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.social.unlikeComment(commentId)
    },
    onSuccess: (_, commentId) => {
      // Invalidate comment like status and comment details
      queryClient.invalidateQueries({ 
        queryKey: socialKeys.comments(),
        predicate: (query) => 
          query.queryKey.includes('like') && query.queryKey.includes(commentId)
      })
      queryClient.invalidateQueries({ queryKey: socialKeys.comment(commentId) })
    },
    ...options,
  })
}

/**
 * Mutation hook to tip an event
 */
export function useTipEvent(
  options?: UseMutationOptions<Hash, Error, { 
    eventId: bigint; 
    amount: bigint; 
    referrer?: Address; 
    platformFeeBps?: number 
  }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, amount, referrer, platformFeeBps }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.social.tipEvent(eventId, amount, referrer, platformFeeBps)
    },
    onSuccess: () => {
      // Invalidate withdrawals queries
      queryClient.invalidateQueries({ 
        queryKey: socialKeys.all,
        predicate: (query) => query.queryKey.includes('withdrawals')
      })
    },
    ...options,
  })
}

/**
 * Mutation hook to delete a comment
 */
export function useDeleteComment(
  options?: UseMutationOptions<Hash, Error, { commentId: bigint; eventId: bigint }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, eventId }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.social.deleteComment(commentId, eventId)
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate comments for this event
      queryClient.invalidateQueries({ queryKey: socialKeys.eventComments(eventId) })
    },
    ...options,
  })
} 