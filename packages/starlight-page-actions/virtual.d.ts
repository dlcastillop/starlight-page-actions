// env.d.ts
declare module "virtual:starlight-page-actions/config" {
  export interface PageActionsConfig {
    prompt?: string;
    baseUrl?: string;
    dropdownMenu?: {
      chatgpt?: boolean;
      claude?: boolean;
      t3chat?: boolean;
      v0?: boolean;
      markdown?: boolean;
    };
  }

  const config: PageActionsConfig;
  export default config;
}
