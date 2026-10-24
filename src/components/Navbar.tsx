import React, { useState, useEffect, useRef } from 'react'
import { siteConfig } from '../config/site'
import { Menu, X, Languages, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [logoSrc, setLogoSrc] = useState('/assets/images/astro-philosophy-logo.png')
  const langMenuRef = useRef<HTMLDivElement>(null)

  const { language, setLanguage, t, languages, currentLanguageOption } = useLanguage()

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

  // Close on ESC and click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setLangMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Navigation items mapped to current translations
  const navItems = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080B1A]/95 backdrop-blur-md border-b border-white/[0.06] py-2 sm:py-2.5 shadow-lg shadow-black/40'
          : 'bg-gradient-to-b from-[#080B1A]/85 via-[#080B1A]/35 to-transparent py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <a
            href="#hero"
            aria-label="Astro Philosophy Home"
            className="flex items-center space-x-2.5 sm:space-x-3 group focus:outline-none focus:ring-1 focus:ring-[#C6A15B] rounded-sm py-1 shrink-0"
          >
            {/* Golden Meditation Emblem (Responsive: compact on mobile) */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 relative flex items-center justify-center">
              <img
                src={logoSrc}
                alt="Astro Philosophy Golden Meditation Emblem"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(198,161,91,0.35)] transition-transform duration-300 group-hover:scale-105"
                onError={() => {
                  setLogoSrc('/assets/images/favicon.svg')
                }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[13px] sm:text-base font-cinzel font-medium tracking-[0.2em] text-[#FFF8EB] group-hover:text-[#DFC283] transition-colors leading-none">
                {siteConfig.meta.siteName}
              </span>
              <span className="text-[7.5px] sm:text-[8px] tracking-[0.28em] text-[#C6A15B]/75 uppercase hidden xs:block font-sans mt-1">
                {siteConfig.meta.tradition}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links & Controls */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label="Main Navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#A9A5C5] hover:text-[#FFF8EB] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C6A15B]/60 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            ))}

            {/* Language Switcher Dropdown (Desktop) */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-[2px] bg-[#0F0E20]/70 border border-[#C6A15B]/35 hover:border-[#C6A15B] text-[#DFC283] text-[11px] font-sans tracking-[0.14em] uppercase transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#C6A15B]"
                aria-expanded={langMenuOpen}
                aria-haspopup="listbox"
                aria-label="Select language / மொழி"
              >
                <Languages className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span className="font-medium text-[#FFF8EB]">
                  {language === 'en' ? 'Translate / மொழி' : currentLanguageOption.nativeName}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#C6A15B]/80 transform transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 mt-2 w-52 py-1.5 bg-[#0B0D1F] border border-[#C6A15B]/40 rounded-[2px] shadow-2xl shadow-black/90 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-3 py-1 border-b border-white/[0.06] mb-1">
                    <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-[#C6A15B]/70 block">
                      Choose Language
                    </span>
                  </div>
                  {languages.map((opt) => {
                    const isSelected = language === opt.code
                    return (
                      <button
                        key={opt.code}
                        role="option"
                        aria-selected={isSelected}
                        type="button"
                        onClick={() => {
                          setLanguage(opt.code)
                          setLangMenuOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#C6A15B]/15 text-[#DFC283] font-medium border-l-2 border-[#C6A15B]'
                            : 'text-[#F4EFE4]/80 hover:bg-white/[0.05] hover:text-[#DFC283]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-[13px]">{opt.nativeName}</span>
                          <span className="text-[9.5px] text-[#A9A5C5]/60">
                            {opt.englishName} {opt.code === 'en' ? '— default' : ''}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C6A15B]" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Restrained Luxury Consultation CTA */}
            {siteConfig.contact.consultationCta?.actionUrl && (
              <a
                href={siteConfig.contact.consultationCta.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-[10.5px] font-sans font-medium tracking-[0.2em] uppercase text-[#DFC283] border border-[#C6A15B]/40 hover:border-[#C6A15B] hover:text-[#080B1A] hover:bg-[#C6A15B] transition-all duration-300 rounded-[1px]"
              >
                {t.nav.bookConsultation}
              </a>
            )}
          </nav>

          {/* Mobile Right Controls: Compact Language Switcher & Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Quick Language Toggle Button for Mobile */}
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-[2px] bg-[#0F0E20]/70 border border-[#C6A15B]/35 text-[#DFC283] text-[10.5px] font-sans tracking-wider"
              aria-expanded={langMenuOpen}
              aria-label="Language / மொழி"
            >
              <Languages className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span className="font-medium text-[#FFF8EB]">{currentLanguageOption.nativeName}</span>
              <ChevronDown className="w-2.5 h-2.5 text-[#C6A15B]/70" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                setLangMenuOpen(false)
              }}
              className="p-1.5 text-[#FFF8EB] hover:text-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B] rounded-[2px]"
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

        {/* Mobile Quick Dropdown from Top Bar */}
        {langMenuOpen && (
          <div className="md:hidden mt-2 p-2 bg-[#0B0D1F] border border-[#C6A15B]/40 rounded-[2px] shadow-2xl z-50">
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((opt) => {
                const isSelected = language === opt.code
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLanguage(opt.code)
                      setLangMenuOpen(false)
                    }}
                    className={`px-3 py-2 text-left rounded-[1px] text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#C6A15B] text-[#080B1A] font-semibold'
                        : 'bg-[#17152F]/40 border border-white/[0.06] text-[#F4EFE4] hover:border-[#C6A15B]/40'
                    }`}
                  >
                    <span>{opt.nativeName}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#080B1A]" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Mobile Navigation Modal Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed inset-0 top-[52px] z-50 bg-[#080B1A]/98 backdrop-blur-2xl border-t border-white/[0.08] px-6 py-6 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="space-y-6">
            <nav className="flex flex-col space-y-1">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#C6A15B]/70 mb-2 block">
                Menu Navigation
              </span>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-cinzel tracking-[0.14em] text-[#FFF8EB] hover:text-[#C6A15B] py-3 border-b border-white/[0.05] transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-[#C6A15B]/50">→</span>
                </a>
              ))}
            </nav>

            {/* Language Switcher Section inside Mobile Drawer */}
            <div className="pt-2">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#C6A15B]/70 mb-3 block">
                Select Language / மொழி
              </span>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((opt) => {
                  const isSelected = language === opt.code
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setLanguage(opt.code)
                        setMobileMenuOpen(false)
                      }}
                      className={`px-3 py-2.5 rounded-[2px] text-xs font-sans text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#C6A15B] text-[#080B1A] font-semibold shadow-md'
                          : 'bg-[#0F0E20] border border-white/[0.08] text-[#F4EFE4] hover:border-[#C6A15B]/50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-[13px]">{opt.nativeName}</span>
                        <span className={`text-[9.5px] ${isSelected ? 'text-[#080B1A]/80' : 'text-[#A9A5C5]/60'}`}>
                          {opt.englishName}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#080B1A]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
 
          {/* Mobile Footer & Quick Contact */}
          <div className="pt-6 border-t border-white/[0.08] space-y-4">
            {siteConfig.contact.consultationCta?.actionUrl && (
              <a
                href={siteConfig.contact.consultationCta.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-3.5 text-xs font-sans font-medium tracking-[0.2em] uppercase text-[#080B1A] bg-[#C6A15B] hover:bg-[#DFC283] rounded-[1px] shadow-lg transition-colors"
              >
                {t.nav.bookConsultation}
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

            <div className="text-center pt-1">
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
