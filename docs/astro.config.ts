import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  site: "https://starlight-page-actions.dlcastillop.com",
  integrations: [
    starlight({
      title: "Starlight Page Actions",
      sidebar: [
        {
          label: "Overview",
          items: [
            {
              label: "Getting Started",
              link: "docs/getting-started",
            },
          ],
        },
        {
          label: "Guides",
          items: [
            {
              label: "Customize the Prompt",
              link: "docs/customize-prompt",
            },
            {
              label: "Generate the llms.txt file",
              link: "docs/getting-started",
            },
          ],
        },
        {
          label: "Reference",
          items: [
            {
              label: "Configuration Reference",
              link: "docs/getting-started",
            },
          ],
        },
      ],
      social: [
        {
          icon: "github",
          href: "https://github.com/dlcastillop/starlight-page-actions",
          label: "Github repo",
        },
        {
          icon: "linkedin",
          href: "https://linkedin.com/dlcastillop",
          label: "LinkedIn account",
        },
        {
          icon: "threads",
          href: "https://threads.com/@dlcastillop",
          label: "Threads account",
        },
      ],
      plugins: [
        starlightPageActions({
          baseUrl: "https://starlight-page-actions.dlcastillop.com",
        }),
      ],
    }),
  ],
});
