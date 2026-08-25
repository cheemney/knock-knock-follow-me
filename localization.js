const DEFAULT_LOCALE = "en-US";
const LOCALE_STORAGE_KEY = "language";

let localesPromise;

async function loadLocales() {
  if (!localesPromise) {
    localesPromise = fetch(chrome.runtime.getURL("locales.json"), {
      cache: "no-store",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load locales: ${response.status}`);
      }
      return response.json();
    });
  }

  return localesPromise;
}

function normalizeLocale(locale) {
  if (!locale) return null;
  return locale.replace("_", "-");
}

function resolveLocale(requestedLocale, locales) {
  const normalized = normalizeLocale(requestedLocale);
  if (normalized && locales[normalized]) return normalized;

  const base = normalized?.split("-")[0];
  if (base) {
    const match = Object.keys(locales).find(
      (locale) => locale.split("-")[0].toLowerCase() === base.toLowerCase(),
    );
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

async function getSelectedLocale() {
  const locales = await loadLocales();
  const { language } = await chrome.storage.local.get({ language: "" });

  if (language) {
    return resolveLocale(language, locales);
  }

  let browserLocale = "";
  try {
    browserLocale = chrome.i18n.getUILanguage();
  } catch (_error) {
    browserLocale = navigator.language;
  }

  return resolveLocale(browserLocale, locales);
}

async function getMessages() {
  const locales = await loadLocales();
  const locale = await getSelectedLocale();
  return { locale, messages: locales[locale].messages };
}

async function setSelectedLocale(locale) {
  const locales = await loadLocales();
  const resolved = resolveLocale(locale, locales);
  await chrome.storage.local.set({ language: resolved });
  return resolved;
}

async function getSupportedLocales() {
  const locales = await loadLocales();
  return Object.entries(locales).map(([code, value]) => ({
    code,
    name: value.name,
  }));
}

function translate(messages, key) {
  return messages[key] ?? messages.unknownError ?? key;
}
