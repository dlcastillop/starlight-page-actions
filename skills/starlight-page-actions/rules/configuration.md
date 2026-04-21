---
title: Configuration Reference
description: The full reference documentation for Starlight Page Actions plugin options.
---

Starlight Page Actions exposes five options to control its behavior.

## Configure the plugin

### `prompt`

**type:** `string`

Customize the default prompt.

Use `{url}` in the string to include the current page URL. If `{url}` is omitted, the page URL will be automatically appended at the end.

```js
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightPageActions({
          prompt: "Read {url} and explain its main points briefly.",
        }),
      ],
      title: "My Docs",
    }),
  ],
});
```

### `baseUrl`

**type:** `string`

Required to generate the `llms.txt` file.

This URL is used as the base for all pages listed in `llms.txt`. Without it, the file will not be created.

`baseUrl` is also applied to internal links in the Markdown content. When `baseUrl` is not specified, internal links are preserved as-is.

```js
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightPageActions({
          baseUrl: "https://mydocs.example.com/",
        }),
      ],
      title: "My Docs",
    }),
  ],
});
```

### `actions`

**type:** [`Actions`](types#actions.md)

Configure which built-in actions to display and define custom actions.

You can enable or disable built-in actions (ChatGPT, Claude, T3 Chat, v0, Cursor, Perplexity, GitHub Copilot, Markdown) and define custom actions to integrate with additional tools or services.

```js
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightPageActions({
          actions: {
            chatgpt: false,
            v0: true,
            custom: {
              sciraAi: {
                label: "Open in Scira AI",
                href: "https://scira.ai/?q=",
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

### `share`

**type:** `boolean`  
**default:** `false`

Enable sharing options for documentation pages.

When set to `true`, a dropdown menu with multiple sharing channels will be available.

```js
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightPageActions({
          share: true,
        }),
      ],
      title: "My Docs",
    }),
  ],
});
```

### `locales`

**type:** [`Record<string, LocaleConfig>`](types#localeconfig.md)
**default:** `{}`

Provide locale-specific overrides for prompts and custom actions.

Each locale key must match the locale keys defined in your Starlight configuration. You can translate `prompt` and override custom action labels or hrefs for each locale.

Custom action overrides are matched by key. Define the custom action in the top-level `actions.custom` configuration first, then override the fields that change inside `locales`.

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

See the [Internationalization guide](internationalization.md) for more details.