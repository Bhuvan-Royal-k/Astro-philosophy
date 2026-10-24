export type Language = 'en' | 'ta' | 'kn' | 'te' | 'ml' | 'hi'

export interface LanguageOption {
  code: Language
  label: string
  nativeName: string
  englishName: string
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', englishName: 'English' },
  { code: 'ta', label: 'தமிழ்', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'te', label: 'తెలుగు', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { code: 'ml', label: 'മലയാളം', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'hi', label: 'हिन्दी', nativeName: 'हिन्दी', englishName: 'Hindi' },
]

export interface ServiceTranslation {
  title: string
  subtitle: string
  description: string
  highlights: string[]
  whatsAppMessage: string
}

export interface TranslationDictionary {
  nav: {
    home: string
    about: string
    services: string
    contact: string
    bookConsultation: string
    translateBtn: string
  }
  hero: {
    eyebrow: string
    title: string
    tagline: string
    scrollHint: string
    arrivalMilestone: string
    bookReading: string
    viewServices: string
  }
  about: {
    badge: string
    title: string
    subtitle: string
    paragraphs: [string, string]
    principles: [
      { title: string; description: string },
      { title: string; description: string },
      { title: string; description: string }
    ]
    quote: {
      text: string
      source: string
    }
  }
  journey: {
    badge: string
    title: string
    subtitle: string
    experienceLabel: string
    experienceSubtext: string
    poojasLabel: string
    poojasSubtext: string
    devPlaceholderNotice?: string
  }
  services: {
    badge: string
    title: string
    subtitle: string
    categories: {
      all: string
      readings: string
      renewal: string
      prayers: string
    }
    inquireWhatsApp: string
    methodologyNote: string
    items: {
      'shell-reading': ServiceTranslation
      'love-readings': ServiceTranslation
      'tarot-card-reading': ServiceTranslation
      'palm-reading': ServiceTranslation
      'face-reading': ServiceTranslation
      'psychic-readings': ServiceTranslation
      'spiritual-reading': ServiceTranslation
      'bad-vibes-removal': ServiceTranslation
      'get-rid-of-negativity': ServiceTranslation
      'hanuman-protection-prayers': ServiceTranslation
      'kali-protection-prayers': ServiceTranslation
      'shiva-protection-prayers': ServiceTranslation
      'special-indrajaal-prayers': ServiceTranslation
      [key: string]: ServiceTranslation
    }
  }
  contact: {
    badge: string
    title: string
    subtitle: string
    locationCard: {
      title: string
      getDirections: string
    }
    phoneCard: {
      title: string
      sub: string
    }
    whatsappCard: {
      title: string
      sub: string
      cta: string
    }
    timingsCard: {
      title: string
      hours: string
      note: string
    }
    form: {
      title: string
      subtitle: string
      fullNameLabel: string
      fullNamePlaceholder: string
      phoneLabel: string
      phonePlaceholder: string
      serviceLabel: string
      selectServicePrompt: string
      dateLabel: string
      timeLabel: string
      timeOptions: {
        morning: string
        afternoon: string
        evening: string
      }
      notesLabel: string
      notesPlaceholder: string
      submitBtn: string
      privacyNote: string
      errors: {
        nameRequired: string
        phoneRequired: string
        phoneInvalid: string
        serviceRequired: string
      }
    }
  }
  footer: {
    tagline: string
    subTagline: string
    navTitle: string
    contactTitle: string
    disclaimer: string
    copyright: string
    privacyPolicy: string
    termsOfGuidance: string
    consultationEthics: string
  }
}
