import type { StarlightPlugin } from "@astrojs/starlight/types";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { normalizePath, normalizeUrl } from "./utils";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translations } from "./i18n/translations";
import virtual from "vite-plugin-virtual";
import {
  cleanStarlightMarkdown,
  extractStarlightFrontmatter,
  type StarlightInternalLinkMode,
} from "tidymd";

interface Actions {
  chatgpt?: boolean;
  claude?: boolean;
  t3chat?: boolean;
  v0?: boolean;
  cursor?: boolean;
  perplexity?: boolean;
  githubCopilot?: boolean;
  markdown?: boolean;
  custom?: Record<string, CustomAction>;
}

interface CustomAction {
  label: string;
  href: string;
}

interface LocaleActions {
  custom?: Record<string, Partial<CustomAction>>;
}

interface LocaleConfig {
  prompt?: string;
  actions?: LocaleActions;
}

interface DocsFrontmatter {
  slug?: unknown;
}

type PageActionsPosition = "page-title" | "table-of-contents";

export interface PageActionsConfig {
  prompt?: string;
  baseUrl?: string;
  position?: PageActionsPosition;
  actions?: Actions;
  share?: boolean;
  locales?: Record<string, LocaleConfig>;
}

function getOutputPathFromSlug(slug: string): string | undefined {
  const trimmedSlug = slug.trim();

  if (!trimmedSlug) return;

  const normalizedSlug = trimmedSlug.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

  if (!normalizedSlug) return "index.md";

  const segments = normalizedSlug.split("/");

  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return;
  }

  if (segments.at(-1) === "index") {
    const directories = segments.slice(0, -1).join("/");

    return directories ? `${directories}.md` : "index.md";
  }

  return `${segments.join("/")}.md`;
}

function getOutputPathFromSourcePath(pathSegments: string[], fileName: string): string {
  if (fileName === "index") {
    if (pathSegments.length === 1) {
      return "index.md";
    }

    const directories = pathSegments.slice(0, -2).join("/");
    const folderName = pathSegments[pathSegments.length - 2];

    return directories ? `${directories}/${folderName}.md` : `${folderName}.md`;
  }

  const directories = pathSegments.slice(0, -1).join("/");

  return directories ? `${directories}/${fileName}.md` : `${fileName}.md`;
}

/**
 * Starlight plugin that adds page action buttons to your documentation.
 *
 * This plugin adds:
 * - A "Copy Markdown" button to copy the raw Markdown content
 * - An "Open" dropdown menu with options to open the page in AI chat services (ChatGPT, Claude, etc.)
 * - A "Share" dropdown menu with options to share the page via social media, email, and messaging platforms.
 * - Automatic generation of the `llms.txt` file with all documentation URLs during build
 *
 * @param {PageActionsConfig} [userConfig] - Configuration options for the plugin.
 * @param {string} [userConfig.prompt] - The prompt template for AI chat services. Use `{url}` as the placeholder for the Markdown URL.
 * @param {string} [userConfig.baseUrl] - The base URL of your site, required for generating the `llms.txt` file.
 * @param {PageActionsPosition} [userConfig.position] - Where to render the page actions.
 * @param {Actions} [userConfig.actions] - Configure which built-in actions to display and define custom actions.
 * @param {boolean} [userConfig.share] - Enable sharing options for documentation pages.
 * @param {Record<string, LocaleConfig>} [userConfig.locales] - Locale-specific prompt and custom action overrides.
 * @see {@link https://starlight-page-actions.dlcastillop.com/docs/reference/configuration|Configuration Reference}
 *
 * @example
 * ```js
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
 *           baseUrl: "https://mydocs.example.com",
 *           share: true,
 *           actions: {
 *            chatgpt: false,
 *            v0: true,
 *            custom: {
 *              sciraAi: {
 *                label: "Open in Scira AI",
 *                href: "https://scira.ai/?q="
 *              }
 *            }
 *           }
 *           locales: {
 *             es: {
 *               prompt: "Lee {url} y explica sus puntos principales brevemente.",
 *               actions: {
 *                 custom: {
 *                   sciraAi: {
 *                     label: "Abrir en Scira AI"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         })
 *       ]
 *     })
 *   ]
 * });
 * ```
 *
 */
