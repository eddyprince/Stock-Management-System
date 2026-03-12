import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const messages = {
  en: {
    languageName: 'English',
    landing: {
      ctaSecure: 'Stop losing stock and profit',
      headline: 'Smart stock control for shop and store owners',
      problem:
        'Many business owners hire people to manage stock and sales – and later discover goods or money are missing because everything was written on paper or not recorded correctly.',
      solution:
        'This application keeps a clear, digital record of every product, sale and stock movement so you always know what was sold, what remains on the shelf, how much profit you made today and who changed what.',
    },
  },
  rw: {
    languageName: 'Kinyarwanda',
    landing: {
      ctaSecure: 'Hagarika gutakaza ibicuruzwa n’inyungu',
      headline: 'Gucunga stock neza ku bacuruzi n’amaduka',
      problem:
        'Abacuruzi benshi baha abandi akazi ko kubacungira stock n’ubaguzi, nyuma bakabona ibintu byabuze cyangwa amafaranga atuzuye kuko byanditse ku mpapuro cyangwa bitabinjiye mu ikoranabuhanga.',
      solution:
        'Iyi system ifasha kubika neza buri gicuruzwa, uko cyinjiye n’uko cyasohotse, ukamenya stock isigaye, ibyagurishijwe n’inyungu wungutse buri munsi.',
    },
  },
  fr: {
    languageName: 'Français',
    landing: {
      ctaSecure: 'Arrêtez de perdre votre stock et vos bénéfices',
      headline: 'Gestion intelligente de stock pour magasins et boutiques',
      problem:
        "Beaucoup de propriétaires engagent des personnes pour gérer le stock et les ventes, puis découvrent plus tard que des marchandises ou de l'argent ont disparu, car tout était noté sur papier.",
      solution:
        'Cette application garde une trace numérique claire de chaque produit, vente et mouvement de stock afin que vous sachiez toujours ce qui a été vendu, ce qui reste et quel bénéfice vous avez réalisé.',
    },
  },
  sw: {
    languageName: 'Kiswahili',
    landing: {
      ctaSecure: 'Acha kupoteza bidhaa na faida',
      headline: 'Udhibiti makini wa stock kwa wamiliki wa maduka',
      problem:
        'Wamiliki wengi wa biashara huwaajiri watu kusimamia stock na mauzo, halafu baadaye kugundua bidhaa au pesa zimepotea kwa sababu kila kitu kiliandikwa kwenye karatasi au hakikuhifadhiwa vizuri.',
      solution:
        'Mfumo huu huhifadhi rekodi ya kielektroniki ya kila bidhaa, mauzo na uhamisho wa stock ili ujue kilichouzwa, kilichobaki na faida uliyoipata kila siku.',
    },
  },
};

export const useUiStore = defineStore('ui', () => {
  const theme = ref(localStorage.getItem('theme') || 'light'); // 'light' | 'dark'
  const language = ref(localStorage.getItem('language') || 'en'); // 'en' | 'rw' | 'fr' | 'sw'

  function applyTheme() {
    const root = document.documentElement;
    if (theme.value === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  function setTheme(next) {
    theme.value = next;
    localStorage.setItem('theme', next);
    applyTheme();
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  }

  function setLanguage(next) {
    if (!messages[next]) return;
    language.value = next;
    localStorage.setItem('language', next);
  }

  const currentMessages = computed(() => messages[language.value] || messages.en);

  function t(path) {
    // Simple dot-notation lookup, e.g. 'landing.headline'
    const parts = path.split('.');
    let cur = currentMessages.value;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return path;
      }
    }
    return typeof cur === 'string' ? cur : path;
  }

  // Apply theme initially
  if (typeof window !== 'undefined') {
    applyTheme();
  }

  return {
    theme,
    language,
    setTheme,
    toggleTheme,
    setLanguage,
    t,
    currentMessages,
  };
});

