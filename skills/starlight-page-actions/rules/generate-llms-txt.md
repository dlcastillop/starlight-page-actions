---
title: Generate the llms.txt file
description: Learn how to automatically generate the llms.txt file for your documentation site.
---

Starlight Page Actions can automatically generate the `llms.txt` file for your documentation site.

This file lists all the pages in your documentation with their section headings, titles, and URLs.

## Enabling `llms.txt` generation

To generate the `llms.txt` file, you must specify the `baseUrl` option in the plugin configuration. Without it, the file will not be created.

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

## Viewing the `llms.txt` file

1. Run a build for your Starlight project.

   ```sh
   npm run build
   ```

   ```sh
   yarn build
   ```

   ```sh
   pnpm build
   ```

2. Start the preview server.

   ```sh
   npm run preview
   ```

   ```sh
   yarn preview
   ```

   ```sh
   pnpm preview
   ```

3. Open http://localhost:4321/llms.txt in your browser to see the generated file.