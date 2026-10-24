import React, { useEffect, useState } from 'react'

interface LoadingScreenProps {
  progress?: number
  onComplete?: () => void
  isLoading?: boolean
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress = 100,
  onComplete,
  isLoading = true,
}) => {
  const [visible, setVisible] = useState(isLoading)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (!isLoading) {
      // Smooth fade out
      const fadeTimer = setTimeout(() => {
        setOpacity(0)
      }, 300)

      const removeTimer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 900)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(removeTimer)
      }
    }
  }, [isLoading, onComplete])

  // Fallback timer: Never hang indefinitely if assets take too long
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setOpacity(0)
      setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 600)
    }, 2800)

    return () => clearTimeout(safetyTimer)
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Astro Philosophy"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B1A] transition-opacity duration-700 ease-out"
      style={{ opacity }}
    >
      {/* Cosmic background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(23,21,47,0.8)_0%,rgba(8,11,26,1)_70%)] pointer-events-none" />

      {/* Sacred Yantra Spinner */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-8">
          {/* Outer rotating celestial ring */}
          <div className="absolute inset-0 rounded-full border border-[#C6A15B]/30 border-dashed animate-[spin_18s_linear_infinite]" />
          
          {/* Inner counter-rotating ring */}
          <div className="absolute inset-2 rounded-full border border-[#DFC283]/40 border-t-transparent border-r-transparent animate-[spin_8s_linear_infinite_reverse]" />
          
          {/* Central Golden Meditation Emblem */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <img
              src="/assets/images/astro-philosophy-logo.png"
              alt="Astro Philosophy Emblem"
              className="w-14 h-14 object-contain drop-shadow-[0_0_14px_rgba(198,161,91,0.5)] animate-pulse"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/images/favicon.svg'
              }}
            />
          </div>
        </div>

        {/* Wordmark */}
        <h2 className="text-xl md:text-2xl font-cinzel font-semibold tracking-[0.25em] text-[#F4EFE4] mb-2 text-center">
          ASTRO PHILOSOPHY
        </h2>
        
        <p className="text-xs md:text-sm font-sans tracking-[0.3em] uppercase text-[#C6A15B] mb-6">
          Aligning with the Cosmic Wheel
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-0.5 bg-[#17152F] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#8E7036] via-[#C6A15B] to-[#DFC283] transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(10, progress))}%` }}
          />
        </div>
      </div>
    </div>
  )
}
export default LoadingScreen
