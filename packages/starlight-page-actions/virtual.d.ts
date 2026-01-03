// env.d.ts
declare module "virtual:starlight-page-actions/config" {
  interface Actions {
    chatgpt?: boolean;
    claude?: boolean;
    t3chat?: boolean;
    v0?: boolean;
    markdown?: boolean;
    custom?: Record<string, CustomAction>;
  }

  interface CustomAction {
    label: string;
    href: string;
  }

  export interface PageActionsConfig {
    prompt?: string;
    baseUrl?: string;
    actions?: Actions;
  }

  const config: PageActionsConfig;
  export default config;
}

declare namespace App {
  type StarlightLocals = import("@astrojs/starlight").StarlightLocals;
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  type UIStrings = typeof import("./i18n/translations").translations.en;
  interface I18n extends UIStrings {}
}
