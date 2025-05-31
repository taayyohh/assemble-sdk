/**
 * Assemble Protocol SDK - React Integration
 * 
 * React hooks and components for easy integration with React applications.
 */

// Provider and context
export { AssembleProvider, useAssemble } from './react/provider'

// Event hooks
export { 
  useEvent, 
  useEvents, 
  useEventsByOrganizer,
  useEventRSVP,
  useEventAttendance,
  useCreateEvent,
  useUpdateRSVP,
  useCancelEvent,
  useInviteToEvent,
  eventKeys 
} from './react/hooks/events'

// Ticket hooks
export { 
  useTickets, 
  useTicketBalance,
  useTicketPrice,
  useRefundAmounts,
  useTotalSupply,
  usePurchaseTickets,
  useTransferTickets,
  useTicket,
  useCheckInWithTicket,
  useClaimRefund,
  ticketKeys 
} from './react/hooks/tickets'

// Social hooks
export { 
  useFriends, 
  useFriendship,
  useEventComments,
  useComment,
  useCommentLike,
  usePendingWithdrawals,
  usePaymentSplits,
  useAddFriend,
  useRemoveFriend,
  usePostComment,
  useLikeComment,
  useUnlikeComment,
  useTipEvent,
  useDeleteComment,
  socialKeys 
} from './react/hooks/social'

// Re-export core types for convenience
export type * from './types' 