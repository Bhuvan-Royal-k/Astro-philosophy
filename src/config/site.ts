/**
 * ASTRO PHILOSOPHY - CENTRAL SITE CONFIGURATION
 * 
 * Single source of truth for:
 * 1. Business identity & contact info (Phone, WhatsApp, Address, Maps)
 * 2. Cinematic Hero configuration (Desktop 240 frames & Mobile 300 frames)
 * 3. Navigation labels
 * 4. About philosophy narrative & core foundations
 * 5. Services catalogue (13 consultation offerings & prayer ceremonies)
 * 6. Booking destinations & messages
 * 7. Footer disclaimers & legal information
 */

export type CinematicMode = 'video' | 'frame-sequence'

export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  category: 'readings' | 'renewal' | 'prayers'
  description: string
  highlights: string[]
  image: string
  imageAlt: string
}

export interface NavItem {
  label: string
  href: string
}

export interface SiteConfig {
  meta: {
    siteName: string
    shortName: string
    tagline: string
    subTagline: string
    description: string
    tradition: string
    logoImage?: string
  }
  
  /**
   * Hero Cinematic Configuration
   */
  hero: {
    mode: CinematicMode

    video: {
      src: string
      mimeType: string
      mobileSrc?: string
      scrollDistanceMultiplier: number
    }

    frames: {
      dir: string
      prefix: string
      extension: string
      padLength: number
      startIndex: number
      totalFrames: number
      fallbackImage: string
      scrollDistanceMultiplier: number
      mobile?: {
        dir: string
        prefix: string
        extension: string
        padLength: number
        startIndex: number
        totalFrames: number
      }
    }

    overlay: {
      eyebrow: string
      title: string
      tagline: string
      scrollHint: string
      arrivalMilestone: string
    }
  }

  /**
   * Navigation links
   */
  navigation: NavItem[]

  /**
   * Section 2: About Section (Original philosophical copy)
   */
  about: {
    badge: string
    title: string
    subtitle: string
    paragraphs: string[]
    principles: {
      title: string
      description: string
    }[]
    quote?: {
      text: string
      source: string
    }
  }

  /**
   * Section 3: Services Section
   */
  services: {
    badge: string
    title: string
    subtitle: string
    categories: {
      id: string
      label: string
    }[]
    items: ServiceItem[]
  }

  /**
   * Section 4: Contact & Consultations
   * Leave any field empty ('') to automatically hide it from the UI.
   */
  contact: {
    badge: string
    title: string
    subtitle: string
    businessName: string
    phone: string
    phoneDisplay: string
    phoneTel: string
    whatsappNumber: string
    whatsappUrl: string
    whatsappLabel: string
    email?: string // Left blank until user provides
    address: {
      line1: string
      cityStateZip: string
      full: string
      mapsUrl: string
    }
    consultationCta: {
      label: string
      actionUrl: string
      note?: string
    }
    timings?: string
  }

  /**
   * Section 5: Footer
   */
  footer: {
    copyrightText: string
    disclaimer: string
    links: {
      label: string
      href: string
    }[]
  }
}

