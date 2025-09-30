'use client';

import { useEffect, useState } from 'react';

export function useIsDark() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const htmlEl = document.documentElement;

    const update = () => setIsDark(htmlEl.classList.contains('dark'));
    update();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          update();
        }
      }
    });

    observer.observe(htmlEl, { attributes: true });

    const onThemeChange = () => update();
    window.addEventListener('themechange', onThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', onThemeChange);
    };
  }, []);

  return { mounted, isDark };
}
