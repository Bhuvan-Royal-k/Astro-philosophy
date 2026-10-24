import React, { useState } from 'react'
import { siteConfig } from '../config/site'
import { Phone, MessageSquare, MapPin, ExternalLink, Send, Check } from 'lucide-react'

export const ContactSection: React.FC = () => {
  const { contact, services } = siteConfig

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    serviceInterest: services.items[0]?.title || 'Shell Reading',
    notes: '',
  })
  const [inquiryOpened, setInquiryOpened] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Compose inquiry text, including optional birth details only if provided
    const lines: string[] = [
      `Hello Astro Philosophy, I would like to enquire about scheduling a consultation.`,
      ``,
      `*Name:* ${formData.name.trim()}`,
      `*Service:* ${formData.serviceInterest || 'General Inquiry'}`,
    ]

    if (formData.birthDate.trim()) {
      lines.push(`*Date of Birth:* ${formData.birthDate.trim()}`)
    }
    if (formData.birthTime.trim()) {
      lines.push(`*Time of Birth:* ${formData.birthTime.trim()}`)
    }
    if (formData.birthPlace.trim()) {
      lines.push(`*Place of Birth:* ${formData.birthPlace.trim()}`)
    }
    if (formData.notes.trim()) {
      lines.push(`*Notes:* ${formData.notes.trim()}`)
    }

    lines.push(``)
    lines.push(`Please share consultation details and upcoming availability.`)

    const message = lines.join('\n')
    const rawNumber = contact.phone?.replace(/[^0-9]/g, '') || '919108901714'
    const waUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`

    // Open WhatsApp with prefilled message
    window.open(waUrl, '_blank')
    setInquiryOpened(true)
  }

  // Check if optional contact channels are configured
  const hasPhone = Boolean(contact.phone && contact.phone.trim() !== '')
  const hasWhatsapp = Boolean(contact.whatsappUrl && contact.whatsappUrl.trim() !== '')
  const hasEmail = Boolean(contact.email && contact.email.trim() !== '')
  const hasAddress = Boolean(contact.address && contact.address.full.trim() !== '')
  const hasTimings = Boolean(contact.timings && contact.timings.trim() !== '')

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 bg-[#080B1A] text-[#F4EFE4] overflow-hidden"
      aria-label="Contact and Appointment Booking"
    >
      {/* Restrained background ambient glow */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(23,21,47,0.35)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-3 mb-3">
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-[#C6A15B]/85">
              {contact.badge}
            </span>
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-medium tracking-wide text-[#F4EFE4] mb-4">
            {contact.title}
          </h2>

          <p className="text-sm sm:text-base font-serif-body italic text-[#A9A5C5] leading-relaxed max-w-2xl mx-auto">
            {contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Direct Contact Info & Verified Address */}
          <div className="lg:col-span-5 space-y-6">
            <div className="editorial-panel p-7 sm:p-8 rounded-[2px]">
              <h3 className="text-base sm:text-lg font-cinzel text-[#DFC283] mb-5 tracking-wide">
                Direct Contact
              </h3>

              <div className="space-y-4">
                {/* Telephone */}
                {hasPhone && (
                  <div className="flex items-start space-x-3.5 pb-4 border-b border-white/[0.05]">
                    <Phone className="w-4 h-4 text-[#C6A15B]/80 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        Telephone
                      </span>
                      <a
                        href={contact.phoneTel || `tel:${contact.phone}`}
                        className="text-xs sm:text-sm font-sans font-medium text-[#F4EFE4] hover:text-[#DFC283] transition-colors"
                      >
                        {contact.phoneDisplay || contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                {hasWhatsapp && (
                  <div className="flex items-start space-x-3.5 pb-4 border-b border-white/[0.05]">
                    <MessageSquare className="w-4 h-4 text-[#C6A15B]/80 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        WhatsApp Consultation
                      </span>
                      <a
                        href={contact.consultationCta?.actionUrl || contact.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-sans font-medium text-[#DFC283] hover:text-[#F4EFE4] transition-colors inline-flex items-center space-x-1"
                      >
                        <span>{contact.whatsappNumber}</span>
                        <span className="text-[10px] text-[#C6A15B]/70">({contact.whatsappLabel})</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Physical Address & Google Maps Link */}
                {hasAddress && (
                  <div className="flex items-start space-x-3.5 pb-4 border-b border-white/[0.05]">
                    <MapPin className="w-4 h-4 text-[#C6A15B]/80 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        Address
                      </span>
                      <p className="text-xs sm:text-sm font-sans text-[#F4EFE4]/90 leading-relaxed">
                        {contact.address.line1}
                        <br />
                        {contact.address.cityStateZip}
                      </p>
                      {contact.address.mapsUrl && (
                        <a
                          href={contact.address.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-[10.5px] font-sans font-medium tracking-[0.14em] uppercase text-[#DFC283] hover:text-[#F4EFE4] transition-colors pt-1"
                        >
                          <span>Directions on Google Maps</span>
                          <ExternalLink className="w-3 h-3 text-[#C6A15B]" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Email (Rendered only if configured; hidden when blank) */}
                {hasEmail && (
                  <div className="flex items-start space-x-3.5 pb-4 border-b border-white/[0.05]">
                    <div>
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        Email
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-xs sm:text-sm font-sans font-medium text-[#F4EFE4] hover:text-[#DFC283] transition-colors"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Timings (Rendered only if configured; hidden when empty) */}
                {hasTimings && (
                  <div className="flex items-start space-x-3.5">
                    <div>
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        Hours
                      </span>
                      <p className="text-xs sm:text-sm font-sans text-[#F4EFE4]/85">
                        {contact.timings}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirement Note */}
              {contact.consultationCta?.note && (
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-xs font-serif-body italic text-[#A9A5C5] leading-relaxed">
                    {contact.consultationCta.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Consultation Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="editorial-panel p-7 sm:p-8 rounded-[2px]">
              <h3 className="text-base sm:text-lg font-cinzel text-[#DFC283] mb-1 tracking-wide">
                Prepare Your Consultation Inquiry
              </h3>
              <p className="text-xs font-sans text-[#A9A5C5] mb-6">
                Fill in your details below to compose a direct inquiry for Astro Philosophy. Submitting will open WhatsApp with your message ready to send.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#C6A15B] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] placeholder-white/20 focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#C6A15B] mb-1">
                    Selected Service *
                  </label>
                  <select
                    id="service"
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026] border border-white/10 text-[#F4EFE4] focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                  >
                    {services.items.map((svc) => (
                      <option key={svc.id} value={svc.title} className="bg-[#080B1A] text-[#F4EFE4]">
                        {svc.title} ({svc.subtitle})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Birth Details (Excluded from message when left blank) */}
                <div className="pt-2 pb-1 border-t border-white/[0.05]">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-2">
                    Optional Birth Information (If seeking chart-specific reflection)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="birthDate" className="block text-[9.5px] font-sans uppercase tracking-[0.16em] text-[#C6A15B]/90 mb-1">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="birthTime" className="block text-[9.5px] font-sans uppercase tracking-[0.16em] text-[#C6A15B]/90 mb-1">
                        Time of Birth (Optional)
                      </label>
                      <input
                        type="time"
                        id="birthTime"
                        value={formData.birthTime}
                        onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="birthPlace" className="block text-[9.5px] font-sans uppercase tracking-[0.16em] text-[#C6A15B]/90 mb-1">
                      Place of Birth (Optional)
                    </label>
                    <input
                      type="text"
                      id="birthPlace"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      placeholder="e.g. Bengaluru, India"
                      className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] placeholder-white/20 focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#C6A15B] mb-1">
                    Specific Questions or Context (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly describe what you would like to explore"
                    className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] placeholder-white/20 focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-[1px] bg-[#C6A15B] hover:bg-[#DFC283] text-[#080B1A] font-sans font-medium text-[11px] uppercase tracking-[0.22em] transition-colors flex items-center justify-center space-x-2"
                  >
                    {inquiryOpened ? (
                      <>
                        <Check className="w-4 h-4 text-[#080B1A]" />
                        <span>Opening WhatsApp with Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#080B1A]" />
                        <span>Continue via WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] font-sans text-center text-[#A9A5C5]/70 mt-2">
                    Clicking opens WhatsApp with your prefilled inquiry. Appointments are confirmed directly upon mutual agreement.
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default ContactSection
