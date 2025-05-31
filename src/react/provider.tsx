import React, { createContext, useContext, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AssembleClient } from '../core/client'
import type { AssembleClientConfig } from '../types'

/**
 * Assemble Context
 */
interface AssembleContextType {
  client: AssembleClient
  isConnected: boolean
}

const AssembleContext = createContext<AssembleContextType | null>(null)

/**
 * Assemble Provider Props
 */
interface AssembleProviderProps {
  client: AssembleClient
  queryClient?: QueryClient
  children: ReactNode
}

/**
 * Assemble Provider Component
 * 
 * Provides Assemble client and React Query integration to the component tree.
 */
export function AssembleProvider({ 
  client, 
  queryClient, 
  children 
}: AssembleProviderProps) {
  // Create default query client if not provided
  const defaultQueryClient = React.useMemo(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
          retry: 2,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 1,
        },
      },
    }),
    []
  )

  const contextValue: AssembleContextType = {
    client,
    isConnected: !!client.config.walletClient,
  }

  const ClientProvider = queryClient ? 
    ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ) :
    ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={defaultQueryClient}>
        {children}
      </QueryClientProvider>
    )

  return (
    <ClientProvider>
      <AssembleContext.Provider value={contextValue}>
        {children}
      </AssembleContext.Provider>
    </ClientProvider>
  )
}

/**
 * Hook to access Assemble context
 */
export function useAssemble(): AssembleContextType {
  const context = useContext(AssembleContext)
  
  if (!context) {
    throw new Error('useAssemble must be used within an AssembleProvider')
  }
  
  return context
} 