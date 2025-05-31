import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAssemble } from '../provider'
import type { 
  Ticket, 
  TicketsResponse, 
  PurchaseTicketsParams,
  RefundAmounts 
} from '../../types'

/**
 * Query Keys for Tickets
 */
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (owner: Address) => [...ticketKeys.lists(), owner] as const,
  balance: (owner: Address, eventId: bigint, tierId: number) => 
    [...ticketKeys.all, 'balance', owner, eventId, tierId] as const,
  price: (eventId: bigint, tierId: number, quantity: number) => 
    [...ticketKeys.all, 'price', eventId, tierId, quantity] as const,
  refunds: (eventId: bigint, user: Address) => 
    [...ticketKeys.all, 'refunds', eventId, user] as const,
  totalSupply: (tokenId: bigint) => 
    [...ticketKeys.all, 'totalSupply', tokenId] as const,
}

/**
 * Hook to get tickets owned by an address
 */
export function useTickets(
  owner: Address,
  options?: UseQueryOptions<TicketsResponse, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: ticketKeys.list(owner),
    queryFn: () => client.tickets.getTickets(owner),
    enabled: !!owner,
    ...options,
  })
}

/**
 * Hook to get ticket balance for specific event and tier
 */
export function useTicketBalance(
  owner: Address,
  eventId: bigint,
  tierId: number,
  options?: UseQueryOptions<number, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: ticketKeys.balance(owner, eventId, tierId),
    queryFn: () => client.tickets.getTicketBalance(owner, eventId, tierId),
    enabled: !!owner && !!eventId && tierId >= 0,
    ...options,
  })
}

/**
 * Hook to calculate ticket price
 */
export function useTicketPrice(
  eventId: bigint,
  tierId: number,
  quantity: number,
  options?: UseQueryOptions<bigint, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: ticketKeys.price(eventId, tierId, quantity),
    queryFn: () => client.tickets.calculatePrice(eventId, tierId, quantity),
    enabled: !!eventId && tierId >= 0 && quantity > 0,
    ...options,
  })
}

/**
 * Hook to get refund amounts
 */
export function useRefundAmounts(
  eventId: bigint,
  user: Address,
  options?: UseQueryOptions<RefundAmounts, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: ticketKeys.refunds(eventId, user),
    queryFn: () => client.tickets.getRefundAmounts(eventId, user),
    enabled: !!eventId && !!user,
    ...options,
  })
}

/**
 * Hook to get total supply of a token
 */
export function useTotalSupply(
  tokenId: bigint,
  options?: UseQueryOptions<bigint, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: ticketKeys.totalSupply(tokenId),
    queryFn: () => client.tickets.totalSupply(tokenId),
    enabled: !!tokenId,
    ...options,
  })
}

/**
 * Mutation hook to purchase tickets
 */
export function usePurchaseTickets(
  options?: UseMutationOptions<string, Error, { params: PurchaseTicketsParams; value: bigint }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ params, value }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.tickets.purchaseTickets(params, value)
    },
    onSuccess: (_, { params }) => {
      // Invalidate ticket-related queries
      queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      // Also invalidate event queries since ticket sales affect events
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    ...options,
  })
}

/**
 * Mutation hook to transfer tickets
 */
export function useTransferTickets(
  options?: UseMutationOptions<string, Error, { 
    to: Address; 
    eventId: bigint; 
    tierId: number; 
    amount: number 
  }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ to, eventId, tierId, amount }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.tickets.transferTickets(to, eventId, tierId, amount)
    },
    onSuccess: () => {
      // Invalidate all ticket queries since ownership changed
      queryClient.invalidateQueries({ queryKey: ticketKeys.all })
    },
    ...options,
  })
}

/**
 * Mutation hook to use/check-in a ticket
 */
export function useTicket(
  options?: UseMutationOptions<string, Error, { eventId: bigint; tierId: number }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, tierId }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.tickets.useTicket(eventId, tierId)
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate ticket and event attendance queries
      queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      queryClient.invalidateQueries({ 
        queryKey: ['events'],
        predicate: (query) => 
          query.queryKey.includes('attendance') && query.queryKey.includes(eventId)
      })
    },
    ...options,
  })
}

/**
 * Mutation hook to check in with ticket
 */
export function useCheckInWithTicket(
  options?: UseMutationOptions<string, Error, { eventId: bigint; ticketTokenId: bigint }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, ticketTokenId }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.tickets.checkInWithTicket(eventId, ticketTokenId)
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate attendance-related queries
      queryClient.invalidateQueries({ 
        queryKey: ['events'],
        predicate: (query) => 
          query.queryKey.includes('attendance') && query.queryKey.includes(eventId)
      })
    },
    ...options,
  })
}

/**
 * Mutation hook to claim refund
 */
export function useClaimRefund(
  options?: UseMutationOptions<string, Error, bigint>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: bigint) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.tickets.claimRefund(eventId)
    },
    onSuccess: (_, eventId) => {
      // Invalidate refund queries for this event
      queryClient.invalidateQueries({ 
        queryKey: ticketKeys.refunds(eventId, '' as Address) // Will invalidate all refund queries for this event
      })
    },
    ...options,
  })
} 