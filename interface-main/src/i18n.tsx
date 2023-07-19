import { useEffect, useState, ReactNode } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { useActiveLocale } from "hooks/useActiveLocale";
import {
  af,
  ar,
  ca,
  cs,
  da,
  de,
  el,
  en,
  es,
  fi,
  fr,
  he,
  hu,
  id,
  it,
  ja,
  ko,
  nl,
  no,
  pl,
  pt,
  ro,
  ru,
  sr,
  sv,
  tr,
  uk,
  vi,
  zh,
} from "make-plural/plurals";
import { SupportedLocale } from "constants/locales";
import "./locales/services";

const plurals = {
  "af-ZA": af,
  "ar-SA": ar,
  "ca-ES": ca,
  "cs-CZ": cs,
  "da-DK": da,
  "de-DE": de,
  "el-GR": el,
  "en-US": en,
  "es-ES": es,
  "fi-FI": fi,
  "fr-FR": fr,
  "he-IL": he,
  "hu-HU": hu,
  "id-ID": id,
  "it-IT": it,
  "ja-JP": ja,
  "ko-KR": ko,
  "nl-NL": nl,
  "no-NO": no,
  "pl-PL": pl,
  "pt-BR": pt,
  "pt-PT": pt,
  "ro-RO": ro,
  "ru-RU": ru,
  "sr-SP": sr,
  "sv-SE": sv,
  "tr-TR": tr,
  "uk-UA": uk,
  "vi-VN": vi,
  "zh-CN": zh,
  "zh-TW": zh,
};

async function dynamicActivate(locale: SupportedLocale) {
  const { messages } = await import(`./locales/${locale}.js`);
  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] });
  i18n.load(locale, messages);
  i18n.activate(locale);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dynamicActivate(locale)
      .then(() => {
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to activate locale", locale, error);
      });
  }, [locale]);

  // prevent the app from rendering with placeholder text before the locale is loaded
  if (!loaded) return null;

  return (
    <I18nProvider forceRenderOnLocaleChange={false} i18n={i18n}>
      {children}
    </I18nProvider>
  );
}
