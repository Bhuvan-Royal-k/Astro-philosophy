import React, { useState, useEffect, useRef } from 'react'
import { siteConfig } from '../config/site'
import { Calendar } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

/**
 * Traditional Ceremonial Lamp (Diya / Deepam) SVG Icon
 * Custom crafted to honor authentic Indian sacred pooja traditions
 */
const CeremonialLampIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Radiant sacred flame with inner teardrop aura */}
    <path
      d="M12 2C10.5 4.5 9 6.8 9 9.5C9 11.8 10.3 13.5 12 13.5C13.7 13.5 15 11.8 15 9.5C15 6.8 13.5 4.5 12 2Z"
      stroke="#DFC283"
      fill="rgba(198, 161, 91, 0.2)"
    />
    <path
      d="M12 5C11.3 6.5 10.8 7.8 10.8 9C10.8 9.8 11.3 10.5 12 10.5C12.7 10.5 13.2 9.8 13.2 9C13.2 7.8 12.7 6.5 12 5Z"
      fill="#DFC283"
    />
    {/* Traditional brass oil bowl */}
    <path
      d="M4 14C4.5 18 8 19 12 19C16 19 19.5 18 20 14H4Z"
      stroke="#C6A15B"
      fill="rgba(198, 161, 91, 0.1)"
    />
    {/* Lamp pedestal & base */}
    <path d="M10 19V21.5H14V19" stroke="#C6A15B" />
    <path d="M7.5 21.5H16.5" stroke="#C6A15B" strokeWidth="1.8" />
  </svg>
)

interface StatCounterProps {
  targetValue: number
  suffix?: string
  hasStarted: boolean
}

/**
 * Eased numerical counter with zero-layout-shift and reduced-motion support
 */
const AnimatedStatValue: React.FC<StatCounterProps> = ({ targetValue, suffix = '', hasStarted }) => {
  const [displayValue, setDisplayValue] = useState<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplayValue(targetValue)
      return
    }

    if (!hasStarted) {
      setDisplayValue(0)
      return
    }

    const duration = 1800 // 1.8 seconds duration
    const startTime = performance.now()

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth ease-out cubic curve: 1 - (1 - progress)^3
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeProgress * targetValue)

      setDisplayValue(currentCount)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step)
      } else {
        setDisplayValue(targetValue)
      }
    }

    animationFrameRef.current = requestAnimationFrame(step)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [hasStarted, targetValue])

  return (
    <div className="inline-flex items-baseline tabular-nums select-none">
      <span className="text-5xl sm:text-6xl lg:text-7xl font-cinzel font-light text-[#DFC283] tracking-tight drop-shadow-[0_0_12px_rgba(198,161,91,0.25)]">
        {displayValue}
      </span>
      {suffix && (
        <span className="text-3xl sm:text-4xl lg:text-5xl font-cinzel text-[#C6A15B]/85 ml-1">
          {suffix}
        </span>
      )}
    </div>
  )
}

