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
              label: "Personalize the prompt",
              link: "docs/getting-started",
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
      plugins: [starlightPageActions()],
    }),
  ],
});
