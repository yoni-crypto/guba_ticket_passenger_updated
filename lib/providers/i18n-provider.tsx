'use client';

import { useEffect } from 'react';
import i18n from '@/lib/i18n/config';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure i18n is initialized
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  return <>{children}</>;
}

