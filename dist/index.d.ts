import * as viem from 'viem';
import { Address, Hash, PublicClient, WalletClient, Abi, Chain } from 'viem';
import * as abitype from 'abitype';
import * as viem_chains from 'viem/chains';

/**
 * Core Event Types
 */
interface Event {
    id: bigint;
    title: string;
    description: string;
    imageUri: string;
    startTime: bigint;
    endTime: bigint;
    capacity: number;
    venueId: bigint;
    visibility: EventVisibility;
    organizer: Address;
    isCancelled: boolean;
}
declare enum EventVisibility {
    PUBLIC = 0,
    PRIVATE = 1,
    INVITE_ONLY = 2
}
declare enum RSVPStatus {
    NOT_GOING = 0,
    MAYBE = 1,
    GOING = 2
}
declare enum RefundType {
    TICKET = 0,
    TIP = 1
}
/**
 * Ticket Types
 */
interface TicketTier {
    name: string;
    price: bigint;
    maxSupply: number;
    sold: number;
    startSaleTime: bigint;
    endSaleTime: bigint;
    transferrable: boolean;
}
interface Ticket {
    eventId: bigint;
    tierId: number;
    tokenId: bigint;
    owner: Address;
    isUsed: boolean;
}
/**
 * Payment Types
 */
interface PaymentSplit {
    recipient: Address;
    basisPoints: number;
}
interface RefundAmounts {
    ticketRefund: bigint;
    tipRefund: bigint;
}
/**
 * Social Types
 */
interface Friend {
    user: Address;
    addedAt: bigint;
}
interface Comment {
    id: bigint;
    eventId: bigint;
    author: Address;
    content: string;
    parentId: bigint;
    timestamp: bigint;
    likes: number;
    isDeleted: boolean;
}
interface CommentWithReplies extends Comment {
    replies: Comment[];
}
interface AttendanceProof {
    eventId: bigint;
    attendee: Address;
    timestamp: bigint;
    tokenId: bigint;
}
/**
 * Transaction Types
 */
interface CreateEventParams {
    title: string;
    description: string;
    imageUri: string;
    startTime: bigint;
    endTime: bigint;
    capacity: number;
    venueId: bigint;
    visibility: EventVisibility;
    tiers: TicketTier[];
    paymentSplits: PaymentSplit[];
}
interface PurchaseTicketsParams {
    eventId: bigint;
    tierId: number;
    quantity: number;
    referrer?: Address;
    platformFeeBps?: number;
}
interface InviteParams {
    eventId: bigint;
    invitees: Address[];
}
interface CheckInParams {
    eventId: bigint;
    ticketTokenId?: bigint;
    attendee?: Address;
}
/**
 * Client Configuration Types
 */
interface AssembleClientConfig {
    contractAddress: Address;
    publicClient: any;
    walletClient?: any;
}
/**
 * Response Types
 */
interface EventsResponse {
    events: Event[];
    total: number;
    hasMore: boolean;
}
interface TicketsResponse {
    tickets: Ticket[];
    total: number;
}
interface CommentsResponse {
    comments: CommentWithReplies[];
    total: number;
}

/**
 * Manager for event-related operations
 */
declare class EventManager {
    private config;
    constructor(config: AssembleClientConfig);
    /**
     * Create a new event
     */
    createEvent(params: CreateEventParams): Promise<Hash>;
    /**
     * Get event by ID
     */
    getEvent(eventId: bigint): Promise<Event | null>;
    /**
     * Get multiple events with pagination
     */
    getEvents(options?: {
        offset?: number;
        limit?: number;
        organizer?: Address;
    }): Promise<EventsResponse>;
    /**
     * Cancel an event
     */
    cancelEvent(eventId: bigint): Promise<Hash>;
    /**
     * Get events organized by a specific address
     */
    getEventsByOrganizer(organizer: Address): Promise<Event[]>;
    /**
     * Check if an address is the organizer of an event
     */
    isEventOrganizer(eventId: bigint, address: Address): Promise<boolean>;
    /**
     * Invite users to a private event
     */
    inviteToEvent(eventId: bigint, invitees: Address[]): Promise<Hash>;
    /**
     * Remove invitation from a user
     */
    removeInvitation(eventId: bigint, invitee: Address): Promise<Hash>;
    /**
     * Check if a user is invited to an event
     */
    isInvited(eventId: bigint, user: Address): Promise<boolean>;
    /**
     * Update RSVP status for an event
     */
    updateRSVP(eventId: bigint, status: RSVPStatus): Promise<Hash>;
    /**
     * Get user's RSVP status for an event
     */
    getUserRSVP(eventId: bigint, user: Address): Promise<RSVPStatus>;
    /**
     * Check if a user has attended an event
     */
    hasAttended(eventId: bigint, user: Address): Promise<boolean>;
    /**
     * Check if an event is cancelled
     */
    isEventCancelled(eventId: bigint): Promise<boolean>;
}

