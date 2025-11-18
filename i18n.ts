export const locales = ["es", "en", "gl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";