export const JourneySection: React.FC = () => {
  const { journey } = siteConfig
  const { t } = useLanguage()

  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Respect reduced-motion preferences immediately
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setHasAnimated(true)
      return
    }

    // Trigger animation once per page load when section enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  // Extract configurable stat objects from siteConfig
  const experienceStat = journey.stats.find((s) => s.id === 'experience') || {
    value: 20,
    suffix: '+',
    isPlaceholder: true,
  }

  const poojasStat = journey.stats.find((s) => s.id === 'poojas') || {
    value: 500,
    suffix: '+',
    isPlaceholder: true,
  }

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-[#080B1A] text-[#F4EFE4] overflow-hidden border-t border-white/[0.06]"
      aria-label="Our Journey and Experience Statistics"
    >
      {/* Restrained background ambient glow centered behind metrics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse,rgba(23,21,47,0.4)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          {/* Eyebrow Label with Hairlines */}
          <div className="inline-flex items-center space-x-3 mb-3">
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#C6A15B]/85">
              {t.journey.badge}
            </span>
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
          </div>

          {/* Main Section Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-medium tracking-wide text-[#F4EFE4] mb-4">
            {t.journey.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base font-serif-body italic text-[#A9A5C5] leading-relaxed max-w-2xl mx-auto">
            {t.journey.subtitle}
          </p>
        </div>

        {/* Two-Column Prominent Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Metric 1: Years of Experience */}
          <div className="editorial-panel p-8 sm:p-10 rounded-[2px] flex flex-col justify-between relative group hover:border-[#C6A15B]/35 transition-all duration-500">
            {/* Top Row: Icon & Category */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-[1px] bg-[#0C1026] border border-[#C6A15B]/25 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#C6A15B]" />
              </div>
              <span className="text-[9.5px] font-sans uppercase tracking-[0.24em] text-[#C6A15B]/70">
                01 • Heritage & Practice
              </span>
            </div>

            {/* Middle: Prominent Number & Eased Counter */}
            <div className="my-2 min-h-[5rem] flex items-center">
              <AnimatedStatValue
                targetValue={experienceStat.value}
                suffix={experienceStat.suffix}
                hasStarted={hasAnimated}
              />
            </div>

            {/* Bottom Row: Heading & Contextual Subtext */}
            <div className="pt-4 border-t border-white/[0.05]">
              <h3 className="text-lg sm:text-xl font-cinzel text-[#F4EFE4] mb-2 tracking-wide">
                {t.journey.experienceLabel}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#A9A5C5] leading-relaxed">
                {t.journey.experienceSubtext}
              </p>

              {/* Dev-only placeholder note (hidden in production) */}
              {experienceStat.isPlaceholder && import.meta.env.DEV && (
                <div className="mt-4 pt-2 border-t border-white/[0.04]">
                  <span className="inline-block px-2 py-0.5 rounded-[1px] text-[8.5px] font-sans tracking-[0.14em] uppercase text-[#C6A15B]/75 bg-[#C6A15B]/10 border border-[#C6A15B]/20">
                    [Dev: Configurable in src/config/site.ts]
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Metric 2: Poojas & Ceremonies Performed */}
          <div className="editorial-panel p-8 sm:p-10 rounded-[2px] flex flex-col justify-between relative group hover:border-[#C6A15B]/35 transition-all duration-500">
            {/* Top Row: Icon & Category */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-[1px] bg-[#0C1026] border border-[#C6A15B]/25 flex items-center justify-center">
                <CeremonialLampIcon className="w-5 h-5 text-[#C6A15B]" />
              </div>
              <span className="text-[9.5px] font-sans uppercase tracking-[0.24em] text-[#C6A15B]/70">
                02 • Sacred Ceremonies
              </span>
            </div>

            {/* Middle: Prominent Number & Eased Counter */}
            <div className="my-2 min-h-[5rem] flex items-center">
              <AnimatedStatValue
                targetValue={poojasStat.value}
                suffix={poojasStat.suffix}
                hasStarted={hasAnimated}
              />
            </div>

            {/* Bottom Row: Heading & Contextual Subtext */}
            <div className="pt-4 border-t border-white/[0.05]">
              <h3 className="text-lg sm:text-xl font-cinzel text-[#F4EFE4] mb-2 tracking-wide">
                {t.journey.poojasLabel}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#A9A5C5] leading-relaxed">
                {t.journey.poojasSubtext}
              </p>

              {/* Dev-only placeholder note (hidden in production) */}
              {poojasStat.isPlaceholder && import.meta.env.DEV && (
                <div className="mt-4 pt-2 border-t border-white/[0.04]">
                  <span className="inline-block px-2 py-0.5 rounded-[1px] text-[8.5px] font-sans tracking-[0.14em] uppercase text-[#C6A15B]/75 bg-[#C6A15B]/10 border border-[#C6A15B]/20">
                    [Dev: Configurable in src/config/site.ts]
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JourneySection
