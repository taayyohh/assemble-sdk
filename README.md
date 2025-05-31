# Assemble Protocol SDK

TypeScript SDK for interacting with the [Assemble Protocol](https://github.com/taayyohh/assemble) - a decentralized event management platform with social coordination features.

## Features

- **Type-safe** contract interactions with full TypeScript support
- **Event Management** - Create, manage, and cancel events with multi-tier ticketing
- **Ticket Operations** - Purchase, transfer, and refund tickets with platform fees
- **Social Features** - Friends, comments, likes, and tips
- **Private Events** - Invite-only events with access control
- **Platform Fees** - 0-5% referral fees for ecosystem growth
- **Built with [viem](https://viem.sh)** for optimal performance and developer experience

## Installation

```bash
pnpm add @assemble/sdk viem
```

## Quick Start

```typescript
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { AssembleClient } from '@assemble/sdk'

// Create clients
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

const walletClient = createWalletClient({
  chain: mainnet,
  transport: http()
})

// Initialize Assemble SDK
const assemble = AssembleClient.create({
  contractAddress: '0x0000000000000000000000000000000000000000', // Replace with actual address
  publicClient,
  walletClient
})
```

## Usage Examples

### Creating an Event

```typescript
import { EventVisibility } from '@assemble/sdk'

const eventParams = {
  title: "Web3 Conference 2024",
  description: "Annual blockchain and web3 technology conference",
  imageUri: "ipfs://QmYourImageHash",
  startTime: BigInt(Math.floor(Date.now() / 1000) + 86400), // Tomorrow
  endTime: BigInt(Math.floor(Date.now() / 1000) + 172800),   // Day after
  capacity: 500,
  venueId: 1n,
  visibility: EventVisibility.PUBLIC,
  tiers: [
    {
      name: "General Admission",
      price: BigInt(1e18), // 1 ETH
      maxSupply: 400,
      sold: 0,
      startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
      endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 86400),
      transferrable: true
    },
    {
      name: "VIP Access",
      price: BigInt(2e18), // 2 ETH
      maxSupply: 100,
      sold: 0,
      startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
      endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 86400),
      transferrable: true
    }
  ],
  paymentSplits: [
    {
      recipient: '0x1234...', // Organizer address
      basisPoints: 8000      // 80%
    },
    {
      recipient: '0x5678...', // Venue address
      basisPoints: 2000      // 20%
    }
  ]
}

const txHash = await assemble.events.createEvent(eventParams)
console.log('Event created:', txHash)
```

### Purchasing Tickets

```typescript
// Basic ticket purchase
const purchaseHash = await assemble.tickets.purchaseTickets({
  eventId: 1n,
  tierId: 0,    // General Admission
  quantity: 2
}, BigInt(2e18)) // 2 ETH total

// Purchase with platform fee (venue gets 2%)
const purchaseWithFeeHash = await assemble.tickets.purchaseTickets({
  eventId: 1n,
  tierId: 0,
  quantity: 1,
  referrer: '0xVenueAddress...',
  platformFeeBps: 200 // 2%
}, BigInt(1e18))
```

### Social Features

```typescript
// Add a friend
await assemble.social.addFriend('0xFriendAddress...')

// Post a comment on an event
await assemble.social.postComment(1n, "Can't wait for this event!")

// Tip the event organizer (with platform fee)
await assemble.social.tipEvent(
  1n,                    // eventId
  BigInt(1e17),         // 0.1 ETH tip
  '0xPlatformAddress...', // referrer
  150                    // 1.5% platform fee
)
```

### Private Events

```typescript
// Create invite-only event
const privateEventParams = {
  ...eventParams,
  visibility: EventVisibility.PRIVATE
}

const eventId = await assemble.events.createEvent(privateEventParams)

// Invite specific users (only organizer can do this)
await assemble.events.inviteToEvent(eventId, [
  '0xAlice...',
  '0xBob...',
  '0xCharlie...'
])

// Invited users can now purchase tickets
// Non-invited users will get reverted transactions
```

## Contract Addresses

| Network | Address |
|---------|---------|
| Mainnet | `0x0000000000000000000000000000000000000000` |
| Sepolia | `0x0000000000000000000000000000000000000000` |
| Base    | `0x0000000000000000000000000000000000000000` |
| Base Sepolia | `0x0000000000000000000000000000000000000000` |

> **Note**: Replace with actual deployed contract addresses

## API Reference

### AssembleClient

Main client class for interacting with the Assemble Protocol.

```typescript
class AssembleClient {
  static create(options: CreateClientOptions): AssembleClient
  
  readonly events: EventManager
  readonly tickets: TicketManager  
  readonly social: SocialManager
  
  get account(): Address | undefined
  get isConnected(): boolean
  
  getChainId(): Promise<number>
  switchChain(chainId: number): Promise<void>
  setWalletClient(walletClient: WalletClient): void
  disconnect(): void
}
```

### EventManager

Manage events and their lifecycle.

```typescript
class EventManager {
  createEvent(params: CreateEventParams): Promise<Hash>
  getEvent(eventId: bigint): Promise<Event | null>
  getEvents(options?: GetEventsOptions): Promise<EventsResponse>
  cancelEvent(eventId: bigint): Promise<Hash>
  getEventsByOrganizer(organizer: Address): Promise<Event[]>
  isEventOrganizer(eventId: bigint, address: Address): Promise<boolean>
}
```

### TicketManager

Handle ticket purchases, transfers, and refunds.

```typescript
class TicketManager {
  purchaseTickets(params: PurchaseTicketsParams, value: bigint): Promise<Hash>
  calculatePrice(eventId: bigint, tierId: number, quantity: number): Promise<bigint>
  getTickets(owner: Address): Promise<TicketsResponse>
  getTicketBalance(owner: Address, eventId: bigint, tierId: number): Promise<number>
  transferTickets(to: Address, eventId: bigint, tierId: number, amount: number): Promise<Hash>
  useTicket(eventId: bigint, tierId: number): Promise<Hash>
  getRefundAmounts(eventId: bigint, user: Address): Promise<{ ticketRefund: bigint; tipRefund: bigint }>
  claimRefund(eventId: bigint): Promise<Hash>
}
```

### SocialManager

Social features including friends, comments, and tips.

```typescript
class SocialManager {
  addFriend(friendAddress: Address): Promise<Hash>
  removeFriend(friendAddress: Address): Promise<Hash>
  getFriends(userAddress: Address): Promise<Address[]>
  isFriend(user1: Address, user2: Address): Promise<boolean>
  
  postComment(eventId: bigint, content: string, parentId?: bigint): Promise<Hash>
  likeComment(commentId: bigint): Promise<Hash>
  unlikeComment(commentId: bigint): Promise<Hash>
  getComments(eventId: bigint): Promise<Comment[]>
  
  tipEvent(eventId: bigint, amount: bigint, referrer?: Address, platformFeeBps?: number): Promise<Hash>
}
```

## Error Handling

The SDK provides comprehensive error types:

```typescript
import { 
  AssembleError, 
  ContractError, 
  ValidationError, 
  NetworkError, 
  WalletError,
  isContractError 
} from '@assemble/sdk'

try {
  await assemble.tickets.purchaseTickets(params, value)
} catch (error) {
  if (isContractError(error)) {
    console.log('Contract error:', error.contractError)
  } else if (error instanceof ValidationError) {
    console.log('Validation error:', error.field)
  }
}
```

## Platform Fees & Ecosystem Growth

Platform fees (0-5%) enable sustainable ecosystem development:

```typescript
// Music venue gets 2% commission
await assemble.tickets.purchaseTickets({
  eventId: 1n,
  tierId: 0,
  quantity: 1,
  referrer: venueAddress,
  platformFeeBps: 200 // 2%
}, ticketPrice)

// Event discovery platform gets 1.5% for promotion
await assemble.social.tipEvent(
  eventId,
  tipAmount,
  platformAddress,
  150 // 1.5%
)
```

**Benefits:**
- Incentivizes venues to host events
- Rewards platforms for event discovery
- Supports influencer partnerships
- Transparent on-chain fee tracking
- Self-referral prevention ensures legitimacy

## Development

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm build

# Run tests
pnpm test

# Type check
pnpm type-check
```

## License

MIT

## About

Built for the [Assemble Protocol](https://github.com/taayyohh/assemble) - a foundational singleton smart contract protocol for onchain social coordination and event management. 