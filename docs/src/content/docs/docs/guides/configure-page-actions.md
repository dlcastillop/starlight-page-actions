---
title: Configure Page Actions
description: Learn how to customize the page actions displayed on your documentation site.
lastUpdated: 2025-12-05
---

Starlight Page Actions allows you to customize which actions appear on your documentation pages, including built-in integrations with AI tools and custom actions.

## Default actions

By default, the plugin displays three actions: "Open in ChatGPT", "Open in Claude", and "View in Markdown".

The plugin includes five built-in actions that you can enable or disable:

- **`chatgpt`** - Opens the current page in ChatGPT
- **`claude`** - Opens the current page in Claude
- **`t3chat`** - Opens the current page in T3 Chat (disabled by default)
- **`v0`** - Opens the current page in v0 (disabled by default)
- **`markdown`** - View the page content in Markdown format

You can enable or disable any of these actions by setting them to `true` or `false`:

```js
starlightPageActions({
  actions: {
    chatgpt: false, // Disable ChatGPT action
    claude: true, // Enable Claude action
    t3chat: true, // Enable T3 Chat action
    v0: true, // Enable v0 action
    markdown: false, // Disable Markdown action
  },
});
```

## Custom actions

You can add your own custom actions to integrate with additional tools or services. Custom actions are defined using the `custom` property with a unique key for each action.

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
});
```

:::tip
The `href` should include the complete URL with the appropriate query parameter structure for the service you're integrating. Make sure to include the query parameter name (e.g., `?q=`, `?query=`, `?prompt=`) at the end.
:::

## Combining default and custom actions

You can mix default actions with custom actions. Custom actions will appear after the default actions:

```js
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
});
```

:::note
If all default actions are set to `false` and no custom actions are specified, the page actions section will not be displayed.
:::