/**
 * Manager for ticket-related operations
 */
declare class TicketManager {
    private config;
    constructor(config: AssembleClientConfig);
    /**
     * Purchase tickets for an event
     */
    purchaseTickets(params: PurchaseTicketsParams, value: bigint): Promise<Hash>;
    /**
     * Get ticket price for specific quantity
     */
    calculatePrice(eventId: bigint, tierId: number, quantity: number): Promise<bigint>;
    /**
     * Get tickets owned by an address
     */
    getTickets(owner: Address): Promise<TicketsResponse>;
    /**
     * Get ticket balance for a specific event and tier
     */
    getTicketBalance(owner: Address, eventId: bigint, tierId: number): Promise<number>;
    /**
     * Transfer tickets to another address
     */
    transferTickets(to: Address, eventId: bigint, tierId: number, amount: number): Promise<Hash>;
    /**
     * Use/check-in a ticket
     */
    useTicket(eventId: bigint, tierId: number): Promise<Hash>;
    /**
     * Basic check-in to an event
     */
    checkIn(eventId: bigint): Promise<Hash>;
    /**
     * Check-in with a specific ticket token
     */
    checkInWithTicket(eventId: bigint, ticketTokenId: bigint): Promise<Hash>;
    /**
     * Delegate check-in for another attendee
     */
    checkInDelegate(eventId: bigint, ticketTokenId: bigint, attendee: Address): Promise<Hash>;
    /**
     * Validate if a ticket is valid for an event
     */
    isValidTicketForEvent(tokenId: bigint, eventId: bigint): Promise<boolean>;
    /**
     * Get refund amounts for a cancelled event
     */
    getRefundAmounts(eventId: bigint, user: Address): Promise<RefundAmounts>;
    /**
     * Claim refund for cancelled event
     */
    claimRefund(eventId: bigint): Promise<Hash>;
    /**
     * Claim tip refund for cancelled event
     */
    claimTipRefund(eventId: bigint): Promise<Hash>;
    /**
     * Get total supply of a token
     */
    totalSupply(tokenId: bigint): Promise<bigint>;
    /**
     * Generate token ID for ERC6909 tokens
     * This should match the contract's token ID generation logic
     */
    generateTokenId(eventId: bigint, tierId: number, serialNumber?: bigint): Promise<bigint>;
}

/**
 * Manager for social features (friends, comments, etc.)
 */
