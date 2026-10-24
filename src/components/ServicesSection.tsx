import React, { useState } from 'react'
import { siteConfig, ServiceItem } from '../config/site'
import { ArrowUpRight, MessageSquare } from 'lucide-react'

export const ServicesSection: React.FC = () => {
  const { services, contact } = siteConfig
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredItems = selectedCategory === 'all'
    ? services.items
    : services.items.filter((item) => item.category === selectedCategory)

  const getWhatsAppInquiryUrl = (service: ServiceItem) => {
    const rawNumber = contact.phone?.replace(/[^0-9]/g, '') || '919108901714'
    const message = `Hello Astro Philosophy, I would like to enquire about ${service.title}. Please share the details.`
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <section
      id="services"
      className="relative py-24 md:py-32 bg-[#04060F] text-[#F4EFE4] overflow-hidden"
      aria-label="Astrological Consultations and Services"
    >
      {/* Restrained background ambient glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(23,21,47,0.35)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-3 mb-3">
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#C6A15B]/85">
              {services.badge}
            </span>
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-medium tracking-wide text-[#F4EFE4] mb-4">
            {services.title}
          </h2>

          <p className="text-sm sm:text-base font-serif-body italic text-[#A9A5C5] leading-relaxed max-w-2xl mx-auto">
            {services.subtitle}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        {services.categories && services.categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10 sm:mb-14">
            {services.categories.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-[1px] text-[10.5px] font-sans tracking-[0.16em] uppercase transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C6A15B] text-[#080B1A] font-medium shadow-md shadow-black/30'
                      : 'bg-[#0F0E20]/60 border border-white/[0.08] text-[#A9A5C5] hover:text-[#F4EFE4] hover:border-[#C6A15B]/40'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Responsive Grid Layout (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-16">
          {filteredItems.map((service, index) => (
            <div
              key={service.id}
              className="editorial-card p-6 sm:p-7 flex flex-col justify-between group rounded-[2px]"
            >
              <div>
                {/* Header row: Index & Subtitle */}
                <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-white/[0.06]">
                  <span className="text-[11px] font-cinzel text-[#C6A15B]/70 tracking-[0.15em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70">
                    {service.subtitle}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-base sm:text-lg font-cinzel font-medium text-[#F4EFE4] group-hover:text-[#DFC283] transition-colors mb-2.5 leading-snug">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-[13px] font-sans text-[#A9A5C5] leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Focus points / Highlights */}
                {service.highlights && service.highlights.length > 0 && (
                  <ul className="space-y-1.5 mb-6 text-[11.5px] font-sans text-[#F4EFE4]/70">
                    {service.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#C6A15B] text-[10px] leading-none mt-1">✦</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Link: Direct WhatsApp Inquiry */}
              <div className="pt-3.5 border-t border-white/[0.06]">
                <a
                  href={getWhatsAppInquiryUrl(service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-[10.5px] font-sans font-medium tracking-[0.18em] uppercase text-[#DFC283] hover:text-[#F4EFE4] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C6A15B]/80" />
                  <span>Inquire via WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quiet Editorial Methodology Note */}
        <div className="py-6 border-t border-b border-white/[0.06] max-w-2xl mx-auto text-center px-4">
          <p className="text-xs sm:text-sm font-serif-body italic text-[#DFC283]/85 leading-relaxed">
            All consultations and ceremonial prayers are traditional interpretive and contemplative practices offered for personal reflection. Sessions and private prayer services are scheduled by prior appointment.
          </p>
        </div>

      </div>
    </section>
  )
}

export default ServicesSection
