// Very small i18n helper for 4 languages.
// Languages: en (English), rw (Kinyarwanda), fr (Français), sw (Kiswahili).

export const messages = {
  en: {
    appName: 'Stock Control',
    nav: {
      dashboard: 'Dashboard',
      products: 'Products',
      reports: 'Reports',
      users: 'Users',
      account: 'Account',
      logout: 'Logout',
    },
    landing: {
      ctaLogin: 'Sign in',
      ctaRegister: 'Create account',
    },
  },
  rw: {
    appName: 'Igenzura ry\'Ububiko',
    nav: {
      dashboard: 'Ibikorwa rusange',
      products: 'Ibicuruzwa',
      reports: 'Raporo',
      users: 'Abakoresha',
      account: 'Konti',
      logout: 'Gusohoka',
    },
    landing: {
      ctaLogin: 'Injira',
      ctaRegister: 'Fungura konti',
    },
  },
  fr: {
    appName: 'Contrôle de Stock',
    nav: {
      dashboard: 'Tableau de bord',
      products: 'Produits',
      reports: 'Rapports',
      users: 'Utilisateurs',
      account: 'Compte',
      logout: 'Déconnexion',
    },
    landing: {
      ctaLogin: 'Connexion',
      ctaRegister: 'Créer un compte',
    },
  },
  sw: {
    appName: 'Udhibiti wa Stoo',
    nav: {
      dashboard: 'Dashibodi',
      products: 'Bidhaa',
      reports: 'Ripoti',
      users: 'Watumiaji',
      account: 'Akaunti',
      logout: 'Kutoka',
    },
    landing: {
      ctaLogin: 'Ingia',
      ctaRegister: 'Fungua akaunti',
    },
  },
};

export function translate(lang, path, fallback) {
  const parts = path.split('.');
  let cur = messages[lang] || messages.en;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p];
    } else {
      return fallback ?? path;
    }
  }
  return typeof cur === 'string' ? cur : fallback ?? path;
}

