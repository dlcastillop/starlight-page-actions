import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://starlight-page-actions.dlcastillop.com",
  integrations: [
    starlight({
      title: "Starlight Page Actions",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: true,
      },
      sidebar: [
        {
          label: "Overview",
          items: [
            {
              label: "Getting Started",
              link: "docs/getting-started",
            },
            {
              label: "Changelog",
              link: "docs/changelog",
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
              link: "docs/generate-llms-txt",
            },
          ],
        },
        {
          label: "Reference",
          items: [
            {
              label: "Configuration Reference",
              link: "docs/configuration-reference",
            },
          ],
        },
      ],
      social: [
        {
          icon: "email",
          href: "mailto:daniel@dlcastillop.com",
          label: "Email",
        },
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
      customCss: ["./src/styles/global.css"],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