export default function starlightPageActions(userConfig?: PageActionsConfig): StarlightPlugin {
  const defaultConfig: PageActionsConfig = {
    position: "page-title",
    actions: {
      chatgpt: true,
      claude: true,
      t3chat: false,
      v0: false,
      cursor: false,
      perplexity: false,
      githubCopilot: false,
      markdown: true,
    },
    share: false,
  };

  const config: PageActionsConfig = {
    locales: {},
    ...defaultConfig,
    ...userConfig,
    actions: {
      ...defaultConfig.actions,
      ...userConfig?.actions,
    },
  };

  return {
    name: "starlight-page-actions",
    hooks: {
      "config:setup"({ addIntegration, updateConfig, config: starlightConfig, logger }) {
        const hasActions =
          config.actions?.chatgpt ||
          config.actions?.claude ||
          config.actions?.t3chat ||
          config.actions?.v0 ||
          config.actions?.markdown ||
          (config.actions?.custom && Object.keys(config.actions.custom).length > 0);

        if (!hasActions) {
          logger.warn("No actions enabled. The dropdown will be hidden.");
        }

        addIntegration({
          name: "starlight-page-actions-integration",
          hooks: {
            "astro:config:setup": ({ updateConfig }) => {
              updateConfig({
                vite: {
                  plugins: [
                    virtual({
                      "virtual:module": `export default ${JSON.stringify(config)}`,
                      "virtual:config": config,
                    }),
                    viteStaticCopy({
                      targets: [
                        {
                          src: "src/content/docs/**/*.{md,mdx}",
                          dest: "",
                          transform: (content: string) => {
                            let internalLinks: StarlightInternalLinkMode = {
                              mode: "preserve",
                            };

                            if (config.baseUrl) {
                              internalLinks = {
                                mode: "baseUrl",
                                baseUrl: config.baseUrl,
                              };
                            }

                            const newContent = cleanStarlightMarkdown(content, {
                              frontmatter: "title-as-heading",
                              internalLinks,
                            });

                            return newContent;
                          },
                          rename: (fileName: string, fileExtension: string, fullPath: string) => {
                            const DOCS_CONTENT_DIR = "src/content/docs/";
                            const DOCS_CONTENT_SEGMENTS = DOCS_CONTENT_DIR.replace(/\/$/, "").split(
                              "/",
                            ).length;
                            const fullPathNormalized = normalizePath(fullPath);
                            const docsRelativePathWithExtension = fullPathNormalized.includes(
                              DOCS_CONTENT_DIR,
                            )
                              ? (fullPathNormalized.split(DOCS_CONTENT_DIR)[1] as string)
                              : path.posix.basename(fullPathNormalized);
                            const relativePath = docsRelativePathWithExtension.replace(
                              new RegExp(`\\.${fileExtension}$`),
                              "",
                            );
                            const pathSegments = relativePath.split("/");

                            const content = fs.readFileSync(fullPath, "utf-8");
                            const frontmatter =
                              extractStarlightFrontmatter<DocsFrontmatter>(content);
                            const slug =
                              typeof frontmatter?.slug === "string"
                                ? frontmatter.slug
                                : undefined;
                            const outputPath =
                              slug !== undefined
                                ? (getOutputPathFromSlug(slug) ??
                                  getOutputPathFromSourcePath(pathSegments, fileName))
                                : getOutputPathFromSourcePath(pathSegments, fileName);

                            const sourceDirSegments = Math.max(pathSegments.length - 1, 0);
                            const goUpSegments = DOCS_CONTENT_SEGMENTS + sourceDirSegments;

                            return path.posix.join("../".repeat(goUpSegments), outputPath);
                          },
                        },
                      ],
                    }),
                  ],
                },
              });
            },
            "astro:build:done": async ({ dir, pages }) => {
              const baseUrl = normalizeUrl(config.baseUrl);
              if (!baseUrl) return;

              const distPath = fileURLToPath(dir);
              const sidebar = starlightConfig.sidebar;
              let llmsTxtContent = `# ${starlightConfig.title} Documentation\n\n`;

              const checkSidebar = (items: any[]): boolean => {
                for (const item of items) {
                  if (item.autogenerate) {
                    return false;
                  }

                  if (item.slug && !item.label) {
                    return false;
                  }
                  if (item.items && Array.isArray(item.items)) {
                    for (const subItem of item.items) {
                      if (typeof subItem === "object") {
                        if (!checkSidebar([subItem])) {
                          return false;
                        }
                      }
                    }
                  }
                }
                return true;
              };

              const canGenerateFromSidebar =
                sidebar && Array.isArray(sidebar) && checkSidebar(sidebar);

              if (canGenerateFromSidebar) {
                const processSidebarItem = (item: any, level = 2): string => {
                  let content = "";

                  if (item.label && !item.link && !item.slug) {
                    content += `${"#".repeat(level)} ${item.label}\n\n`;
                  }

                  if (item.link && typeof item.link === "string") {
                    const isExternalLink =
                      item.link.startsWith("http://") || item.link.startsWith("https://");

                    if (!isExternalLink) {
                      const cleanLink = item.link.replace(/^\/+|\/+$/g, "");
                      const url = cleanLink ? `${baseUrl}/${cleanLink}` : `${baseUrl}`;

                      if (item.label) {
                        content += `- [${item.label}](${url})\n`;
                      } else {
                        content += `- ${url}\n`;
                      }
                    }
                  }

                  if (item.slug && typeof item.slug === "string") {
                    const cleanSlug = item.slug.replace(/^\/+|\/+$/g, "");
                    const url = cleanSlug ? `${baseUrl}/${cleanSlug}` : `${baseUrl}`;

                    if (item.label) {
                      content += `- [${item.label}](${url})\n`;
                    } else {
                      content += `- ${url}\n`;
                    }
                  }

                  if (item.items && Array.isArray(item.items)) {
                    for (const subItem of item.items) {
                      if (typeof subItem === "string") {
                        const cleanSlug = subItem.replace(/^\/+|\/+$/g, "");
                        const url = cleanSlug ? `${baseUrl}/${cleanSlug}` : `${baseUrl}`;
                        content += `- ${url}\n`;
                      } else if (typeof subItem === "object") {
                        const hasNestedItems = subItem.items && Array.isArray(subItem.items);
                        const nextLevel = hasNestedItems ? level + 1 : level;
                        content += processSidebarItem(subItem, nextLevel);
                      }
                    }
                  }

                  if (item.label && !item.link && !item.slug) {
                    content += "\n";
                  }

                  return content;
                };

                for (const group of sidebar) {
                  llmsTxtContent += processSidebarItem(group);
                }
              } else {
                const mdFiles = pages.filter(
                  (page) => page.pathname !== "" && page.pathname !== "404/",
                );

                const urls = mdFiles.map((file) => `- ${baseUrl}/${file.pathname}`);
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
            TableOfContents: "starlight-page-actions/overrides/TableOfContents.astro",
            ...starlightConfig.components,
          },
        });
      },
      "i18n:setup"({ injectTranslations }) {
        injectTranslations(translations);
      },
    },
  };
}
