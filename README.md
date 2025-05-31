# @assemble/sdk

> TypeScript SDK for the Assemble Protocol - decentralized event management with social coordination

## 🚀 Features

- **Complete Protocol Coverage**: Events, tickets, social features, and protocol administration
- **React Integration**: Full React Query hooks for seamless frontend integration
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modern Stack**: Built with viem for optimal performance and developer experience
- **Optimized Caching**: Smart query invalidation with React Query
- **Error Handling**: Comprehensive error types with helpful messages

## 📦 Installation

```bash
npm install @assemble/sdk viem
# or
pnpm add @assemble/sdk viem
# or
yarn add @assemble/sdk viem
```

For React integration, also install React Query:

```bash
npm install @tanstack/react-query react
```

## 🏗️ Quick Start

### Basic Usage (Vanilla JS/TS)

```typescript
import { AssembleClient, EventVisibility } from '@assemble/sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'

// Create viem clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
})

const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(),
  account: '0x...' // Your account
})

// Create Assemble SDK client
const client = AssembleClient.create({
  contractAddress: '0x...',
  publicClient,
  walletClient
})

// Create an event
const eventParams = {
  title: 'My Event',
  description: 'An awesome event',
  imageUri: 'https://example.com/image.jpg',
  startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
  endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
  capacity: 100,
  venueId: 1n,
  visibility: EventVisibility.PUBLIC,
  tiers: [{
    name: 'General Admission',
    price: parseEther('0.1'),
    maxSupply: 100,
    sold: 0,
    startSaleTime: BigInt(Math.floor(Date.now() / 1000)),
    endSaleTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
    transferrable: true
  }],
  paymentSplits: [{
    recipient: '0x...',
    basisPoints: 10000 // 100%
  }]
}

const hash = await client.events.createEvent(eventParams)
```

### React Integration

```tsx
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  AssembleProvider, 
  useEvents, 
  useCreateEvent, 
  usePurchaseTickets 
} from '@assemble/sdk/react'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AssembleProvider client={assembleClient}>
        <EventList />
      </AssembleProvider>
    </QueryClientProvider>
  )
}

function EventList() {
  const { data: events, isLoading } = useEvents()
  const createEvent = useCreateEvent()

  if (isLoading) return <div>Loading events...</div>

  return (
    <div>
      {events?.events.map(event => (
        <div key={event.id.toString()}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  )
}
```

## 📚 Core Managers

### 🎫 Event Manager

```typescript
// Get events with pagination
const events = await client.events.getEvents({ limit: 10, offset: 0 })

// Get specific event
const event = await client.events.getEvent(1n)

// Create event
const hash = await client.events.createEvent(eventParams)

// Cancel event
const cancelHash = await client.events.cancelEvent(1n)

// RSVP management
await client.events.updateRSVP(1n, RSVPStatus.GOING)
const rsvpStatus = await client.events.getUserRSVP(1n, userAddress)
```

### 🎟️ Ticket Manager

```typescript
// Calculate ticket price
const price = await client.tickets.calculatePrice(1n, 0, 2) // eventId, tierId, quantity

// Purchase tickets
const purchaseHash = await client.tickets.purchaseTickets({
  eventId: 1n,
  tierId: 0,
  quantity: 2
}, price)

// Get user tickets
const tickets = await client.tickets.getTickets(userAddress)

// Transfer tickets
const transferHash = await client.tickets.transferTickets(
  recipientAddress, 
  1n, // eventId
  0,  // tierId
  1   // amount
)

// Check-in and use tickets
const tokenId = await client.tickets.generateTokenId(1n, 0)
await client.tickets.checkInWithTicket(1n, tokenId)
await client.tickets.useTicket(1n, 0)
```

### 👥 Social Manager

