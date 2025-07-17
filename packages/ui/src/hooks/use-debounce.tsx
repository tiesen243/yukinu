import * as React from 'react'

export function useDebounce<T extends (...args: never[]) => unknown>(
  fn: T,
  deps: React.DependencyList,
  delay: number,
): (...args: Parameters<T>) => void {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedFn = React.useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay, fn, ...deps],
  )

  React.useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    },
    [],
  )

  return debouncedFn
}
