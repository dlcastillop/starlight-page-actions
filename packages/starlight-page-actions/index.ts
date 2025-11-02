import type { StarlightPlugin } from "@astrojs/starlight/types";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { normalizePath } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface PageActionsConfig {
  prompt?: string;
  baseUrl?: string;
}

/**
 * Starlight plugin that adds page action buttons to your documentation.
 *
 * This plugin adds:
 * - A "Copy Markdown" button to copy the raw markdown content
 * - An "Open" dropdown menu with options to open the page in AI chat services (ChatGPT, Claude, etc.)
 * - Automatic generation of llms.txt file with all documentation URLs during build
 *
 * @param {PageActionsConfig} [userConfig] - Configuration options for the plugin.
 * @param {string} [userConfig.prompt] - The prompt template for AI chat services. Use `{url}` as placeholder for the markdown URL.
 * @param {string} [userConfig.baseUrl] - The base URL of your site, required for generating the `llms.txt` file.
 *
 * @example
 * ```javascript
 * // astro.config.mjs
 * import starlight from '@astrojs/starlight';
 * import starlightPageActions from 'starlight-page-actions';
 *
 * export default defineConfig({
 *   integrations: [
 *     starlight({
 *       plugins: [
 *         starlightPageActions({
 *           prompt: "Read {url} and explain its main points briefly.",
 *           baseUrl: "https://mydocs.example.com"
 *         })
 *       ]
 *     })
 *   ]
 * });
 * ```
 *
 */
export default function starlightPageActions(
  userConfig?: PageActionsConfig
): StarlightPlugin {
  const config: PageActionsConfig = {
    prompt: "Read {url}. I want to ask questions about it.",
    ...userConfig,
  };

  return {
    name: "starlight-page-actions",
    hooks: {
      "config:setup"({
        addIntegration,
        updateConfig,
        config: starlightConfig,
      }) {
        addIntegration({
          name: "starlight-page-actions-integration",
          hooks: {
            "astro:config:setup": ({ updateConfig }) => {
              updateConfig({
                vite: {
                  plugins: [
                    {
                      name: "starlight-page-actions-config",
                      resolveId(id) {
                        if (id === "virtual:starlight-page-actions/config") {
                          return "\0" + id;
                        }
                      },
                      load(id) {
                        if (id === "\0virtual:starlight-page-actions/config") {
                          return `export default ${JSON.stringify(config)}`;
                        }
                      },
                    },
                    viteStaticCopy({
                      targets: [
                        {
                          src: "src/content/docs/**/*.{md,mdx}",
                          dest: "",
                          rename: (
                            fileName: string,
                            fileExtension: string,
                            fullPath: string
                          ) => {
                            const fullPathNormalized = normalizePath(fullPath);
                            const relativePath = (
                              fullPathNormalized.split(
                                "src/content/docs/"
                              )[1] as string
                            ).replace(new RegExp(`\\.${fileExtension}$`), "");
                            const pathSegments = relativePath.split("/");

                            if (fileName === "index") {
                              if (pathSegments.length === 1) {
                                return "index.md";
                              } else {
                                const directories = pathSegments
                                  .slice(0, -2)
                                  .join("/");
                                const folderName =
                                  pathSegments[pathSegments.length - 2];

                                return directories
                                  ? `${directories}/${folderName}.md`
                                  : `${folderName}.md`;
                              }
                            }

                            const directories = pathSegments
                              .slice(0, -1)
                              .join("/");
                            const finalPath = directories
                              ? `${directories}/${fileName}.md`
                              : `${fileName}.md`;

                            return finalPath;
                          },
                        },
                      ],
                    }),
                  ],
                },
              });
            },
            "astro:build:done": async ({ dir, pages }) => {
              if (!config.baseUrl) return;

              const baseUrl = config.baseUrl.endsWith("/")
                ? config.baseUrl.slice(0, -1)
                : config.baseUrl;
              const distPath = fileURLToPath(dir);
              const sidebar = starlightConfig.sidebar;
              let llmsTxtContent = `# ${starlightConfig.title} Documentation\n\n`;

              if (sidebar && Array.isArray(sidebar)) {
                const processSidebarItem = (item: any, level = 2): string => {
                  let content = "";

                  if (item.label && !item.link) {
                    content += `${"#".repeat(level)} ${item.label}\n\n`;
                  }

                  if (item.link && typeof item.link === "string") {
                    const cleanLink = item.link.replace(/^\/+|\/+$/g, "");
                    const url = cleanLink
                      ? `${baseUrl}/${cleanLink}.md`
                      : `${baseUrl}/index.md`;

                    if (item.label && level >= 2) {
                      content += `- [${item.label}](${url})\n`;
                    } else {
                      content += `- ${url}\n`;
                    }
                  }

                  if (item.slug && typeof item.slug === "string") {
                    const cleanSlug = item.slug.replace(/^\/+|\/+$/g, "");
                    const url = cleanSlug
                      ? `${baseUrl}/${cleanSlug}.md`
                      : `${baseUrl}/index.md`;
                    content += `- ${url}\n`;
                  }

                  if (item.items && Array.isArray(item.items)) {
                    for (const subItem of item.items) {
                      if (typeof subItem === "string") {
                        const cleanSlug = subItem.replace(/^\/+|\/+$/g, "");
                        const url = cleanSlug
                          ? `${baseUrl}/${cleanSlug}.md`
                          : `${baseUrl}/index.md`;
                        content += `- ${url}\n`;
                      } else if (typeof subItem === "object") {
                        const hasNestedItems =
                          subItem.items && Array.isArray(subItem.items);
                        const nextLevel = hasNestedItems ? level + 1 : level;
                        content += processSidebarItem(subItem, nextLevel);
                      }
                    }
                  }

                  if (item.label && !item.link) {
                    content += "\n";
                  }

                  return content;
                };

                for (const group of sidebar) {
                  llmsTxtContent += processSidebarItem(group);
                }
              } else {
                const mdFiles = pages
                  .filter(
                    (page) => page.pathname !== "" && page.pathname !== "404/"
                  )
                  .map((page) => page.pathname.replace(/\/$/, ".md"));

                const urls = mdFiles.map((file) => `- ${baseUrl}/${file}`);
                llmsTxtContent += urls.join("\n");
              }

              const llmsTxtPath = path.join(distPath, "llms.txt");
              fs.writeFileSync(llmsTxtPath, llmsTxtContent, "utf-8");
            },
          },
        });

        updateConfig({
          components: {
            PageTitle: "starlight-page-actions/overrides/PageTitle.astro",
            ...starlightConfig.components,
          },
        });
      },
    },
  };
}
