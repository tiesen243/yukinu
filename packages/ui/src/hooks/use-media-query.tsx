import * as React from 'react'

import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'

interface UseMediaQueryOptions {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === 'undefined'

export const useMediaQuery = (
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {},
): boolean => {
  const getMatches = React.useCallback(
    (query: string): boolean => {
      if (IS_SERVER) return defaultValue
      return window.matchMedia(query).matches
    },
    [defaultValue],
  )

  const [matches, setMatches] = React.useState<boolean>(() => {
    if (initializeWithValue) return getMatches(query)
    return defaultValue
  })

  const handleChange = React.useCallback(() => {
    setMatches(getMatches(query))
  }, [getMatches, query])

  useIsomorphicLayoutEffect(() => {
    const abortController = new AbortController()
    const matchMedia = window.matchMedia(query)

    handleChange()

    matchMedia.addEventListener('change', handleChange, {
      signal: abortController.signal,
    })

    return () => {
      abortController.abort()
    }
  }, [query])

  return matches
}
