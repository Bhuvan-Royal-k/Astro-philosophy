import React from 'react'
import { siteConfig } from '../config/site'
import { Quote } from 'lucide-react'

export const AboutSection: React.FC = () => {
  const { about } = siteConfig

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V']

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 bg-[#080B1A] text-[#F4EFE4] overflow-hidden"
      aria-label="About Astro Philosophy"
    >
      {/* Subtle, restrained ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(23,21,47,0.45)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-3 mb-3">
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#C6A15B]/85">
              {about.badge}
            </span>
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-medium tracking-wide text-[#F4EFE4] mb-4 leading-snug">
            {about.title}
          </h2>

          <p className="text-sm sm:text-base font-serif-body italic text-[#A9A5C5] leading-relaxed max-w-2xl mx-auto">
            {about.subtitle}
          </p>
        </div>

        {/* Narrative & Principles Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Narrative & Quote */}
          <div className="lg:col-span-7 space-y-8">
            <div className="editorial-panel p-7 sm:p-9 rounded-sm relative">
              <h3 className="text-lg sm:text-xl font-cinzel text-[#DFC283] mb-4 tracking-wide">
                Perspective Rooted in Classical Heritage
              </h3>
              <div className="space-y-4 text-sm sm:text-base font-sans text-[#F4EFE4]/80 leading-relaxed">
                {about.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Restrained Editorial Quote */}
            {about.quote && (
              <div className="py-5 px-6 border-l border-[#C6A15B]/50 bg-[#17152F]/20 flex items-start space-x-4">
                <Quote className="w-5 h-5 text-[#C6A15B]/60 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm sm:text-base font-serif-body italic text-[#DFC283]/95 leading-relaxed">
                    &ldquo;{about.quote.text}&rdquo;
                  </p>
                  <p className="text-[10px] sm:text-xs font-sans tracking-[0.22em] uppercase text-[#A9A5C5]/70">
                    — {about.quote.source}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Architectural Astrological Principles */}
          <div className="lg:col-span-5 space-y-2">
            <h3 className="text-xs font-cinzel tracking-[0.25em] uppercase text-[#C6A15B]/90 mb-4 pb-2 border-b border-white/[0.08]">
              Core Foundations
            </h3>

            <div className="divide-y divide-white/[0.06]">
              {about.principles.map((principle, index) => (
                <div
                  key={principle.title}
                  className="py-5 first:pt-2 last:pb-2 group transition-colors"
                >
                  <div className="flex items-baseline space-x-3 mb-1.5">
                    <span className="text-[11px] font-cinzel text-[#C6A15B]/70 tracking-[0.15em] shrink-0">
                      {romanNumerals[index] || `0${index + 1}`}
                    </span>
                    <h4 className="text-sm sm:text-base font-cinzel text-[#F4EFE4] group-hover:text-[#DFC283] transition-colors tracking-wide">
                      {principle.title}
                    </h4>
                  </div>
                  <p className="pl-6 text-xs sm:text-sm font-sans text-[#A9A5C5] leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
export default AboutSection
