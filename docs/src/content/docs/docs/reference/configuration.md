---
title: Configuration Reference
description: The full reference documentation for Starlight Page Actions plugin options.
lastUpdated: 2026-01-14
---

Starlight Page Actions exposes a three options to control its behavior.

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

**type:** [`Actions`](/docs/reference/types#actions)

Configure which built-in actions to display and define custom actions.

You can enable or disable built-in actions (ChatGPT, Claude, T3 Chat, v0, Markdown) and define custom actions to integrate with additional tools or services.

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
