import type { TRPCFetch } from '@trpc/client'

import {
  createTRPCProxyClient,
  httpBatchLink,
  httpBatchStreamLink,
  retryLink,
  splitLink,
} from '@trpc/client'
import { transformer } from '@yukinu/lib/transformer'

import type { AppRouter } from '@/app'

const NON_STREAMING_PATHS = new Set(['identity.auth.signIn'])
const RETRYABLE_TRPC_ERRORS = new Set([
  'INTERNAL_SERVER_ERROR', // Generic server error, might be a temporary glitch
  'BAD_GATEWAY', // Issues with the upstream server
  'SERVICE_UNAVAILABLE', // Server is temporarily overloaded or down for maintenance
  'GATEWAY_TIMEOUT', // Network bottleneck or slow upstream response
  'TIMEOUT', // Request took too long to process
  'CLIENT_CLOSED_REQUEST', // Connection interrupted before completion
])

const createTRPCClient = (source: string, baseUrl: string) => {
  const config = {
    transformer,
    url: `${baseUrl}/api/trpc`,
    headers: { 'x-trpc-source': source },
    fetch: (url: string, options?: RequestInit | undefined) =>
      fetch(url, {
        ...options,
        credentials: 'include',
      }) as ReturnType<TRPCFetch>,
  }

  return createTRPCProxyClient<AppRouter>({
    links: [
      retryLink({
        retry: ({ op, error, attempts }) => {
          console.log({
            op,
            error,
            attempts,
          })

          if (error.data?.code === 'UNAUTHORIZED') {
            if (attempts > 1) return false // Only attempt to refresh the token once
            fetch(`${baseUrl}/api/auth/refresh-token`, { method: 'POST' })
            return true // Retry after refreshing the token
          }

          if (
            op.type === 'query' &&
            RETRYABLE_TRPC_ERRORS.has(error.data?.code ?? '')
          )
            return attempts < 3

          return false // Don't retry for mutations or other error codes
        },
        retryDelayMs: (attempts) => Math.min(1000 * 2 ** attempts, 30_000),
      }),
      splitLink({
        condition: (op) => NON_STREAMING_PATHS.has(op.path),
        true: httpBatchLink(config),
        false: httpBatchStreamLink(config),
      }),
    ],
  })
}

export type { AppRouter }
export { createTRPCClient }
