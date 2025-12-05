import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";
import starlightUiTweaks from "starlight-ui-tweaks";
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
              link: "docs/guides/customize-prompt",
            },
            {
              label: "Generate the llms.txt file",
              link: "docs/guides/generate-llms-txt",
            },
            {
              label: "Configure Page Actions",
              link: "docs/guides/configure-page-actions",
            },
            {
              label: "Disable Page Actions per Page",
              link: "docs/guides/disable-page-actions",
            },
          ],
        },
        {
          label: "Reference",
          items: [
            {
              label: "Configuration Reference",
              link: "docs/reference/configuration",
            },
            {
              label: "Types Reference",
              link: "docs/reference/types",
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
        starlightUiTweaks({
          footer: {
            copyright: "Daniel Castillo. All rights reserved.",
            firstColumn: {
              title: "Developer Tools",
              links: [
                {
                  label: "SEO in Next.js",
                  href: "https://seo-in-nextjs.dlcastillop.com/",
                },
                {
                  label: "SEO in Astro",
                  href: "https://seo-in-astro.dlcastillop.com/",
                },
                {
                  label: "Nova.js",
                  href: "https://novajs.dev/",
                },
                {
                  label: "Starlight UI Tweaks",
                  href: "https://starlight-ui-tweaks.dlcastillop.com/",
                },
                {
                  label: "Hook Crafter",
                  href: "https://hookcrafter.dev/",
                },
              ],
            },
            secondColumn: {
              title: "Resources",
              links: [
                {
                  label: "Guides",
                  href: "/docs/guides/customize-prompt",
                },
                {
                  label: "Reference",
                  href: "/docs/reference/configuration",
                },
              ],
            },
            thirdColumn: {
              title: "Support",
              links: [
                {
                  label: "Issues",
                  href: "https://github.com/dlcastillop/starlight-page-actions/issues",
                },
                {
                  label: "Discussions",
                  href: "https://github.com/dlcastillop/starlight-page-actions/discussions",
                },
              ],
            },
            fourthColumn: {
              title: "More",
              links: [
                {
                  label: "Contact",
                  href: "mailto:daniel@dlcastillop.com",
                },
                {
                  label: "Changelog",
                  href: "/docs/changelog",
                },
              ],
            },
          },
        }),
      ],
      customCss: ["./src/styles/global.css"],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
