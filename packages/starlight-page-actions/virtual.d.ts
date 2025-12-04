// env.d.ts
declare module "virtual:starlight-page-actions/config" {
  interface ActionsProps {
    chatgpt?: boolean;
    claude?: boolean;
    t3chat?: boolean;
    v0?: boolean;
    markdown?: boolean;
    custom?: Record<string, CustomActionsProps>;
  }

  interface CustomActionsProps {
    label: string;
    href: string;
  }

  export interface PageActionsConfig {
    prompt?: string;
    baseUrl?: string;
    actions?: ActionsProps;
  }

  const config: PageActionsConfig;
  export default config;
}
