import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, TranslationDictionary, LanguageOption, LANGUAGE_OPTIONS, getTranslation } from '../translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationDictionary
  languages: LanguageOption[]
  currentLanguageOption: LanguageOption
}

const STORAGE_KEY = 'astro_philosophy_lang'

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && (saved === 'en' || saved === 'ta' || saved === 'kn' || saved === 'te' || saved === 'ml' || saved === 'hi')) {
        return saved as Language
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Ignore localStorage errors
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const t = getTranslation(language)
  const currentLanguageOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0]

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGE_OPTIONS,
        currentLanguageOption
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
