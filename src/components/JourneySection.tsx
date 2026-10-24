import React, { useState, useEffect, useRef } from 'react'
import { siteConfig } from '../config/site'
import { Calendar, Users, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

/**
 * Traditional Ceremonial Lamp (Diya / Deepam) SVG Icon
 * Custom crafted to honor authentic Indian sacred pooja traditions
 */
const CeremonialLampIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
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
      fill="rgba(198, 161, 91, 0.25)"
    />
    <path
      d="M12 5C11.3 6.5 10.8 7.8 10.8 9C10.8 9.8 11.3 10.5 12 10.5C12.7 10.5 13.2 9.8 13.2 9C13.2 7.8 12.7 6.5 12 5Z"
      fill="#DFC283"
    />
    {/* Traditional brass oil bowl */}
    <path
      d="M4 14C4.5 18 8 19 12 19C16 19 19.5 18 20 14H4Z"
      stroke="#C6A15B"
      fill="rgba(198, 161, 91, 0.12)"
    />
    {/* Lamp pedestal & base */}
    <path d="M10 19V21.5H14V19" stroke="#C6A15B" />
    <path d="M7.5 21.5H16.5" stroke="#C6A15B" strokeWidth="1.8" />
  </svg>
)

interface AnimatedCounterProps {
  targetValue: number
  suffix?: string
  staggerDelay?: number
  hasTriggered: boolean
  label: string
}

/**
 * High-precision eased counter using requestAnimationFrame.
 * - Starts initially at 0
 * - Starts smoothly with stagger delay (approx 150ms between cards)
 * - 2.0s duration with quartic ease-out
 * - Displays numbers with US locale formatting (e.g. 2,000+)
 * - Screen-reader friendly (announces final static value once via aria-label)
 * - Respects prefers-reduced-motion
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  suffix = '',
  staggerDelay = 0,
  hasTriggered,
  label,
}) => {
  const [currentValue, setCurrentValue] = useState<number>(0)
  const animFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 1. Reduced motion check
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setCurrentValue(targetValue)
      return
    }

    // 2. If not triggered yet, keep displayed number at 0
    if (!hasTriggered) {
      setCurrentValue(0)
      return
    }

    const duration = 2000 // 2 seconds animation duration

    // 3. Staggered count-up animation
    timeoutRef.current = setTimeout(() => {
      let startTime: number | null = null

      const step = (now: number) => {
        if (!startTime) startTime = now
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Smooth quartic ease-out curve: 1 - (1 - progress)^4
        const easeProgress = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.round(easeProgress * targetValue)

        setCurrentValue(currentCount)

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step)
        } else {
          setCurrentValue(targetValue)
        }
      }

      animFrameRef.current = requestAnimationFrame(step)
    }, staggerDelay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [hasTriggered, targetValue, staggerDelay])

  const formattedDisplay = currentValue.toLocaleString('en-US')
  const finalFormatted = targetValue.toLocaleString('en-US')

  return (
    <div
      className="inline-flex items-baseline tabular-nums select-none"
      role="text"
      aria-label={`${finalFormatted}${suffix} ${label}`}
    >
      <span
        className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-cinzel font-light text-[#DFC283] tracking-tight drop-shadow-[0_0_12px_rgba(198,161,91,0.25)]"
        aria-hidden="true"
      >
        {formattedDisplay}
      </span>
      {suffix && (
        <span
          className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-cinzel text-[#C6A15B]/85 ml-1"
          aria-hidden="true"
        >
          {suffix}
        </span>
      )}
    </div>
  )
}

export const JourneySection: React.FC = () => {
  const { journey, services } = siteConfig
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

    if (hasAnimated) return

    // Trigger animation once per page load when section enters viewport
    const handleIntersect: IntersectionObserverCallback = (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          observer.disconnect()
          break
        }
      }
    }

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px',
    })

    const el = sectionRef.current
    if (el) {
      observer.observe(el)

      // Fallback check if section is already in viewport upon mount/reload
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setHasAnimated(true)
        observer.disconnect()
      }
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  // Dynamic offerings count matching existing catalogue
  const offeringsCount = services.items?.length || 13

  // Four Prominent Statistics
  const statItems = [
    {
      id: 'experience',
      value: journey.stats?.find((s) => s.id === 'experience')?.value ?? 20,
      suffix: '+',
      label: t.journey.experienceLabel,
      subtext: t.journey.experienceSubtext,
      badge: '01 • Heritage',
      icon: Calendar,
    },
    {
      id: 'poojas',
      value: journey.stats?.find((s) => s.id === 'poojas')?.value ?? 500,
      suffix: '+',
      label: t.journey.poojasLabel,
      subtext: t.journey.poojasSubtext,
      badge: '02 • Ceremonies',
      icon: CeremonialLampIcon,
    },
    {
      id: 'clients',
      value: journey.stats?.find((s) => s.id === 'clients')?.value ?? 2000,
      suffix: '+',
      label: t.journey.clientsLabel,
      subtext: t.journey.clientsSubtext,
      badge: '03 • Devotees',
      icon: Users,
    },
    {
      id: 'offerings',
      value: journey.stats?.find((s) => s.id === 'offerings')?.value ?? offeringsCount,
      suffix: '',
      label: t.journey.offeringsLabel,
      subtext: t.journey.offeringsSubtext,
      badge: '04 • Offerings',
      icon: Sparkles,
    },
  ]

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-[#080A17] text-[#F4EFE4] overflow-hidden border-t border-white/[0.06]"
      aria-label="Our Journey and Statistics"
    >
      {/* Restrained background ambient glow centered behind metrics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-[radial-gradient(ellipse,rgba(23,21,47,0.45)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        {/* Four-Card Visual Layout: Single row on desktop (lg), 2 cols on tablet/mobile (sm), stacked on narrow mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {statItems.map((stat, idx) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.id}
                className="editorial-panel p-6 sm:p-7 rounded-[2px] flex flex-col justify-between relative group hover:border-[#C6A15B]/40 hover:-translate-y-1 transition-all duration-300 min-h-[16rem]"
                role="region"
                aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              >
                {/* Top Row: Icon & Category Indicator */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <div className="w-9 h-9 rounded-[1px] bg-[#0C1026] border border-[#C6A15B]/25 flex items-center justify-center group-hover:border-[#C6A15B]/50 transition-colors">
                    <IconComponent className="w-4 h-4 text-[#C6A15B]" aria-hidden="true" />
                  </div>
                  <span className="text-[9px] font-sans uppercase tracking-[0.22em] text-[#C6A15B]/70">
                    {stat.badge}
                  </span>
                </div>

                {/* Middle: Prominent Number & Eased Staggered Counter */}
                <div className="my-2 min-h-[4.5rem] flex items-center">
                  <AnimatedCounter
                    targetValue={stat.value}
                    suffix={stat.suffix}
                    staggerDelay={idx * 150}
                    hasTriggered={hasAnimated}
                    label={stat.label}
                  />
                </div>

                {/* Bottom Row: Heading & Subtext */}
                <div className="pt-3 border-t border-white/[0.05] mt-auto">
                  <h3 className="text-sm sm:text-base font-cinzel text-[#F4EFE4] mb-1.5 tracking-wide leading-snug">
                    {stat.label}
                  </h3>
                  <p className="text-xs font-sans text-[#A9A5C5] leading-relaxed">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default JourneySection
