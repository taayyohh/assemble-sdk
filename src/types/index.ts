import { Address, Hash } from 'viem'

/**
 * Core Event Types
 */
export interface Event {
  id: bigint
  title: string
  description: string
  imageUri: string
  startTime: bigint
  endTime: bigint
  capacity: number
  venueId: bigint
  visibility: EventVisibility
  organizer: Address
  isCancelled: boolean
}

export enum EventVisibility {
  PUBLIC = 0,
  PRIVATE = 1,
  INVITE_ONLY = 2,
}

export enum RSVPStatus {
  NOT_GOING = 0,
  MAYBE = 1,
  GOING = 2,
}

export enum RefundType {
  TICKET = 0,
  TIP = 1,
}

/**
 * Ticket Types
 */
export interface TicketTier {
  name: string
  price: bigint
  maxSupply: number
  sold: number
  startSaleTime: bigint
  endSaleTime: bigint
  transferrable: boolean
}

export interface Ticket {
  eventId: bigint
  tierId: number
  tokenId: bigint
  owner: Address
  isUsed: boolean
}

/**
 * Payment Types
 */
export interface PaymentSplit {
  recipient: Address
  basisPoints: number
}

export interface RefundAmounts {
  ticketRefund: bigint
  tipRefund: bigint
}

/**
 * Social Types
 */
export interface Friend {
  user: Address
  addedAt: bigint
}

export interface Comment {
  id: bigint
  eventId: bigint
  author: Address
  content: string
  parentId: bigint
  timestamp: bigint
  likes: number
  isDeleted: boolean
}

export interface CommentWithReplies extends Comment {
  replies: Comment[]
}

export interface AttendanceProof {
  eventId: bigint
  attendee: Address
  timestamp: bigint
  tokenId: bigint
}

/**
 * Transaction Types
 */
export interface CreateEventParams {
  title: string
  description: string
  imageUri: string
  startTime: bigint
  endTime: bigint
  capacity: number
  venueId: bigint
  visibility: EventVisibility
  tiers: TicketTier[]
  paymentSplits: PaymentSplit[]
}

export interface PurchaseTicketsParams {
  eventId: bigint
  tierId: number
  quantity: number
  referrer?: Address
  platformFeeBps?: number
}

export interface InviteParams {
  eventId: bigint
  invitees: Address[]
}

export interface CheckInParams {
  eventId: bigint
  ticketTokenId?: bigint
  attendee?: Address
}

/**
 * Client Configuration Types
 */
export interface AssembleClientConfig {
  contractAddress: Address
  publicClient: any // viem PublicClient
  walletClient?: any // viem WalletClient
}

/**
 * Response Types
 */
export interface EventsResponse {
  events: Event[]
  total: number
  hasMore: boolean
}

export interface TicketsResponse {
  tickets: Ticket[]
  total: number
}

export interface CommentsResponse {
  comments: CommentWithReplies[]
  total: number
} 