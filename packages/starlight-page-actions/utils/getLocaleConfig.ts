import type { PageActionsConfig } from "../index.ts";

type LocaleConfig = NonNullable<PageActionsConfig["locales"]>[string];
type LocaleConfigKey = keyof LocaleConfig & keyof PageActionsConfig;

export function getLocaleConfig<T extends LocaleConfigKey>(
  config: PageActionsConfig,
  locale: string | undefined,
  key: T,
): PageActionsConfig[T] {
  const localeConfig = locale ? config.locales?.[locale] : undefined;
  const localeValue = localeConfig?.[key];

  if (localeValue !== undefined) {
    return localeValue;
  }

  return config[key];
}
