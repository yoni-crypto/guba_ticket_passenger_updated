'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
    { code: "en", name: "English", shortName: "English", flag: "🇺🇸" },
    { code: "am", name: "አማርኛ", shortName: "አማርኛ", flag: "🇪🇹" },
    { code: "or", name: "Afaan Oromoo", shortName: "Oromo", flag: "🇪🇹" },
  ];

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center space-x-1.5 transition-colors ${
          currentLanguage.code === 'or' ? 'text-xs sm:text-sm' : ''
        } ${
          isScrolled 
            ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
            : 'text-white hover:text-white hover:bg-white/20'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline whitespace-nowrap">
          {currentLanguage.shortName || currentLanguage.name}
        </span>
        <Globe className="h-4 w-4 shrink-0" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
            >
              <span className="text-lg">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {i18n.language === language.code && (
                <span className="text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

