---
title: Share Documentation
description: Learn how to add sharing options to your documentation pages.
---

Starlight Page Actions allows users to share your documentation pages through multiple channels with a single click.

A dropdown menu provides quick access to share via social media, email, and messaging platforms.

## Enabling share options

To add sharing options to your documentation pages, set the `share` property to `true` in the plugin configuration.

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