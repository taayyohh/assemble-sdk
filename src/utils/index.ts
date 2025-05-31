import { Address } from 'viem'
import { ValidationError } from '../errors'

/**
 * Address validation utilities
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function validateAddress(address: string, fieldName = 'address'): Address {
  if (!isValidAddress(address)) {
    throw new ValidationError(`Invalid ${fieldName}: ${address}`, fieldName)
  }
  return address as Address
}

/**
 * Time utilities
 */
export function toUnixTimestamp(date: Date): bigint {
  return BigInt(Math.floor(date.getTime() / 1000))
}

export function fromUnixTimestamp(timestamp: bigint): Date {
  return new Date(Number(timestamp) * 1000)
}

export function isValidTimestamp(timestamp: bigint): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000))
  return timestamp > 0n && timestamp < now + BigInt(365 * 24 * 60 * 60) // Within next year
}

/**
 * Basis points utilities
 */
export function basisPointsToPercent(basisPoints: number): number {
  return basisPoints / 100
}

export function percentToBasisPoints(percent: number): number {
  return Math.round(percent * 100)
}

export function validateBasisPoints(basisPoints: number, maxBps = 10000): void {
  if (basisPoints < 0 || basisPoints > maxBps) {
    throw new ValidationError(`Basis points must be between 0 and ${maxBps}`)
  }
}

/**
 * BigInt utilities
 */
export function formatEther(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4)
}

export function parseEther(ether: string): bigint {
  return BigInt(Math.floor(parseFloat(ether) * 1e18))
}

/**
 * Event validation utilities
 */
export function validateEventTiming(startTime: bigint, endTime: bigint): void {
  const now = BigInt(Math.floor(Date.now() / 1000))
  
  if (startTime <= now) {
    throw new ValidationError('Event start time must be in the future')
  }
  
  if (endTime <= startTime) {
    throw new ValidationError('Event end time must be after start time')
  }
}

export function validateCapacity(capacity: number): void {
  if (capacity <= 0 || capacity > 100000) {
    throw new ValidationError('Event capacity must be between 1 and 100,000')
  }
}

/**
 * Payment split validation
 */
export function validatePaymentSplits(splits: { recipient: Address; basisPoints: number }[]): void {
  if (splits.length === 0) {
    throw new ValidationError('At least one payment split is required')
  }
  
  if (splits.length > 20) {
    throw new ValidationError('Maximum 20 payment splits allowed')
  }
  
  const totalBps = splits.reduce((sum, split) => sum + split.basisPoints, 0)
  if (totalBps !== 10000) {
    throw new ValidationError('Payment splits must total exactly 100% (10,000 basis points)')
  }
  
  for (const split of splits) {
    validateAddress(split.recipient, 'payment split recipient')
    validateBasisPoints(split.basisPoints)
  }
} 