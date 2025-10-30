// env.d.ts
declare module "virtual:starlight-page-actions/config" {
  export interface PageActionsConfig {
    prompt?: string;
    baseUrl?: string;
  }

  const config: PageActionsConfig;
  export default config;
}