declare class SocialManager {
    private config;
    constructor(config: AssembleClientConfig);
    /**
     * Add a friend
     */
    addFriend(friendAddress: Address): Promise<Hash>;
    /**
     * Remove a friend
     */
    removeFriend(friendAddress: Address): Promise<Hash>;
    /**
     * Get friends list for an address
     */
    getFriends(userAddress: Address): Promise<Address[]>;
    /**
     * Check if two addresses are friends
     */
    isFriend(user1: Address, user2: Address): Promise<boolean>;
    /**
     * Post a comment on an event
     */
    postComment(eventId: bigint, content: string, parentId?: bigint): Promise<Hash>;
    /**
     * Delete a comment (moderator only)
     */
    deleteComment(commentId: bigint, eventId: bigint): Promise<Hash>;
    /**
     * Like a comment
     */
    likeComment(commentId: bigint): Promise<Hash>;
    /**
     * Unlike a comment
     */
    unlikeComment(commentId: bigint): Promise<Hash>;
    /**
     * Get comments for an event
     */
    getComments(eventId: bigint): Promise<Comment[]>;
    /**
     * Get all comments for an event (enhanced version)
     */
    getEventComments(eventId: bigint): Promise<CommentsResponse>;
    /**
     * Get a specific comment by ID
     */
    getComment(commentId: bigint): Promise<Comment | null>;
    /**
     * Check if a user has liked a comment
     */
    hasLikedComment(commentId: bigint, userAddress: Address): Promise<boolean>;
    /**
     * Ban a user from an event
     */
    banUser(user: Address, eventId: bigint): Promise<Hash>;
    /**
     * Unban a user from an event
     */
    unbanUser(user: Address, eventId: bigint): Promise<Hash>;
    /**
     * Get payment splits for an event
     */
    getPaymentSplits(eventId: bigint): Promise<PaymentSplit[]>;
    /**
     * Get pending withdrawals for a user
     */
    getPendingWithdrawals(user: Address): Promise<bigint>;
    /**
     * Tip an event organizer
     */
    tipEvent(eventId: bigint, amount: bigint, referrer?: Address, platformFeeBps?: number): Promise<Hash>;
}

/**
 * Manager for protocol-level admin operations
 */
declare class ProtocolManager {
    private config;
    constructor(config: AssembleClientConfig);
    /**
     * Claim accumulated protocol funds
     */
    claimFunds(): Promise<Hash>;
    /**
     * Claim organizer credential for an event
     */
    claimOrganizerCredential(eventId: bigint): Promise<Hash>;
    /**
     * Set protocol fee (admin only)
     */
    setProtocolFee(newFeeBps: number): Promise<Hash>;
    /**
     * Set fee recipient address (admin only)
     */
    setFeeTo(newFeeTo: Address): Promise<Hash>;
    /**
     * Get maximum payment splits allowed
     */
    getMaxPaymentSplits(): Promise<number>;
    /**
     * Get maximum platform fee
     */
    getMaxPlatformFee(): Promise<number>;
    /**
     * Get maximum protocol fee
     */
    getMaxProtocolFee(): Promise<number>;
    /**
     * Get maximum ticket quantity per purchase
     */
    getMaxTicketQuantity(): Promise<number>;
    /**
     * Get refund claim deadline
     */
    getRefundClaimDeadline(): Promise<bigint>;
}

interface CreateClientOptions {
    contractAddress: Address;
    publicClient: PublicClient;
    walletClient?: WalletClient;
}

/**
 * Main client for interacting with the Assemble Protocol
 */
declare class AssembleClient {
    readonly config: AssembleClientConfig;
    readonly events: EventManager;
    readonly tickets: TicketManager;
    readonly social: SocialManager;
    readonly protocol: ProtocolManager;
    constructor(config: AssembleClientConfig);
    /**
     * Create a new Assemble client
     */
    static create(options: CreateClientOptions): AssembleClient;
    /**
     * Get the current account address
     */
    get account(): Address | undefined;
    /**
     * Check if the client has a wallet connected
     */
    get isConnected(): boolean;
    /**
     * Get the current chain ID
     */
    getChainId(): Promise<number>;
    /**
     * Switch to a specific chain
     */
    switchChain(chainId: number): Promise<void>;
    /**
     * Set a new wallet client
     */
    setWalletClient(walletClient: WalletClient): void;
    /**
     * Remove the wallet client (disconnect)
     */
    disconnect(): void;
}

/**
 * Assemble Protocol Contract ABI
 *
 * Generated from the Assemble.sol contract
 */
declare const ASSEMBLE_ABI: Abi;

