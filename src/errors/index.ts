/**
 * Custom Error Classes for Assemble SDK
 */

export class AssembleError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AssembleError'
  }
}

export class ContractError extends AssembleError {
  constructor(message: string, public contractError?: string) {
    super(message, 'CONTRACT_ERROR')
    this.name = 'ContractError'
  }
}

export class ValidationError extends AssembleError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NetworkError extends AssembleError {
  constructor(message: string, public chainId?: number) {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class WalletError extends AssembleError {
  constructor(message: string) {
    super(message, 'WALLET_ERROR')
    this.name = 'WalletError'
  }
}

/**
 * Error type guards
 */
export function isAssembleError(error: unknown): error is AssembleError {
  return error instanceof AssembleError
}

export function isContractError(error: unknown): error is ContractError {
  return error instanceof ContractError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

export function isWalletError(error: unknown): error is WalletError {
  return error instanceof WalletError
} 