```typescript
// Friend management
await client.social.addFriend(friendAddress)
const friends = await client.social.getFriends(userAddress)
const isFriend = await client.social.isFriend(user1, user2)

// Comments
const commentHash = await client.social.postComment(1n, "Great event!")
const comments = await client.social.getEventComments(1n)
await client.social.likeComment(commentId)

// Tips
const tipHash = await client.social.tipEvent(1n, parseEther('0.1'))
const pendingWithdrawals = await client.social.getPendingWithdrawals(userAddress)
```

### 🏛️ Protocol Manager

```typescript
// Read protocol settings
const protocolFee = await client.protocol.getProtocolFee()
const feeTo = await client.protocol.getFeeTo()

// Admin functions
await client.protocol.setProtocolFee(100) // 1%
await client.protocol.setFeeTo(newAddress)
```

## 🎣 React Hooks

### Event Hooks

```tsx
import { 
  useEvent, 
  useEvents, 
  useCreateEvent, 
  useUpdateRSVP 
} from '@assemble/sdk/react'

function EventComponent() {
  const { data: event } = useEvent(1n)
  const { data: events } = useEvents({ limit: 10 })
  const createEvent = useCreateEvent()
  const updateRSVP = useUpdateRSVP()

  return (
    <div>
      <button onClick={() => updateRSVP.mutate({ 
        eventId: 1n, 
        status: RSVPStatus.GOING 
      })}>
        RSVP Going
      </button>
    </div>
  )
}
```

### Ticket Hooks

```tsx
import { 
  useTickets, 
  usePurchaseTickets, 
  useTicketPrice 
} from '@assemble/sdk/react'

function TicketComponent() {
  const { data: tickets } = useTickets(userAddress)
  const { data: price } = useTicketPrice(1n, 0, 2)
  const purchaseTickets = usePurchaseTickets()

  const handlePurchase = () => {
    if (price) {
      purchaseTickets.mutate({
        params: { eventId: 1n, tierId: 0, quantity: 2 },
        value: price
      })
    }
  }

  return (
    <div>
      <button onClick={handlePurchase}>
        Buy 2 tickets for {price ? formatEther(price) : '...'} ETH
      </button>
    </div>
  )
}
```

### Social Hooks

```tsx
import { 
  useFriends, 
  useAddFriend, 
  useEventComments, 
  usePostComment 
} from '@assemble/sdk/react'

function SocialComponent() {
  const { data: friends } = useFriends(userAddress)
  const { data: comments } = useEventComments(1n)
  const addFriend = useAddFriend()
  const postComment = usePostComment()

  return (
    <div>
      <button onClick={() => addFriend.mutate(friendAddress)}>
        Add Friend
      </button>
      <button onClick={() => postComment.mutate({
        eventId: 1n,
        content: "Great event!"
      })}>
        Post Comment
      </button>
    </div>
  )
}
```

## 🔧 Configuration

### Supported Chains

```typescript
import { sepolia, mainnet, base, baseSepolia } from '@assemble/sdk'

// Pre-configured chain information
const sepoliaConfig = sepolia // Chain ID 11155111
const mainnetConfig = mainnet // Chain ID 1
```

### Error Handling

```typescript
import { 
  ContractError, 
  WalletError, 
  ValidationError,
  isContractError 
} from '@assemble/sdk'

try {
  await client.events.createEvent(params)
} catch (error) {
  if (isContractError(error)) {
    console.error('Contract error:', error.message)
  } else if (error instanceof WalletError) {
    console.error('Wallet error:', error.message)
  }
}
```

## 🧪 Testing

The SDK includes comprehensive tests for both unit and integration testing:

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test test/unit/

# Run with coverage
pnpm test:coverage

# Run integration tests (requires local anvil)
pnpm test:anvil
```

## 📝 Type Definitions

The SDK provides full TypeScript support with comprehensive type definitions:

```typescript
import type {
  Event,
  TicketTier,
  Ticket,
  CreateEventParams,
  PurchaseTicketsParams,
  EventVisibility,
  RSVPStatus
} from '@assemble/sdk'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Assemble Protocol](https://github.com/taayyohh/assemble)
- [Documentation](https://docs.assembleprotocol.com)
- [Discord](https://discord.gg/assemble) 