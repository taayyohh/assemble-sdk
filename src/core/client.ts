import { Address, PublicClient, WalletClient } from 'viem'
import { AssembleClientConfig } from '../types'
import { EventManager } from './events'
import { TicketManager } from './tickets'
import { SocialManager } from './social'
import { ProtocolManager } from './protocol'
import { ERC20Manager } from './erc20'
import { VenueManager } from './venue'
import { PrivateEventManager } from './private-events'
import { PlatformFeeManager } from './platform-fees'
import { RefundManager } from './refunds'
import { TokenManager } from './tokens'
import { NetworkError, WalletError } from '../errors'

export interface CreateClientOptions {
  contractAddress: Address
  publicClient: PublicClient
  walletClient?: WalletClient
}

export type { AssembleClientConfig } from '../types'

/**
 * Main client for interacting with the Assemble Protocol
 */
export class AssembleClient {
  public readonly config: AssembleClientConfig
  public readonly events: EventManager
  public readonly tickets: TicketManager
  public readonly social: SocialManager
  public readonly protocol: ProtocolManager
  public readonly erc20: ERC20Manager
  public readonly venues: VenueManager
  public readonly privateEvents: PrivateEventManager
  public readonly platformFees: PlatformFeeManager
  public readonly refunds: RefundManager
  public readonly tokens: TokenManager

  constructor(config: AssembleClientConfig) {
    this.config = config
    
    // Initialize managers
    this.events = new EventManager(config)
    this.tickets = new TicketManager(config)
    this.social = new SocialManager(config)
    this.protocol = new ProtocolManager(config)
    this.erc20 = new ERC20Manager(config)
    this.venues = new VenueManager(config)
    this.privateEvents = new PrivateEventManager(config)
    this.platformFees = new PlatformFeeManager(config)
    this.refunds = new RefundManager(config)
    this.tokens = new TokenManager(config)
  }

  /**
   * Create a new Assemble client
   */
  static create(options: CreateClientOptions): AssembleClient {
    const config: AssembleClientConfig = {
      contractAddress: options.contractAddress,
      publicClient: options.publicClient,
      walletClient: options.walletClient,
    }

    return new AssembleClient(config)
  }

  /**
   * Get the current account address
   */
  get account(): Address | undefined {
    return this.config.walletClient?.account?.address
  }

  /**
   * Check if the client has a wallet connected
   */
  get isConnected(): boolean {
    return !!this.config.walletClient && !!this.account
  }

  /**
   * Get the current chain ID
   */
  async getChainId(): Promise<number> {
    try {
      return await this.config.publicClient.getChainId()
    } catch (error) {
      throw new NetworkError('Failed to get chain ID')
    }
  }

  /**
   * Switch to a specific chain
   */
  async switchChain(chainId: number): Promise<void> {
    if (!this.config.walletClient) {
      throw new WalletError('No wallet connected')
    }

    try {
      await this.config.walletClient.switchChain({ id: chainId })
    } catch (error) {
      throw new NetworkError(`Failed to switch to chain ${chainId}`)
    }
  }

  /**
   * Set a new wallet client
   */
  setWalletClient(walletClient: WalletClient): void {
    this.config.walletClient = walletClient
  }

  /**
   * Remove the wallet client (disconnect)
   */
  disconnect(): void {
    this.config.walletClient = undefined
  }
} 