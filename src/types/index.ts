import { Address } from 'viem'

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
  
  // ✅ NEW: Enhanced event fields
  latitude: number
  longitude: number
  venueName: string
  venueHash: bigint
  status: EventStatus
  tierCount: number
  basePrice: bigint
}

export enum EventVisibility {
  PUBLIC = 0,
  PRIVATE = 1,
  INVITE_ONLY = 2,
}

// ✅ NEW: Event status enum
export enum EventStatus {
  ACTIVE = 0,
  CANCELLED = 1,
  COMPLETED = 2,
}

export enum RSVPStatus {
  NOT_GOING = 0,
  MAYBE = 1,
  GOING = 2,
}

// ✅ NEW: Token types enum
export enum TokenType {
  NONE = 0,
  EVENT_TICKET = 1,
  ATTENDANCE_BADGE = 2,
  ORGANIZER_CRED = 3,
  VENUE_CRED = 4,
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
 * ✅ NEW: Location & Venue Types
 */
export interface LocationCoordinates {
  latitude: number
  longitude: number
}

export interface LocationData {
  coordinates: LocationCoordinates
  venue: VenueData
}

export interface VenueData {
  hash: bigint
  name: string
  eventCount: number
  coordinates?: LocationCoordinates
}

export interface VenueCredential {
  venueHash: bigint
  venueName: string
  eventCount: number
  firstEventTimestamp: bigint
  tokenId: bigint
}

/**
 * ✅ NEW: ERC20 Payment Types
 */
export interface ERC20PurchaseParams {
  eventId: bigint
  tierId: number
  quantity: number
  token: Address
}

export interface ERC20PurchaseWithFeeParams extends ERC20PurchaseParams {
  referrer: Address
  platformFeeBps: number
}

export interface ERC20TipParams {
  eventId: bigint
  token: Address
  amount: bigint
}

export interface ERC20TipWithFeeParams extends ERC20TipParams {
  referrer: Address
  platformFeeBps: number
}

/**
 * ✅ NEW: Private Event Types
 */
export interface EventInvitation {
  eventId: bigint
  event: Event
  invitedAt: bigint
  status: InvitationStatus
}

export enum InvitationStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DECLINED = 2
}

/**
 * ✅ NEW: Platform Fee Types
 */
export interface PlatformFeeStats {
  totalEarnings: bigint
  totalTransactions: number
  averageFee: bigint
}

export interface ReferrerStats {
  referrer: Address
  totalEarnings: bigint
  totalReferrals: number
  rank: number
}

/**
 * ✅ NEW: Refund Types
 */
export interface RefundRecord {
  eventId: bigint
  refundType: RefundType
  amount: bigint
  claimedAt: bigint
  transactionHash: string
}

/**
 * ✅ NEW: Token Management Types
 */
export interface TokenIdComponents {
  tokenType: TokenType
  eventId: bigint
  tierId: number
  serialNumber: bigint
  metadata: bigint
}

export interface SoulboundToken {
  tokenId: bigint
  tokenType: TokenType
  owner: Address
  mintedAt: bigint
  eventId?: bigint
  venueHash?: bigint
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
  
  // ✅ NEW: Enhanced event creation parameters
  latitude: number
  longitude: number
  venueName: string
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