---
title: Configure Page Actions Position
description: Learn how to show page actions below the page title or in the table of contents.
---

Starlight Page Actions can display actions in two places: below the page title or in the table of contents.

By default, page actions are displayed below the page title.

## Showing actions below the page title

To show page actions below the page title, set the `position` property to `page-title`.

```js
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightPageActions({
          position: "page-title",
        }),
      ],
      title: "My Docs",
    }),
  ],
});
```

## Showing actions in the table of contents

To show page actions in the table of contents, set the `position` property to `table-of-contents`.

```js
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightPageActions({
          position: "table-of-contents",
        }),
      ],
      title: "My Docs",
    }),
  ],
});
```**Note:** On narrower layouts where Starlight hides the desktop table of contents, page actions are
  displayed below the page title instead.**Note:** Sharing options are not displayed in the desktop table of contents. The share menu can include
  many options, so it is only shown when page actions are displayed below the page title. If you set
  `position` to `table-of-contents` and `share` to `true`, sharing options will not appear in the
  table of contents.