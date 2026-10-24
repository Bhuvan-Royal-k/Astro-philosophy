import React, { useState } from 'react'
import { siteConfig } from '../config/site'
import { Phone, MessageSquare, MapPin, ExternalLink, Send, Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export const ContactSection: React.FC = () => {
  const { contact, services } = siteConfig
  const { t, language } = useLanguage()

  const [selectedServiceId, setSelectedServiceId] = useState(services.items[0]?.id || 'shell-reading')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  })
  const [inquiryOpened, setInquiryOpened] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const getLocalizedServiceTitle = (svcId: string): string => {
    const item = t.services.items[svcId]
    if (item) return item.title
    const fallback = services.items.find((s) => s.id === svcId)
    return fallback?.title || svcId
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setValidationError(t.contact.form.errors.nameRequired)
      return
    }

    setValidationError(null)

    const serviceTitle = getLocalizedServiceTitle(selectedServiceId)
    const lines: string[] = []

    // Localized message composition based on selected language
    switch (language) {
      case 'ta':
        lines.push(`வணக்கம் Astro Philosophy, ஆலோசனை முன்பதிவு விவரங்களை அறிய விரும்புகிறேன்.`)
        lines.push(``)
        lines.push(`*பெயர்:* ${formData.name.trim()}`)
        if (formData.phone.trim()) lines.push(`*தொலைபேசி:* ${formData.phone.trim()}`)
        lines.push(`*தேர்ந்தெடுத்த சேவை:* ${serviceTitle}`)
        if (formData.preferredDate.trim()) lines.push(`*விருப்பமான தேதி:* ${formData.preferredDate.trim()}`)
        if (formData.preferredTime.trim()) lines.push(`*விருப்பமான நேரம்:* ${formData.preferredTime.trim()}`)
        if (formData.notes.trim()) lines.push(`*குறிப்புகள்:* ${formData.notes.trim()}`)
        lines.push(``)
        lines.push(`தயவுசெய்து கிடைக்கும் நேரம் மற்றும் ஆலோசனை விவரங்களைப் பகிருங்கள்.`)
        break

      case 'kn':
        lines.push(`ನಮಸ್ಕಾರ Astro Philosophy, ಸಮಾಲೋಚನೆ ಮುಂಗಡ ಕಾಯ್ದಿರಿಸುವಿಕೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೇನೆ.`)
        lines.push(``)
        lines.push(`*ಹೆಸರು:* ${formData.name.trim()}`)
        if (formData.phone.trim()) lines.push(`*ದೂರವಾಣಿ:* ${formData.phone.trim()}`)
        lines.push(`*ಆಯ್ದ ಸೇವೆ:* ${serviceTitle}`)
        if (formData.preferredDate.trim()) lines.push(`*ದಿನಾಂಕ:* ${formData.preferredDate.trim()}`)
        if (formData.preferredTime.trim()) lines.push(`*ಸಮಯ:* ${formData.preferredTime.trim()}`)
        if (formData.notes.trim()) lines.push(`*ವಿವರಗಳು:* ${formData.notes.trim()}`)
        lines.push(``)
        lines.push(`ದಯವಿಟ್ಟು ಲಭ್ಯವಿರುವ ಸಮಯ ಮತ್ತು ಸಮಾಲೋಚನೆ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.`)
        break

      case 'te':
        lines.push(`నమస్కారం Astro Philosophy, సంప్రదింపుల వివరాలను తెలుసుకోవాలనుకుంటున్నాను.`)
        lines.push(``)
        lines.push(`*పేరు:* ${formData.name.trim()}`)
        if (formData.phone.trim()) lines.push(`*ఫోన్:* ${formData.phone.trim()}`)
        lines.push(`*ఎంచుకున్న సేవ:* ${serviceTitle}`)
        if (formData.preferredDate.trim()) lines.push(`*తేదీ:* ${formData.preferredDate.trim()}`)
        if (formData.preferredTime.trim()) lines.push(`*సమయం:* ${formData.preferredTime.trim()}`)
        if (formData.notes.trim()) lines.push(`*వివరాలు:* ${formData.notes.trim()}`)
        lines.push(``)
        lines.push(`దయచేసి సంప్రదింపుల వివరాలు మరియు లభ్యతను తెలియజేయండి.`)
        break

      case 'ml':
        lines.push(`നമസ്കാരം Astro Philosophy, കൂടിയാലോചന സംബന്ധിച്ച വിവരങ്ങൾ അറിയാൻ ആഗ്രഹിക്കുന്നു.`)
        lines.push(``)
        lines.push(`*പേര്:* ${formData.name.trim()}`)
        if (formData.phone.trim()) lines.push(`*ഫോൺ:* ${formData.phone.trim()}`)
        lines.push(`*തിരഞ്ഞെടുത്ത സേവനം:* ${serviceTitle}`)
        if (formData.preferredDate.trim()) lines.push(`*തീയതി:* ${formData.preferredDate.trim()}`)
        if (formData.preferredTime.trim()) lines.push(`*സമയം:* ${formData.preferredTime.trim()}`)
        if (formData.notes.trim()) lines.push(`*വിവരങ്ങൾ:* ${formData.notes.trim()}`)
        lines.push(``)
        lines.push(`ദയവായി ലഭ്യമായ സമയവും കൂടിയാലോചന വിവരങ്ങളും അറിയിക്കുക.`)
        break

      case 'hi':
        lines.push(`नमस्ते Astro Philosophy, मैं परामर्श सत्र के संबंध में जानकारी प्राप्त करना चाहता/चाहती हूँ।`)
        lines.push(``)
        lines.push(`*नाम:* ${formData.name.trim()}`)
        if (formData.phone.trim()) lines.push(`*फ़ोन:* ${formData.phone.trim()}`)
        lines.push(`*चयनित सेवा:* ${serviceTitle}`)
        if (formData.preferredDate.trim()) lines.push(`*दिनांक:* ${formData.preferredDate.trim()}`)
        if (formData.preferredTime.trim()) lines.push(`*समय:* ${formData.preferredTime.trim()}`)
        if (formData.notes.trim()) lines.push(`*टिप्पणी:* ${formData.notes.trim()}`)
        lines.push(``)
        lines.push(`कृपया परामर्श विवरण और उपलब्ध समय साझा करें।`)
        break

      default: // English
        lines.push(`Hello Astro Philosophy, I would like to enquire about scheduling a consultation.`)
        lines.push(``)
        lines.push(`*Name:* ${formData.name.trim()}`)
        if (formData.phone.trim()) lines.push(`*Phone:* ${formData.phone.trim()}`)
        lines.push(`*Service:* ${serviceTitle}`)
        if (formData.preferredDate.trim()) lines.push(`*Preferred Date:* ${formData.preferredDate.trim()}`)
        if (formData.preferredTime.trim()) lines.push(`*Preferred Time:* ${formData.preferredTime.trim()}`)
        if (formData.notes.trim()) lines.push(`*Notes:* ${formData.notes.trim()}`)
        lines.push(``)
        lines.push(`Please share consultation details and upcoming availability.`)
        break
    }

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
              {t.contact.badge}
            </span>
            <div className="w-4 h-[1px] bg-[#C6A15B]/40" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-medium tracking-wide text-[#F4EFE4] mb-4">
            {t.contact.title}
          </h2>

          <p className="text-sm sm:text-base font-serif-body italic text-[#A9A5C5] leading-relaxed max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Contact Info & Coordinates Address */}
          <div className="lg:col-span-5 space-y-6">
            <div className="editorial-panel p-7 sm:p-8 rounded-[2px]">
              <h3 className="text-base sm:text-lg font-cinzel text-[#DFC283] mb-5 tracking-wide">
                {t.contact.phoneCard.title} & {t.contact.locationCard.title}
              </h3>

              <div className="space-y-4">
                {/* Telephone */}
                {hasPhone && (
                  <div className="flex items-start space-x-3.5 pb-4 border-b border-white/[0.05]">
                    <Phone className="w-4 h-4 text-[#C6A15B]/80 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        {t.contact.phoneCard.title}
                      </span>
                      <a
                        href={contact.phoneTel || `tel:${contact.phone}`}
                        className="text-xs sm:text-sm font-sans font-medium text-[#F4EFE4] hover:text-[#DFC283] transition-colors"
                      >
                        {contact.phoneDisplay || contact.phone}
                      </a>
                      <span className="text-[10px] text-[#A9A5C5]/60 block mt-0.5">
                        {t.contact.phoneCard.sub}
                      </span>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                {hasWhatsapp && (
                  <div className="flex items-start space-x-3.5 pb-4 border-b border-white/[0.05]">
                    <MessageSquare className="w-4 h-4 text-[#C6A15B]/80 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        {t.contact.whatsappCard.title}
                      </span>
                      <a
                        href={contact.consultationCta?.actionUrl || contact.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-sans font-medium text-[#DFC283] hover:text-[#F4EFE4] transition-colors inline-flex items-center space-x-1.5"
                      >
                        <span>{contact.whatsappNumber}</span>
                        <span className="text-[10px] text-[#C6A15B]/70">({t.contact.whatsappCard.cta})</span>
                      </a>
                      <span className="text-[10px] text-[#A9A5C5]/60 block mt-0.5">
                        {t.contact.whatsappCard.sub}
                      </span>
                    </div>
                  </div>
                )}

                {/* Physical Address & Coordinates Google Maps Link */}
                {hasAddress && (
                  <div className="flex items-start space-x-3.5 pb-4 border-b border-white/[0.05]">
                    <MapPin className="w-4 h-4 text-[#C6A15B]/80 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                        {t.contact.locationCard.title}
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
                          <span>{t.contact.locationCard.getDirections}</span>
                          <ExternalLink className="w-3 h-3 text-[#C6A15B]" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Timings */}
                <div className="flex items-start space-x-3.5">
                  <div>
                    <span className="text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#A9A5C5]/70 block mb-0.5">
                      {t.contact.timingsCard.title}
                    </span>
                    <p className="text-xs sm:text-sm font-sans text-[#F4EFE4]/85">
                      {t.contact.timingsCard.hours}
                    </p>
                    <p className="text-[10px] font-sans text-[#C6A15B]/80 mt-0.5">
                      {t.contact.timingsCard.note}
                    </p>
                  </div>
                </div>

                {/* Email (Rendered only if configured) */}
                {hasEmail && (
                  <div className="flex items-start space-x-3.5 pt-3 border-t border-white/[0.05]">
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
              </div>
            </div>
          </div>

          {/* Right Column: Consultation Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="editorial-panel p-7 sm:p-8 rounded-[2px]">
              <h3 className="text-base sm:text-lg font-cinzel text-[#DFC283] mb-1 tracking-wide">
                {t.contact.form.title}
              </h3>
              <p className="text-xs font-sans text-[#A9A5C5] mb-6">
                {t.contact.form.subtitle}
              </p>

              {validationError && (
                <div className="mb-4 p-3 rounded-[1px] bg-red-950/40 border border-red-500/30 text-red-200 text-xs font-sans">
                  {validationError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#C6A15B] mb-1">
                    {t.contact.form.fullNameLabel} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (validationError) setValidationError(null)
                    }}
                    placeholder={t.contact.form.fullNamePlaceholder}
                    className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] placeholder-white/20 focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#C6A15B] mb-1">
                    {t.contact.form.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.contact.form.phonePlaceholder}
                    className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] placeholder-white/20 focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#C6A15B] mb-1">
                    {t.contact.form.serviceLabel} *
                  </label>
                  <select
                    id="service"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026] border border-white/10 text-[#F4EFE4] focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                  >
                    {services.items.map((svc) => {
                      const localized = t.services.items[svc.id] || svc
                      return (
                        <option key={svc.id} value={svc.id} className="bg-[#080B1A] text-[#F4EFE4]">
                          {localized.title} ({localized.subtitle})
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Scheduling Details */}
                <div className="pt-2 pb-1 border-t border-white/[0.05]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="preferredDate" className="block text-[9.5px] font-sans uppercase tracking-[0.16em] text-[#C6A15B]/90 mb-1">
                        {t.contact.form.dateLabel}
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026]/40 border border-white/10 text-[#F4EFE4] focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferredTime" className="block text-[9.5px] font-sans uppercase tracking-[0.16em] text-[#C6A15B]/90 mb-1">
                        {t.contact.form.timeLabel}
                      </label>
                      <select
                        id="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-[2px] bg-[#0C1026] border border-white/10 text-[#F4EFE4] focus:border-[#C6A15B] focus:outline-none text-xs sm:text-sm font-sans transition-colors"
                      >
                        <option value="">— {t.contact.form.timeLabel} —</option>
                        <option value={t.contact.form.timeOptions.morning}>
                          {t.contact.form.timeOptions.morning}
                        </option>
                        <option value={t.contact.form.timeOptions.afternoon}>
                          {t.contact.form.timeOptions.afternoon}
                        </option>
                        <option value={t.contact.form.timeOptions.evening}>
                          {t.contact.form.timeOptions.evening}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-[10px] font-sans uppercase tracking-[0.18em] text-[#C6A15B] mb-1">
                    {t.contact.form.notesLabel}
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t.contact.form.notesPlaceholder}
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
                        <span>{t.contact.whatsappCard.cta}...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#080B1A]" />
                        <span>{t.contact.form.submitBtn}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] font-sans text-center text-[#A9A5C5]/70 mt-2">
                    {t.contact.form.privacyNote}
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