declare const ASSEMBLE_CONTRACT_ADDRESS: "0x0000000000000000000000000000000000000000";
declare const SUPPORTED_CHAINS: {
    readonly mainnet: {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://etherscan.io";
                readonly apiUrl: "https://api.etherscan.io/api";
            };
        };
        contracts: {
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xce01f8eee7E479C928F8919abD53E553a36CeF67";
                readonly blockCreated: 19258213;
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 14353601;
            };
        };
        ensTlds?: readonly string[] | undefined;
        id: 1;
        name: "Ethereum";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://eth.merkle.io"];
            };
        };
        sourceId?: number | undefined | undefined;
        testnet?: boolean | undefined | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly sepolia: {
        blockExplorers: {
            readonly default: {
                readonly name: "Etherscan";
                readonly url: "https://sepolia.etherscan.io";
                readonly apiUrl: "https://api-sepolia.etherscan.io/api";
            };
        };
        contracts: {
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 751532;
            };
            readonly ensRegistry: {
                readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
            };
            readonly ensUniversalResolver: {
                readonly address: "0xc8Af999e38273D658BE1b921b88A9Ddf005769cC";
                readonly blockCreated: 5317080;
            };
        };
        ensTlds?: readonly string[] | undefined;
        id: 11155111;
        name: "Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.drpc.org"];
            };
        };
        sourceId?: number | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters?: undefined;
        serializers?: viem.ChainSerializers<undefined, viem.TransactionSerializable> | undefined;
    };
    readonly base: {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://basescan.org";
                readonly apiUrl: "https://api.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 1: {
                    readonly address: "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e";
                };
            };
            readonly l2OutputOracle: {
                readonly 1: {
                    readonly address: "0x56315b90c40730925ec5485cf004d835058518A0";
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 5022;
            };
            readonly portal: {
                readonly 1: {
                    readonly address: "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";
                    readonly blockCreated: 17482143;
                };
            };
            readonly l1StandardBridge: {
                readonly 1: {
                    readonly address: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35";
                    readonly blockCreated: 17482143;
                };
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        ensTlds?: readonly string[] | undefined;
        id: 8453;
        name: "Base";
        nativeCurrency: {
            readonly name: "Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://mainnet.base.org"];
            };
        };
        sourceId: 1;
        testnet?: boolean | undefined | undefined;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: abitype.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: `0x${string}` | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined | undefined;
                    withdrawalsRoot?: `0x${string}` | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: abitype.Address | null;
                    from: abitype.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined | undefined;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes?: undefined | undefined;
                    chainId?: number | undefined;
                    yParity?: undefined | undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas?: undefined | undefined;
                    maxPriorityFeePerGas?: undefined | undefined;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes?: undefined | undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas?: undefined | undefined;
                    maxPriorityFeePerGas?: undefined | undefined;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes?: undefined | undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem.SignedAuthorizationList;
                    blobVersionedHashes?: undefined | undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: abitype.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: abitype.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: `0x${string}` | undefined;
                    status: "success" | "reverted";
                    to: abitype.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
    };
    readonly baseSepolia: {
        blockExplorers: {
            readonly default: {
                readonly name: "Basescan";
                readonly url: "https://sepolia.basescan.org";
                readonly apiUrl: "https://api-sepolia.basescan.org/api";
            };
        };
        contracts: {
            readonly disputeGameFactory: {
                readonly 11155111: {
                    readonly address: "0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1";
                };
            };
            readonly l2OutputOracle: {
                readonly 11155111: {
                    readonly address: "0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254";
                };
            };
            readonly portal: {
                readonly 11155111: {
                    readonly address: "0x49f53e41452c74589e85ca1677426ba426459e85";
                    readonly blockCreated: 4446677;
                };
            };
            readonly l1StandardBridge: {
                readonly 11155111: {
                    readonly address: "0xfd0Bf71F60660E2f608ed56e1659C450eB113120";
                    readonly blockCreated: 4446677;
                };
            };
            readonly multicall3: {
                readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
                readonly blockCreated: 1059647;
            };
            readonly gasPriceOracle: {
                readonly address: "0x420000000000000000000000000000000000000F";
            };
            readonly l1Block: {
                readonly address: "0x4200000000000000000000000000000000000015";
            };
            readonly l2CrossDomainMessenger: {
                readonly address: "0x4200000000000000000000000000000000000007";
            };
            readonly l2Erc721Bridge: {
                readonly address: "0x4200000000000000000000000000000000000014";
            };
            readonly l2StandardBridge: {
                readonly address: "0x4200000000000000000000000000000000000010";
            };
            readonly l2ToL1MessagePasser: {
                readonly address: "0x4200000000000000000000000000000000000016";
            };
        };
        ensTlds?: readonly string[] | undefined;
        id: 84532;
        name: "Base Sepolia";
        nativeCurrency: {
            readonly name: "Sepolia Ether";
            readonly symbol: "ETH";
            readonly decimals: 18;
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://sepolia.base.org"];
            };
        };
        sourceId: 11155111;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        fees?: viem.ChainFees<undefined> | undefined;
        formatters: {
            readonly block: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcBlock) => {
                    baseFeePerGas: bigint | null;
                    blobGasUsed: bigint;
                    difficulty: bigint;
                    excessBlobGas: bigint;
                    extraData: viem.Hex;
                    gasLimit: bigint;
                    gasUsed: bigint;
                    hash: `0x${string}` | null;
                    logsBloom: `0x${string}` | null;
                    miner: abitype.Address;
                    mixHash: viem.Hash;
                    nonce: `0x${string}` | null;
                    number: bigint | null;
                    parentBeaconBlockRoot?: `0x${string}` | undefined;
                    parentHash: viem.Hash;
                    receiptsRoot: viem.Hex;
                    sealFields: viem.Hex[];
                    sha3Uncles: viem.Hash;
                    size: bigint;
                    stateRoot: viem.Hash;
                    timestamp: bigint;
                    totalDifficulty: bigint | null;
                    transactions: `0x${string}`[] | viem_chains.OpStackTransaction<boolean>[];
                    transactionsRoot: viem.Hash;
                    uncles: viem.Hash[];
                    withdrawals?: viem.Withdrawal[] | undefined | undefined;
                    withdrawalsRoot?: `0x${string}` | undefined;
                } & {};
                type: "block";
            };
            readonly transaction: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransaction) => ({
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: boolean;
                    mint?: bigint | undefined | undefined;
                    sourceHash: viem.Hex;
                    type: "deposit";
                } | {
                    r: viem.Hex;
                    s: viem.Hex;
                    v: bigint;
                    to: abitype.Address | null;
                    from: abitype.Address;
                    gas: bigint;
                    nonce: number;
                    value: bigint;
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    hash: viem.Hash;
                    input: viem.Hex;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    accessList?: undefined | undefined;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes?: undefined | undefined;
                    chainId?: number | undefined;
                    yParity?: undefined | undefined;
                    type: "legacy";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas?: undefined | undefined;
                    maxPriorityFeePerGas?: undefined | undefined;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes?: undefined | undefined;
                    chainId: number;
                    type: "eip2930";
                    gasPrice: bigint;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas?: undefined | undefined;
                    maxPriorityFeePerGas?: undefined | undefined;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes?: undefined | undefined;
                    chainId: number;
                    type: "eip1559";
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList?: undefined | undefined;
                    blobVersionedHashes: readonly viem.Hex[];
                    chainId: number;
                    type: "eip4844";
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas: bigint;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                } | {
                    blockHash: `0x${string}` | null;
                    blockNumber: bigint | null;
                    from: abitype.Address;
                    gas: bigint;
                    hash: viem.Hash;
                    input: viem.Hex;
                    nonce: number;
                    r: viem.Hex;
                    s: viem.Hex;
                    to: abitype.Address | null;
                    transactionIndex: number | null;
                    typeHex: viem.Hex | null;
                    v: bigint;
                    value: bigint;
                    yParity: number;
                    accessList: viem.AccessList;
                    authorizationList: viem.SignedAuthorizationList;
                    blobVersionedHashes?: undefined | undefined;
                    chainId: number;
                    type: "eip7702";
                    gasPrice?: undefined | undefined;
                    maxFeePerBlobGas?: undefined | undefined;
                    maxFeePerGas: bigint;
                    maxPriorityFeePerGas: bigint;
                    isSystemTx?: undefined | undefined;
                    mint?: undefined | undefined;
                    sourceHash?: undefined | undefined;
                }) & {};
                type: "transaction";
            };
            readonly transactionReceipt: {
                exclude: [] | undefined;
                format: (args: viem_chains.OpStackRpcTransactionReceipt) => {
                    blobGasPrice?: bigint | undefined;
                    blobGasUsed?: bigint | undefined;
                    blockHash: viem.Hash;
                    blockNumber: bigint;
                    contractAddress: abitype.Address | null | undefined;
                    cumulativeGasUsed: bigint;
                    effectiveGasPrice: bigint;
                    from: abitype.Address;
                    gasUsed: bigint;
                    logs: viem.Log<bigint, number, false>[];
                    logsBloom: viem.Hex;
                    root?: `0x${string}` | undefined;
                    status: "success" | "reverted";
                    to: abitype.Address | null;
                    transactionHash: viem.Hash;
                    transactionIndex: number;
                    type: viem.TransactionType;
                    l1GasPrice: bigint | null;
                    l1GasUsed: bigint | null;
                    l1Fee: bigint | null;
                    l1FeeScalar: number | null;
                } & {};
                type: "transactionReceipt";
            };
        };
        serializers: {
            readonly transaction: typeof viem_chains.serializeTransactionOpStack;
        };
        readonly network: "base-sepolia";
    };
};
type SupportedChainId = keyof typeof SUPPORTED_CHAINS;
declare const CHAIN_CONTRACT_ADDRESSES: Record<SupportedChainId, `0x${string}`>;
declare function getContractAddress(chain: Chain): `0x${string}`;

