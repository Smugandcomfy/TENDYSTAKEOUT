export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  "en-US",
  "zh-CN",
  "zh-TW",
  "vi-VN",
  "ja-JP",
  "ko-KR",
  "it-IT",
  "es-ES",
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = "en-US";

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  "en-US": "English",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
  "vi-VN": "Tiếng Việt",
  "zh-CN": "简体中文",
  "zh-TW": "繁体中文",
  "it-IT": "Italiano",
  "es-ES": "Español",
};

export const getLocalLabel = (local: SupportedLocale) => {
  return LOCALE_LABEL[local];
};
