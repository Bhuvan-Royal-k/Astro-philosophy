import { Language, TranslationDictionary, LANGUAGE_OPTIONS } from './types'
import { en } from './en'
import { ta } from './ta'
import { kn } from './kn'
import { te } from './te'
import { ml } from './ml'
import { hi } from './hi'

export * from './types'

export const translations: Record<Language, TranslationDictionary> = {
  en,
  ta,
  kn,
  te,
  ml,
  hi
}

export function getTranslation(lang: Language): TranslationDictionary {
  return translations[lang] || translations.en
}

export { LANGUAGE_OPTIONS }