/**
 * Address validation utilities
 */
declare function isValidAddress(address: string): address is Address;
declare function validateAddress(address: string, fieldName?: string): Address;
/**
 * Time utilities
 */
declare function toUnixTimestamp(date: Date): bigint;
declare function fromUnixTimestamp(timestamp: bigint): Date;
declare function isValidTimestamp(timestamp: bigint): boolean;
/**
 * Basis points utilities
 */
declare function basisPointsToPercent(basisPoints: number): number;
declare function percentToBasisPoints(percent: number): number;
declare function validateBasisPoints(basisPoints: number, maxBps?: number): void;
/**
 * BigInt utilities
 */
declare function formatEther(wei: bigint): string;
declare function parseEther(ether: string): bigint;
/**
 * Event validation utilities
 */
declare function validateEventTiming(startTime: bigint, endTime: bigint): void;
declare function validateCapacity(capacity: number): void;
/**
 * Payment split validation
 */
declare function validatePaymentSplits(splits: {
    recipient: Address;
    basisPoints: number;
}[]): void;

/**
 * Custom Error Classes for Assemble SDK
 */
declare class AssembleError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
declare class ContractError extends AssembleError {
    contractError?: string | undefined;
    constructor(message: string, contractError?: string | undefined);
}
declare class ValidationError extends AssembleError {
    field?: string | undefined;
    constructor(message: string, field?: string | undefined);
}
declare class NetworkError extends AssembleError {
    chainId?: number | undefined;
    constructor(message: string, chainId?: number | undefined);
}
declare class WalletError extends AssembleError {
    constructor(message: string);
}
/**
 * Error type guards
 */
