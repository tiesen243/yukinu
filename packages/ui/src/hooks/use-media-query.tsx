'use client'

import * as React from 'react'

export function useMediaQuery(query: string, initialValue?: boolean) {
  const [matches, setMatches] = React.useState(() => {
    if (initialValue !== undefined) return initialValue
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
