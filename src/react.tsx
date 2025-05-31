/**
 * Assemble Protocol SDK - React Integration
 * 
 * React hooks and components for easy integration with React applications.
 */

export { AssembleProvider, useAssemble } from './react/provider'
export { useEvent, useEvents, useCreateEvent } from './react/hooks/events'
export { useTickets, usePurchaseTickets } from './react/hooks/tickets'
export { useFriends, useAddFriend } from './react/hooks/social'

// Re-export core types for convenience
export type * from './types' 