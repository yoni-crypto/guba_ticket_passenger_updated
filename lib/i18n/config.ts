import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavbar from './locales/en/navbar.json';
import enAuth from './locales/en/auth.json';
import enHome from './locales/en/home.json';
import enPages from './locales/en/pages.json';

import amCommon from './locales/am/common.json';
import amNavbar from './locales/am/navbar.json';
import amAuth from './locales/am/auth.json';
import amHome from './locales/am/home.json';
import amPages from './locales/am/pages.json';

import orCommon from './locales/or/common.json';
import orNavbar from './locales/or/navbar.json';
import orAuth from './locales/or/auth.json';
import orHome from './locales/or/home.json';
import orPages from './locales/or/pages.json';

const resources = {
  en: {
    common: enCommon,
    navbar: enNavbar,
    auth: enAuth,
    home: enHome,
    pages: enPages,
  },
  am: {
    common: amCommon,
    navbar: amNavbar,
    auth: amAuth,
    home: amHome,
    pages: amPages,
  },
  or: {
    common: orCommon,
    navbar: orNavbar,
    auth: orAuth,
    home: orHome,
    pages: orPages,
  },
};

const i18nConfig = {
  resources,
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  
  // Language detection options
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },
  
  // Namespace configuration
  defaultNS: 'common',
  ns: ['common', 'navbar', 'auth', 'home', 'pages'],
  
  // Interpolation options
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  
  // React options
  react: {
    useSuspense: false,
  },
  
  // Supported languages
  supportedLngs: ['en', 'am', 'or'],
  
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig)
  .then(() => {
    console.log('i18n initialized with language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    if (typeof window !== 'undefined') {
      console.log('Stored language:', localStorage.getItem('i18nextLng'));
    }
  });

export default i18n;

