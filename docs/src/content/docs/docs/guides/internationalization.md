---
title: Internationalization
description: Learn how to translate Starlight Page Actions content into multiple languages.
lastUpdated: 2026-04-21
---

Starlight Page Actions supports internationalization for prompts and custom actions, allowing you to provide locale-specific content for multilingual documentation sites.

Built-in UI labels, such as "Copy Markdown", "Open in ChatGPT", and share actions, are translated automatically by the plugin for supported languages. Use the `locales` option when you need to translate your custom prompt or your own custom actions.

## How it works

When you configure locales in Starlight, you can provide translated versions of your content using the locales option inside the plugin configuration.

The root locale (typically English) uses the default content defined at the top level of the plugin configuration. For additional locales, you provide translations under the locales option, where each key must match the locale keys defined in your Starlight configuration.

You only need to translate the features you’re actually using since each locale override is optional. URLs in `href` properties can remain the same across locales or point to localized versions of your pages, depending on your site structure.

## Basic setup

First, configure your locales in Starlight:

```js
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  integrations: [
    starlight({
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        es: {
          label: "Español",
          lang: "es",
        },
        fr: {
          label: "Français",
          lang: "fr",
        },
      },
      plugins: [
        starlightPageActions({
          prompt: "Read {url} and explain its main points briefly.",
          actions: {
            custom: {
              sciraAi: {
                label: "Open in Scira AI",
                href: "https://scira.ai/?q=",
              },
            },
          },
          locales: {
            es: {
              prompt: "Lee {url} y explica brevemente sus puntos principales.",
              actions: {
                custom: {
                  sciraAi: {
                    label: "Abrir en Scira AI",
                    href: "https://scira.ai/?q=",
                  },
                },
              },
            },
            fr: {
              prompt: "Lis {url} et explique brièvement ses points principaux.",
              actions: {
                custom: {
                  sciraAi: {
                    label: "Ouvrir dans Scira AI",
                    href: "https://scira.ai/?q=",
                  },
                },
              },
            },
          },
        }),
      ],
      title: "My Docs",
    }),
  ],
});
```

## Translating prompts

Use `prompt` inside each locale override to translate the prompt sent to AI tools:

```js
starlightPageActions({
  prompt: "Read {url} and explain its main points briefly.",
  locales: {
    es: {
      prompt: "Lee {url} y explica brevemente sus puntos principales.",
    },
    fr: {
      prompt: "Lis {url} et explique brièvement ses points principaux.",
    },
  },
});
```

The `{url}` placeholder is replaced with the current page URL at runtime. If you do not include `{url}`, the page URL is appended automatically.

## Translating custom actions

Use `actions.custom` inside each locale override to translate custom action labels:

```js
starlightPageActions({
  actions: {
    custom: {
      sciraAi: {
        label: "Open in Scira AI",
        href: "https://scira.ai/?q=",
      },
    },
  },
  locales: {
    es: {
      actions: {
        custom: {
          sciraAi: {
            label: "Abrir en Scira AI",
          },
        },
      },
    },
  },
});
```

In locale overrides, each custom action can override only the fields that change. If you omit `href`, the top-level `href` is reused.

## Localizing custom action URLs

You can also override the `href` when a service supports localized endpoints or locale-specific query parameters:

```js
starlightPageActions({
  actions: {
    custom: {
      assistant: {
        label: "Ask Docs Assistant",
        href: "https://assistant.example.com/en?prompt=",
      },
    },
  },
  locales: {
    es: {
      actions: {
        custom: {
          assistant: {
            label: "Preguntar al asistente de docs",
            href: "https://assistant.example.com/es?prompt=",
          },
        },
      },
    },
  },
});
```

The encoded prompt is appended to the custom action `href`, so the URL should include the complete endpoint and end with the query parameter that receives the prompt, such as `?q=`, `?query=`, or `?prompt=`.
