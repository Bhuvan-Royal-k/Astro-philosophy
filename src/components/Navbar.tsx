import React, { useState, useEffect } from 'react'
import { siteConfig } from '../config/site'
import { Menu, X } from 'lucide-react'

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoSrc, setLogoSrc] = useState('/assets/images/astro-philosophy-logo.png')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop & lock body scroll when mobile menu is active
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080B1A]/90 backdrop-blur-md border-b border-white/[0.06] py-2 sm:py-2.5 shadow-lg shadow-black/40'
          : 'bg-gradient-to-b from-[#080B1A]/80 via-[#080B1A]/30 to-transparent py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <a
            href="#hero"
            aria-label="Astro Philosophy Home"
            className="flex items-center space-x-2.5 sm:space-x-3 group focus:outline-none focus:ring-1 focus:ring-[#C6A15B] rounded-sm py-1"
          >
            {/* Golden Meditation Emblem (Responsive: compact on mobile) */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 relative flex items-center justify-center">
              <img
                src={logoSrc}
                alt="Astro Philosophy Golden Meditation Emblem"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(198,161,91,0.35)] transition-transform duration-300 group-hover:scale-105"
                onError={() => {
                  // Fallback to favicon SVG if PNG fails
                  setLogoSrc('/assets/images/favicon.svg')
                }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[13px] sm:text-base font-cinzel font-medium tracking-[0.2em] text-[#FFF8EB] group-hover:text-[#DFC283] transition-colors leading-none">
                {siteConfig.meta.siteName}
              </span>
              <span className="text-[7.5px] sm:text-[8px] tracking-[0.28em] text-[#C6A15B]/75 uppercase hidden xs:block font-sans mt-1">
                South Indian Vedic Wisdom
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#A9A5C5] hover:text-[#FFF8EB] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C6A15B]/60 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            ))}

            {/* Restrained Luxury Consultation CTA */}
            {siteConfig.contact.consultationCta?.actionUrl && (
              <a
                href={siteConfig.contact.consultationCta.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-[10.5px] font-sans font-medium tracking-[0.22em] uppercase text-[#DFC283] border border-[#C6A15B]/40 hover:border-[#C6A15B] hover:text-[#080B1A] hover:bg-[#C6A15B] transition-all duration-300 rounded-[1px]"
              >
                Book Reading
              </a>
            )}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#FFF8EB] hover:text-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B] rounded-[2px]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#C6A15B]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Mobile Navigation Modal Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed inset-0 top-[48px] z-50 bg-[#080B1A]/98 backdrop-blur-2xl border-t border-white/[0.08] px-6 py-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
        >
          <nav className="flex flex-col space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#C6A15B]/70 mb-3 block">
              Menu Navigation
            </span>
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-cinzel tracking-[0.18em] text-[#FFF8EB] hover:text-[#C6A15B] py-3.5 border-b border-white/[0.05] transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-xs text-[#C6A15B]/50">→</span>
              </a>
            ))}
          </nav>
 
          {/* Mobile Footer & Quick Contact */}
          <div className="pt-8 border-t border-white/[0.08] space-y-4">
            {siteConfig.contact.consultationCta?.actionUrl && (
              <a
                href={siteConfig.contact.consultationCta.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-3.5 text-xs font-sans font-medium tracking-[0.22em] uppercase text-[#080B1A] bg-[#C6A15B] hover:bg-[#DFC283] rounded-[1px] shadow-lg transition-colors"
              >
                {siteConfig.contact.consultationCta.label || "Book Reading"}
              </a>
            )}

            <div className="pt-2 flex items-center justify-center space-x-4 text-[11px] font-sans text-[#DFC283]">
              <a href={siteConfig.contact.phoneTel || `tel:${siteConfig.contact.phone}`} className="hover:text-[#F4EFE4] transition-colors">
                Call: {siteConfig.contact.phoneDisplay}
              </a>
              <span className="text-white/20">•</span>
              <a
                href={siteConfig.contact.consultationCta?.actionUrl || siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F4EFE4] transition-colors"
              >
                WhatsApp
              </a>
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#A9A5C5]/60 uppercase">
                {siteConfig.meta.tradition}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
export default Navbar