declare function isAssembleError(error: unknown): error is AssembleError;
declare function isContractError(error: unknown): error is ContractError;
declare function isValidationError(error: unknown): error is ValidationError;
declare function isNetworkError(error: unknown): error is NetworkError;
declare function isWalletError(error: unknown): error is WalletError;

export { ASSEMBLE_ABI, ASSEMBLE_CONTRACT_ADDRESS, AssembleClient, type AssembleClientConfig, AssembleError, type AttendanceProof, CHAIN_CONTRACT_ADDRESSES, type CheckInParams, type Comment, type CommentWithReplies, type CommentsResponse, ContractError, type CreateClientOptions, type CreateEventParams, type Event, EventManager, EventVisibility, type EventsResponse, type Friend, type InviteParams, NetworkError, type PaymentSplit, ProtocolManager, type PurchaseTicketsParams, RSVPStatus, type RefundAmounts, RefundType, SUPPORTED_CHAINS, SocialManager, type SupportedChainId, type Ticket, TicketManager, type TicketTier, type TicketsResponse, ValidationError, WalletError, basisPointsToPercent, formatEther, fromUnixTimestamp, getContractAddress, isAssembleError, isContractError, isNetworkError, isValidAddress, isValidTimestamp, isValidationError, isWalletError, parseEther, percentToBasisPoints, toUnixTimestamp, validateAddress, validateBasisPoints, validateCapacity, validateEventTiming, validatePaymentSplits };
