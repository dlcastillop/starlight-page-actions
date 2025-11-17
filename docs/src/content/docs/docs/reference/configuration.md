---
title: Configuration Reference
description: The full reference documentation for Starlight Page Actions plugin options.
lastUpdated: 2025-10-30
---

Starlight Page Actions exposes a two options to control its behavior.

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

Required to generate the llms.txt file.

This URL is used as the base for all pages listed in llms.txt. Without it, the file will not be created.

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
