export default {
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}",
      include: ["<rootDir>/src"],
    },
  ],
  compileNamespace: "cjs",
  fallbackLocales: {
    default: "en-US",
  },
  format: "po",
  formatOptions: {
    lineNumbers: true,
  },
  locales: ["en-US", "ja-JP", "ko-KR", "vi-VN", "zh-CN", "zh-TW"],
  orderBy: "messageId",
  rootDir: ".",
  runtimeConfigModule: ["@lingui/core", "i18n"],
  sourceLocale: "en-US",
};
