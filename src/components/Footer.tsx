import React from 'react'
import { siteConfig } from '../config/site'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const { contact } = siteConfig
  const { t } = useLanguage()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navItems = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.contact, href: '#contact' },
  ]

  const legalLinks = [
    { label: t.footer.privacyPolicy, href: '#privacy' },
    { label: t.footer.termsOfGuidance, href: '#terms' },
    { label: t.footer.consultationEthics, href: '#ethics' },
  ]

  return (
    <footer className="relative bg-[#04060F] text-[#F4EFE4] border-t border-white/[0.08] pt-16 pb-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 shrink-0 relative flex items-center justify-center">
                <img
                  src="/assets/images/astro-philosophy-logo.png"
                  alt="Astro Philosophy Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(198,161,91,0.3)]"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/assets/images/favicon.svg'
                  }}
                />
              </div>
              <span className="text-base font-cinzel font-medium tracking-[0.2em] text-[#FFF8EB]">
                {siteConfig.meta.siteName}
              </span>
            </div>

            <p className="text-xs font-sans text-[#A9A5C5] leading-relaxed max-w-sm">
              {t.footer.subTagline}
            </p>

            <div className="pt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-[1px] text-[9.5px] font-sans font-medium tracking-[0.2em] uppercase text-[#DFC283] border border-[#C6A15B]/25">
                {t.hero.eyebrow}
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-cinzel font-medium uppercase tracking-[0.22em] text-[#DFC283]">
              {t.footer.navTitle}
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-xs font-sans text-[#A9A5C5] hover:text-[#F4EFE4] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Consultations */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-cinzel font-medium uppercase tracking-[0.22em] text-[#DFC283]">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-2 text-xs font-sans text-[#A9A5C5]">
              {contact.phone && (
                <p>
                  {t.contact.phoneCard.title}:{' '}
                  <a
                    href={contact.phoneTel || `tel:${contact.phone}`}
                    className="text-[#F4EFE4] hover:text-[#DFC283] transition-colors"
                  >
                    {contact.phoneDisplay || contact.phone}
                  </a>
                </p>
              )}

              {contact.whatsappUrl && (
                <p>
                  {t.contact.whatsappCard.title}:{' '}
                  <a
                    href={contact.consultationCta?.actionUrl || contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DFC283] hover:text-[#F4EFE4] transition-colors"
                  >
                    {contact.whatsappNumber}
                  </a>
                </p>
              )}

              {contact.address && (
                <div className="pt-1 space-y-1">
                  <p className="text-[#F4EFE4]/80 leading-relaxed">
                    {contact.address.line1}
                    <br />
                    {contact.address.cityStateZip}
                  </p>
                  {contact.address.mapsUrl && (
                    <a
                      href={contact.address.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[10.5px] text-[#DFC283] hover:text-[#F4EFE4] transition-colors"
                    >
                      <span>{t.contact.locationCard.getDirections}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {contact.email && (
                <p>
                  Email:{' '}
                  <a href={`mailto:${contact.email}`} className="text-[#F4EFE4] hover:text-[#DFC283] transition-colors">
                    {contact.email}
                  </a>
                </p>
              )}
            </div>

            {/* Back to Top */}
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center space-x-1.5 text-[10.5px] font-sans uppercase tracking-[0.2em] text-[#DFC283] hover:text-[#F4EFE4] transition-colors group"
                aria-label="Back to top of page"
              >
                <span>{t.nav.home}</span>
                <ArrowUp className="w-3 h-3 transform group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Dynamic Copyright & Astrological Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-xs font-sans text-[#A9A5C5]/80">
              © {currentYear} {t.footer.copyright}
            </p>
            <p className="text-[11px] font-sans text-[#A9A5C5]/60 max-w-2xl leading-relaxed">
              {t.footer.disclaimer}
            </p>
          </div>

          {/* Legal / Ethics Links */}
          <div className="flex items-center space-x-5">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10.5px] font-sans text-[#A9A5C5]/70 hover:text-[#DFC283] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
