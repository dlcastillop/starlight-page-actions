// env.d.ts
declare module "virtual:starlight-page-actions/config" {
  interface CustomActionsProps {
    name: string;
    href: string;
  }

  export interface PageActionsConfig {
    prompt?: string;
    baseUrl?: string;
    dropdownMenu?: {
      chatgpt?: boolean;
      claude?: boolean;
      t3chat?: boolean;
      v0?: boolean;
      markdown?: boolean;
      customActions?: Record<string, CustomActionsProps>;
    };
  }

  const config: PageActionsConfig;
  export default config;
}
