import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// Languages: en, rw (Kinyarwanda), fr, sw
export const useSettingsStore = defineStore('settings', () => {
  const language = ref(localStorage.getItem('language') || 'en');
  const theme = ref(localStorage.getItem('theme') || 'light'); // light | dark
  const soundEnabled = ref(localStorage.getItem('soundEnabled') !== 'false'); // default true

  function setLanguage(lang) {
    language.value = lang;
    localStorage.setItem('language', lang);
  }

  function setTheme(next) {
    theme.value = next;
    localStorage.setItem('theme', next);
    const root = document.documentElement;
    root.dataset.theme = next;
  }

  function setSoundEnabled(on) {
    soundEnabled.value = !!on;
    localStorage.setItem('soundEnabled', soundEnabled.value ? 'true' : 'false');
  }

  // initialise theme on first load
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme.value;
  }

  return {
    language,
    theme,
    soundEnabled,
    setLanguage,
    setTheme,
    setSoundEnabled,
  };
});

