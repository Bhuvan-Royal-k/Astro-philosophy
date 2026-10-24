import { useState, useEffect } from 'react'

/**
 * Hook to detect whether the current viewport is mobile/tablet.
 * Default breakpoint is 768px.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: number | undefined

    const handleResize = () => {
      // Throttle/debounce resize checks
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId)
      }
      timeoutId = window.requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < breakpoint)
      })
    }

    window.addEventListener('resize', handleResize)
    // Initial verification
    setIsMobile(window.innerWidth < breakpoint)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId)
      }
    }
  }, [breakpoint])

  return isMobile
}
