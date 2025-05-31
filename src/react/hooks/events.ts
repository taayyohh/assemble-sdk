import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAssemble } from '../provider'
import type { 
  Event, 
  EventsResponse, 
  CreateEventParams, 
  RSVPStatus 
} from '../../types'

/**
 * Query Keys for Events
 */
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: any) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: bigint) => [...eventKeys.details(), id] as const,
  organizer: (address: Address) => [...eventKeys.all, 'organizer', address] as const,
  rsvp: (eventId: bigint, user: Address) => [...eventKeys.all, 'rsvp', eventId, user] as const,
  attendance: (eventId: bigint, user: Address) => [...eventKeys.all, 'attendance', eventId, user] as const,
}

/**
 * Hook to get a single event by ID
 */
export function useEvent(
  eventId: bigint,
  options?: UseQueryOptions<Event | null, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => client.events.getEvent(eventId),
    enabled: !!eventId,
    ...options,
  })
}

/**
 * Hook to get multiple events with pagination
 */
export function useEvents(
  params: { limit?: number; offset?: number } = {},
  options?: UseQueryOptions<EventsResponse, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => client.events.getEvents(params),
    ...options,
  })
}

/**
 * Hook to get events by organizer
 */
export function useEventsByOrganizer(
  organizerAddress: Address,
  options?: UseQueryOptions<Event[], Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: eventKeys.organizer(organizerAddress),
    queryFn: () => client.events.getEventsByOrganizer(organizerAddress),
    enabled: !!organizerAddress,
    ...options,
  })
}

/**
 * Hook to get user's RSVP status for an event
 */
export function useEventRSVP(
  eventId: bigint,
  userAddress: Address,
  options?: UseQueryOptions<RSVPStatus, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: eventKeys.rsvp(eventId, userAddress),
    queryFn: () => client.events.getUserRSVP(eventId, userAddress),
    enabled: !!eventId && !!userAddress,
    ...options,
  })
}

/**
 * Hook to check if user attended an event
 */
export function useEventAttendance(
  eventId: bigint,
  userAddress: Address,
  options?: UseQueryOptions<boolean, Error>
) {
  const { client } = useAssemble()

  return useQuery({
    queryKey: eventKeys.attendance(eventId, userAddress),
    queryFn: () => client.events.hasAttended(eventId, userAddress),
    enabled: !!eventId && !!userAddress,
    ...options,
  })
}

/**
 * Mutation hook to create an event
 */
export function useCreateEvent(
  options?: UseMutationOptions<string, Error, CreateEventParams>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateEventParams) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.events.createEvent(params)
    },
    onSuccess: () => {
      // Invalidate events queries to refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    },
    ...options,
  })
}

/**
 * Mutation hook to update RSVP status
 */
export function useUpdateRSVP(
  options?: UseMutationOptions<string, Error, { eventId: bigint; status: RSVPStatus }>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, status }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.events.updateRSVP(eventId, status)
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate RSVP queries for this event
      queryClient.invalidateQueries({ 
        queryKey: eventKeys.all,
        predicate: (query) => 
          query.queryKey.includes('rsvp') && query.queryKey.includes(eventId)
      })
    },
    ...options,
  })
}

/**
 * Mutation hook to cancel an event
 */
export function useCancelEvent(
  options?: UseMutationOptions<string, Error, bigint>
) {
  const { client, isConnected } = useAssemble()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: bigint) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.events.cancelEvent(eventId)
    },
    onSuccess: (_, eventId) => {
      // Invalidate specific event and list queries
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    },
    ...options,
  })
}

/**
 * Mutation hook to invite users to an event
 */
export function useInviteToEvent(
  options?: UseMutationOptions<string, Error, { eventId: bigint; invitees: Address[] }>
) {
  const { client, isConnected } = useAssemble()

  return useMutation({
    mutationFn: ({ eventId, invitees }) => {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }
      return client.events.inviteToEvent(eventId, invitees)
    },
    ...options,
  })
} 