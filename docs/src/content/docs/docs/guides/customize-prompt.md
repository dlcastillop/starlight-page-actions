---
title: Customize the Prompt
description: Learn how to customize the prompt in Starlight Page Actions to provide better context.
lastUpdated: 2025-10-30
---

Starlight Page Actions includes a default prompt that is automatically applied when a user opens the documentation in an AI tool like ChatGPT. This default prompt looks like this:

```
Read {url}. I want to ask questions about it.
```

You can override this behavior by providing your own custom prompt.

## Why customize the prompt?

You may want to:

- Give the AI more structure or context
- Automatically set a role or behavior
- Provide instructions for how the AI should analyze your docs
- Tailor the prompt for a specific AI assistant

Customizing the prompt lets you fully control the message sent to the AI.

## How to customize the prompt

Use the `prompt` option inside the plugin configuration:

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

### Using `{url}` in your prompt

You can reference the current page URL in your custom prompt by including `{url}`.

For example:

```
You are a technical assistant. Read {url} and summarize the most important concepts.
```

The `{url}` placeholder will automatically be replaced at runtime.

If you do not include `{url}` in your prompt, the page URL will be automatically appended at the end.
