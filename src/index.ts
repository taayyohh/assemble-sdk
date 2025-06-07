/**
 * Assemble Protocol SDK
 * 
 * Clean, type-safe contract interactions for the Assemble Protocol.
 * Built with viem for optimal performance and developer experience.
 */

// Core client and types
export { AssembleClient } from './core/client'
export type { AssembleClientConfig, CreateClientOptions } from './core/client'

// Contract interactions
export { EventManager } from './core/events'
export { TicketManager } from './core/tickets'
export { SocialManager } from './core/social'
export { ProtocolManager } from './core/protocol'
export { ERC20Manager } from './core/erc20'
export { VenueManager } from './core/venue'
export { PrivateEventManager } from './core/private-events'
export { PlatformFeeManager } from './core/platform-fees'
export { RefundManager } from './core/refunds'
export { TokenManager } from './core/tokens'

// Export enums as values
export { EventVisibility, RSVPStatus, RefundType, EventStatus, TokenType, InvitationStatus } from './types'

// Export interfaces and other types as type-only
export type {
  Event,
  TicketTier,
  Ticket,
  PaymentSplit,
  RefundAmounts,
  Friend,
  Comment,
  CommentWithReplies,
  AttendanceProof,
  CreateEventParams,
  PurchaseTicketsParams,
  InviteParams,
  CheckInParams,
  AssembleClientConfig as ClientConfig,
  EventsResponse,
  TicketsResponse,
  CommentsResponse,
  LocationCoordinates,
  LocationData,
  VenueData,
  VenueCredential,
  ERC20PurchaseParams,
  ERC20PurchaseWithFeeParams,
  ERC20TipParams,
  ERC20TipWithFeeParams,
  EventInvitation,
  PlatformFeeStats,
  ReferrerStats,
  RefundRecord,
  TokenIdComponents,
  SoulboundToken
} from './types'

// Constants (including ABI)
export * from './constants/chains'

// Utilities
export * from './utils'

// Error types
export * from './errors' 