import type { StarlightPlugin } from "@astrojs/starlight/types";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { normalizePath, normalizeUrl } from "./utils";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translations } from "./i18n/translations";
import virtual from "vite-plugin-virtual";

interface Actions {
  chatgpt?: boolean;
  claude?: boolean;
  t3chat?: boolean;
  v0?: boolean;
  markdown?: boolean;
  custom?: Record<string, CustomAction>;
}

interface CustomAction {
  label: string;
  href: string;
}

export interface PageActionsConfig {
  prompt?: string;
  baseUrl?: string;
  actions?: Actions;
}

/**
 * Starlight plugin that adds page action buttons to your documentation.
 *
 * This plugin adds:
 * - A "Copy Markdown" button to copy the raw Markdown content
 * - An "Open" dropdown menu with options to open the page in AI chat services (ChatGPT, Claude, etc.)
 * - Automatic generation of the `llms.txt` file with all documentation URLs during build
 *
 * @param {PageActionsConfig} [userConfig] - Configuration options for the plugin.
 * @param {string} [userConfig.prompt] - The prompt template for AI chat services. Use `{url}` as the placeholder for the Markdown URL.
 * @param {string} [userConfig.baseUrl] - The base URL of your site, required for generating the `llms.txt` file.
 * @param {Actions} [userConfig.actions] - Configure which built-in actions to display and define custom actions.
 *
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
  const defaultConfig: PageActionsConfig = {
    prompt: "Read {url}. I want to ask questions about it.",
    actions: {
      chatgpt: true,
      claude: true,
      t3chat: false,
      v0: false,
      markdown: true,
    },
  };

  const config: PageActionsConfig = {
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
      "config:setup"({
        addIntegration,
        updateConfig,
        config: starlightConfig,
        logger,
      }) {
        const hasActions =
          config.actions?.chatgpt ||
          config.actions?.claude ||
          config.actions?.t3chat ||
          config.actions?.v0 ||
          config.actions?.markdown ||
          (config.actions?.custom &&
            Object.keys(config.actions.custom).length > 0);

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
                            const frontMatterRegex =
                              /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
                            const match = content.match(frontMatterRegex);

                            let title = "";
                            let markdownContent = content;

                            if (
                              match &&
                              match[1] !== undefined &&
                              match[2] !== undefined
                            ) {
                              const frontMatter = match[1];
                              markdownContent = match[2];

                              const titleMatch = frontMatter.match(
                                /title:\s*["']?([^"'\n]+)["']?/
                              );
                              if (titleMatch && titleMatch[1] !== undefined) {
                                title = titleMatch[1].trim();
                              }
                            }

                            // Clean Markdown
                            // Remove components
                            const regexes = [
                              /<\s*\/?\s*Steps\b[^>]*>\s*/g, // <Steps />
                              /\{%\s*steps\s*%\}([\s\S]*?)\{%\s*\/steps\s*%\}/g, // {% steps %}
                              /<\s*\/?\s*CardGrid\b[^>]*>\s*/g, // <CardGrid />
                              /\{%\s*\/?\s*cardgrid\s*%\}/g, // {% cardgrid %}
                              /<\s*\/?\s*FileTree\b[^>]*>\s*/g, // <FileTree />
                              /\{%\s*filetree\s*%\}([\s\S]*?)\{%\s*\/filetree\s*%\}/g, // {% filetree %}
                              /<\s*\/?\s*Icon\b[^>]*>\s*/g, // <Icon />
                              /\{%\s*icon\s*%\}([\s\S]*?)\{%\s*\/icon\s*%\}/g, // {% icon %}
                            ];

                            let cleanContent = regexes.reduce(
                                (content, regex) => content.replace(regex, ""),
                                markdownContent
                            );

                            // Remove imports
                            cleanContent = cleanContent.replace(
                                /(```[\s\S]*?```)|import\s+[\s\S]*?from\s+['"].*?['"];?\s*/g,
                                (_, codeBlock) => codeBlock || ''
                            );

                            // Replace <LinkCard /> and {% linkcard %}
                            const linkCardRegexes = [
                              /<LinkCard[\s\S]*?title=["']([^"']+)["'][\s\S]*?href=["']([^"']+)["'][\s\S]*?\/>/g,
                              /{%\s*linkcard[\s\S]*?title=["']([^"']+)["'][\s\S]*?href=["']([^"']+)["'][\s\S]*?\/%}/g
                            ];

                            cleanContent = linkCardRegexes.reduce(
                                (content, regex) => content.replace(regex, (_, title: string, href: string) => `[${title}](${href})`),
                                cleanContent
                            );

                            // Replace <Card /> and {% card %}
                            const cardRegexes = [
                              /^\s*<Card[\s\S]*?title=["']([^"']+)["'][\s\S]*?(?:icon=["'][^"']*["'][\s\S]*?)?>([\s\S]*?)<\/Card>/gm,
                              /\{%\s*card\s+title=["']([^"']+)["'][\s\S]*?\s*%\}([\s\S]*?)\{%\s*\/card\s*%\}/g
                            ];

                            cleanContent = cardRegexes.reduce(
                                (content, regex) => content.replace(regex, (_, title: string, content: string) => `**${title}**\n${content.trim()}\n`),
                                cleanContent
                            );

                            // Replace <Aside /> and {% aside %}
                            const asideRegexes = [
                              /^\s*<Aside(?:\s+type=["'](\w+)["'])?(?:\s+title=["']([^"']+)["'])?\s*>([\s\S]*?)<\/Aside>/gm,
                              /\{%\s*aside(?:\s+type=["'](\w+)["'])?(?:\s+title=["']([^"']+)["'])?\s*%\}([\s\S]*?)\{%\s*\/aside\s*%\}/gm
                            ];

                            cleanContent = asideRegexes.reduce(
                                (content, regex) => content.replace(
                                    regex,
                                    (_, type: "note"|"tip"|"caution"|"danger", title: string, contentText: string) => {
                                      const defaultTitles = {
                                        note: 'Note',
                                        tip: 'Tip',
                                        caution: 'Caution',
                                        danger: 'Danger'
                                      };

                                      const finalType = type || 'note';
                                      const finalTitle = title || defaultTitles[finalType];

                                      return `**${finalTitle}:** ${contentText.trim()}`;
                                    }
                                ),
                                cleanContent
                            );

                            // Replace <Badge /> and {% badge %}
                            const badgeRegexes = [
                              /<Badge\s+text=["']([^"']+)["'](?:\s+variant=["'](\w+)["'])?\s*\/>/g,
                              /\{%\s*badge\s+text=["']([^"']+)["'](?:\s+variant=["'](\w+)["'])?\s*\/%\}/g
                            ];

                            cleanContent = badgeRegexes.reduce(
                                (content, regex) => content.replace(regex, (_, text: string) => text),
                                cleanContent
                            );

                            // Replace <Code /> and {% code %}
                            const codeRegexes = [
                              /<Code\s+code=(?:\{([^}]+)\}|["']([^"']+)["'])(?:\s+lang=["']([^"']+)["'])?(?:\s+title=(?:\{([^}]+)\}|["']([^"']+)["']))?[\s\S]*?\/>/g,
                              /\{%\s*code\s+code=["']([^"']+)["'](?:\s+lang=["']([^"']+)["'])?(?:\s+title=["']([^"']+)["'])?[\s\S]*?\/%\}/g
                            ];

                            // Replace <LinkButton /> and {% linkbutton %}
                            const linkButtonRegexes = [
                              /<LinkButton[\s\S]*?href=["']([^"']+)["'][\s\S]*?>([\s\S]*?)<\/LinkButton>/g,
                              /\{%\s*linkbutton[\s\S]*?href=["']([^"']+)["'][\s\S]*?%\}([\s\S]*?)\{%\s*\/linkbutton\s*%\}/g
                            ];

                            cleanContent = linkButtonRegexes.reduce(
                                (content, regex) => content.replace(regex, (_, href: string, text: string) => `[${text.trim()}](${href})`),
                                cleanContent
                            );

                            cleanContent = codeRegexes.reduce(
                                (content, regex) => content.replace(
                                    regex,
                                    (...matches) => {
                                      const code = matches[1] || matches[2];
                                      const lang = matches[3] || matches[2];
                                      const title = matches[4] || matches[5];

                                      const finalLang = lang || '';
                                      const codeContent = code?.replace(/^["']|["']$/g, '') || '';
                                      const titleComment = title ? `// ${title.replace(/^["']|["']$/g, '')}\n` : '';

                                      return `\`\`\`${finalLang}\n${titleComment}${codeContent}\n\`\`\``;
                                    }
                                ),
                                cleanContent
                            );

                            // Apply baseUrl to internal links
                            const baseUrl = normalizeUrl(config.baseUrl);
                            if (baseUrl) {
                              cleanContent = cleanContent.replace(
                                /\[([^\]]+)\]\((\/[^)]+)\)/g,
                                (_, text, href) =>
                                  `[${text}](${baseUrl}${href})`
                              );
                            }

                            // Normalize spacing
                            cleanContent = cleanContent.replace(
                              /\n{3,}/g,
                              "\n\n"
                            );

                            let newContent = title ? `# ${title}\n\n` : "";
                            newContent += cleanContent.trim();

                            return newContent;
                          },
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
                            return directories
                              ? `${directories}/${fileName}.md`
                              : `${fileName}.md`;
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
                      item.link.startsWith("http://") ||
                      item.link.startsWith("https://");

                    if (!isExternalLink) {
                      const cleanLink = item.link.replace(/^\/+|\/+$/g, "");
                      const url = cleanLink
                        ? `${baseUrl}/${cleanLink}`
                        : `${baseUrl}`;

                      if (item.label) {
                        content += `- [${item.label}](${url})\n`;
                      } else {
                        content += `- ${url}\n`;
                      }
                    }
                  }

                  if (item.slug && typeof item.slug === "string") {
                    const cleanSlug = item.slug.replace(/^\/+|\/+$/g, "");
                    const url = cleanSlug
                      ? `${baseUrl}/${cleanSlug}`
                      : `${baseUrl}`;

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
                        const url = cleanSlug
                          ? `${baseUrl}/${cleanSlug}`
                          : `${baseUrl}`;
                        content += `- ${url}\n`;
                      } else if (typeof subItem === "object") {
                        const hasNestedItems =
                          subItem.items && Array.isArray(subItem.items);
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
                  (page) => page.pathname !== "" && page.pathname !== "404/"
                );

                const urls = mdFiles.map(
                  (file) => `- ${baseUrl}/${file.pathname}`
                );
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
      "i18n:setup"({ injectTranslations }) {
        injectTranslations(translations);
      },
    },
  };
}