export const siteConfig: SiteConfig = {
  meta: {
    siteName: "Astro Philosophy",
    shortName: "Astro",
    tagline: "Ancient Wisdom • A More Thoughtful Perspective",
    subTagline: "A reflective space bringing time-honored Indian astrological traditions into meaningful personal clarity.",
    description: "Astro Philosophy offers a considered space for personal reflection, relationship insight, and life guidance rooted in traditional classical Indian astrology.",
    tradition: "South Indian Spiritual Heritage",
    logoImage: "/assets/images/astro-philosophy-logo.png",
  },

  hero: {
    // Mode: 'frame-sequence' (Active) | 'video'
    mode: "frame-sequence",

    video: {
      src: "/assets/video/temple-journey.mp4",
      mimeType: "video/mp4",
      scrollDistanceMultiplier: 2.8,
    },

    frames: {
      // Desktop landscape sequence (1920x1080, 240 frames)
      dir: "/assets/frames",
      prefix: "ezgif-frame-",
      extension: ".jpg",
      padLength: 3,
      startIndex: 1,
      totalFrames: 240,
      fallbackImage: "/assets/images/logo.svg",
      scrollDistanceMultiplier: 2.8,

      // Dedicated mobile portrait sequence (720x1280, 300 frames)
      mobile: {
        dir: "/assets/frames-mobile",
        prefix: "ezgif-frame-",
        extension: ".jpg",
        padLength: 3,
        startIndex: 1,
        totalFrames: 300,
      },
    },

    overlay: {
      eyebrow: "Dravidian Temple Sanctum & Jyotish Shastra",
      title: "ASTRO PHILOSOPHY",
      tagline: "Where the cosmic wheel aligns with your personal destiny.",
      scrollHint: "Scroll to Enter the Temple",
      arrivalMilestone: "Approaching the Inner Sanctum",
    },
  },

  navigation: [
    { label: "Journey", href: "#hero" },
    { label: "Philosophy", href: "#about" },
    { label: "Offerings", href: "#services" },
    { label: "Connect", href: "#contact" },
  ],

  about: {
    badge: "OUR PHILOSOPHY",
    title: "Ancient Wisdom. A More Thoughtful Perspective.",
    subtitle: "A reflective space bringing time-honored Indian astrological traditions into everyday life with calm discernment.",
    paragraphs: [
      "Astro Philosophy brings the enduring traditions of Indian astrology into a thoughtful space for personal reflection and guidance. Rooted in an appreciation of celestial patterns and classical knowledge, our approach invites you to explore life's questions with greater perspective.",
      "Every journey is personal. Our aim is to offer a considered space to reflect on relationships, work, important transitions, and the choices that shape your path.",
      "Astrology is presented as a traditional interpretive practice, not a substitute for professional medical, legal, financial, or mental-health advice. Your choices and practical judgment remain your own."
    ],
    principles: [
      {
        title: "Classical Traditions",
        description: "Grounded in the foundational principles of Indian astrological contemplation, reading celestial patterns with quiet reverence and restraint."
      },
      {
        title: "Personal Perspective",
        description: "A respectful space to examine relationship patterns, professional turning points, and major transitions with grounded clarity."
      },
      {
        title: "Informed Agency",
        description: "Viewing traditional insight not as fatalistic certainty, but as a contemplative mirror that honors your personal free will and decision-making."
      }
    ],
    quote: {
      text: "Astrology at its best is not a rigid decree; it is a thoughtful mirror held up to the seasons and choices of life.",
      source: "Astro Philosophy Contemplation"
    }
  },

  services: {
    badge: "SERVICES & CEREMONIES",
    title: "Consultations & Spiritual Offerings",
    subtitle: "Individual interpretive consultations and classical prayer ceremonies conducted with care, respect, and confidentiality.",
    categories: [
      { id: "all", label: "All Offerings (13)" },
      { id: "readings", label: "Readings & Consultations" },
      { id: "renewal", label: "Renewal & Harmonizing" },
      { id: "prayers", label: "Traditional Prayers" },
    ],
    items: [
      {
        id: "shell-reading",
        title: "Shell Reading",
        subtitle: "Traditional Divination",
        category: "readings",
        description: "An interpretive session using traditional cowrie shell patterns to encourage contemplative reflection and offer intuitive perspective on personal questions.",
        image: "/assets/services/shell-reading.webp",
        imageAlt: "Sacred cowrie shell divination on midnight-indigo silk with brass oil lamp",
        highlights: [
          "Classical symbolic interpretation",
          "Reflective inquiry into life crossroads",
          "Perspective on present questions"
        ]
      },
      {
        id: "love-readings",
        title: "Love Readings",
        subtitle: "Relationship Reflection",
        category: "readings",
        description: "A thoughtful exploration of interpersonal dynamics, emotional patterns, and shared perspectives to help bring clarity to relationship choices.",
        image: "/assets/services/love-readings.webp",
        imageAlt: "Twin antique brass peacock diya lamps with harmonizing golden flames and rose petals",
        highlights: [
          "Interpersonal communication patterns",
          "Clarity on emotional crossroads",
          "Thoughtful reflection on mutual alignment"
        ]
      },
      {
        id: "tarot-card-reading",
        title: "Tarot Card Reading",
        subtitle: "Symbolic Interpretation",
        category: "readings",
        description: "A structured card-based consultation using traditional archetypes to explore life themes, upcoming transitions, and creative options.",
        image: "/assets/services/tarot-reading.webp",
        imageAlt: "Archetypal tarot cards with antique gold foil borders and celestial constellations",
        highlights: [
          "Archetypal life imagery",
          "Perspective on personal dilemmas",
          "Constructive self-reflection"
        ]
      },
      {
        id: "palm-reading",
        title: "Palm Reading",
        subtitle: "Hastarekha Observation",
        category: "readings",
        description: "An ancient practice of examining palm contours and line configurations to reflect upon personal temperament, aptitudes, and life phases.",
        image: "/assets/services/palm-reading.webp",
        imageAlt: "Hastarekha palm reading session showing hand lines and planetary mounts",
        highlights: [
          "Traditional line & mount observation",
          "Natural tendencies and aptitudes",
          "Reflective life-stage mapping"
        ]
      },
      {
        id: "face-reading",
        title: "Face Reading",
        subtitle: "Physiognomic Insight",
        category: "readings",
        description: "Traditional observational analysis of facial features and expressions, offering respectful insights into personal disposition and natural tendencies.",
        image: "/assets/services/face-reading.webp",
        imageAlt: "Sacred South Indian copper alloy sculpture face showing facial contours",
        highlights: [
          "Classical facial contour principles",
          "Temperament & disposition reflection",
          "Supportive self-understanding"
        ]
      },
      {
        id: "psychic-readings",
        title: "Psychic Readings",
        subtitle: "Intuitive Consultation",
        category: "readings",
        description: "An intuitive consultation focused on emotional currents and present circumstances to assist your personal discernment and decision-making.",
        image: "/assets/services/psychic-readings.webp",
        imageAlt: "Classical Indian Ajna brow chakra illustration representing spiritual vision and intuition",
        highlights: [
          "Attuned intuitive perception",
          "Exploration of present emotional focus",
          "Calm, private dialogue"
        ]
      },
      {
        id: "spiritual-reading",
        title: "Spiritual Reading",
        subtitle: "Inner Alignment",
        category: "readings",
        description: "A quiet, reflective session centered on spiritual grounding, core values, and finding clarity during seasons of change or questioning.",
        image: "/assets/services/spiritual-reading.webp",
        imageAlt: "Ancient South Indian palm-leaf manuscript Tala-patra with sacred Vedic verses",
        highlights: [
          "Inner compass contemplation",
          "Mindful personal grounding",
          "Values-aligned decision support"
        ]
      },
      {
        id: "bad-vibes-removal",
        title: "Bad Vibes Removal",
        subtitle: "Cleansing & Renewal",
        category: "renewal",
        description: "Traditional calming practices, meditative intentions, and mindful customs aimed at emotional unburdening and fostering personal peace.",
        image: "/assets/services/bad-vibes-removal.webp",
        imageAlt: "Traditional brass Aarti Thali with ceremonial flame and floral offerings",
        highlights: [
          "Traditional meditative techniques",
          "Fostering inner tranquility",
          "Quiet emotional reset"
        ]
      },
      {
        id: "get-rid-of-negativity",
        title: "Get Rid of Negativity",
        subtitle: "Mindful Harmonizing",
        category: "renewal",
        description: "Reflective spiritual approaches and space-harmonizing rituals designed to cultivate a serene environment and encourage positive focus.",
        image: "/assets/services/get-rid-of-negativity.webp",
        imageAlt: "Laksham Deepam illumination radiating thousands of sacred temple oil lamps",
        highlights: [
          "Space & mindset harmonizing",
          "Encouraging calm daily clarity",
          "Constructive emotional renewal"
        ]
      },
      {
        id: "hanuman-protection-prayers",
        title: "Hanuman Protection Prayers",
        subtitle: "Devotional Strength",
        category: "prayers",
        description: "Traditional devotional chanting and prayer offerings honoring Lord Hanuman, intended to inspire inner fortitude, resilience, and calm courage.",
        image: "/assets/services/hanuman-prayers.webp",
        imageAlt: "11th-century Chola dynasty bronze sculpture of Lord Hanuman in devotional stance",
        highlights: [
          "Classical stotra recitation",
          "Encouraging moral strength & resolve",
          "Traditional devotional sankalpa"
        ]
      },
      {
        id: "kali-protection-prayers",
        title: "Kali Protection Prayers",
        subtitle: "Transformative Grace",
        category: "prayers",
        description: "Sacred classical hymns dedicated to the transformative grace of the Divine Mother, seeking spiritual grounding during challenging periods.",
        image: "/assets/services/kali-prayers.webp",
        imageAlt: "10th-century Chola bronze sculpture of Divine Mother Kali in Chennai Museum",
        highlights: [
          "Ancient protective verses",
          "Spiritual grounding and courage",
          "Reverence for inner resilience"
        ]
      },
      {
        id: "shiva-protection-prayers",
        title: "Shiva Protection Prayers",
        subtitle: "Stillness & Transcendence",
        category: "prayers",
        description: "Meditative Vedic chanting and contemplation dedicated to Lord Shiva, creating a peaceful space for emotional poise and quiet reflection.",
        image: "/assets/services/shiva-prayers.webp",
        imageAlt: "Consecrated sacred Shiva Lingam adorned with vermilion and floral puja offerings",
        highlights: [
          "Peace-bestowing traditional mantras",
          "Cultivating stillness & serenity",
          "Contemplative prayer space"
        ]
      },
      {
        id: "special-indrajaal-prayers",
        title: "Special Indrajaal Prayers",
        subtitle: "Traditional Sacred Rituals",
        category: "prayers",
        description: "Classical ceremonial prayers and time-honored spiritual rituals performed with mindful reverence to invoke balance, protection, and harmony.",
        image: "/assets/services/special-indrajaal-prayers.webp",
        imageAlt: "19th-century bronze Maha Meru Shri Yantra sacred ritual mandala",
        highlights: [
          "Traditional ceremonial prayer practice",
          "Time-honored restorative chants",
          "Spiritual balance and alignment"
        ]
      }
    ]
  },

  contact: {
    badge: "DIRECT CONTACT & LOCATION",
    title: "Connect with Astro Philosophy",
    subtitle: "In-person appointments in Bengaluru and private remote consultations via direct appointment.",
    businessName: "Astro Philosophy",
    phone: "+91 91089 01714",
    phoneDisplay: "+91 91089 01714",
    phoneTel: "tel:+919108901714",
    whatsappNumber: "+91 91089 01714",
    whatsappUrl: "https://wa.me/919108901714",
    whatsappLabel: "Chat on WhatsApp",
    // Email left blank until user provides it; UI components automatically hide the email field when empty.
    email: "",
    address: {
      line1: "Nanjappa Garden, Horamavu",
      cityStateZip: "Bengaluru, Karnataka 560113, India",
      full: "Nanjappa Garden, Horamavu, Bengaluru, Karnataka 560113, India",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Nanjappa+Garden,+Horamavu,+Bengaluru,+Karnataka+560113,+India",
    },
    consultationCta: {
      label: "Book Reading",
      actionUrl: "https://wa.me/919108901714?text=Hello%20Astro%20Philosophy%2C%20I%20would%20like%20to%20enquire%20about%20a%20consultation.%20Please%20share%20the%20details.",
      note: "Prior appointment is recommended. Inquiries are coordinated directly via WhatsApp."
    }
  },

  footer: {
    copyrightText: "Astro Philosophy. All rights reserved.",
    disclaimer: "Astro Philosophy provides traditional astrological interpretations and devotional prayer ceremonies for personal reflection and spiritual contemplation. Astrology is an interpretive cultural tradition and does not substitute for qualified medical, legal, financial, or mental-health counsel.",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Guidance", href: "#" },
      { label: "Consultation Ethics", href: "#" }
    ]
  }
}
