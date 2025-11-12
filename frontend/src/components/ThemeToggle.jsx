import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Cambiar tema">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
