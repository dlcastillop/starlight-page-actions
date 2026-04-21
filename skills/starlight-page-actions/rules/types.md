---
title: Types Reference
description: The full reference documentation for Starlight Page Actions plugin types.
---

## `Actions`

Properties:

- `chatgpt` (`boolean`): Enable or disable the ChatGPT action. Default: `true`
- `claude` (`boolean`): Enable or disable the Claude action. Default: `true`
- `t3chat` (`boolean`): Enable or disable the T3 Chat action. Default: `false`
- `v0` (`boolean`): Enable or disable the v0 action. Default: `false`
- `cursor` (`boolean`): Enable or disable the Cursor action. Default: `false`
- `perplexity` (`boolean`): Enable or disable the Perplexity action. Default: `false`
- `githubCopilot` (`boolean`): Enable or disable the GitHub Copilot action. Default: `false`
- `markdown` (`boolean`): Enable or disable the Markdown view action. Default: `true`
- `custom` (`Record<string, CustomAction>`): Define custom actions with unique keys

## `CustomAction`

Properties:

- `label` (`string`, **required**): The text displayed for the action button
- `href` (`string`, **required**): The URL to open when the action is clicked

## `LocaleActions`

Properties:

- `custom` (`Record<string, Partial<CustomAction>>`): Locale-specific overrides for custom actions. Each key must match a custom action defined in the top-level `actions.custom` configuration.

## `LocaleConfig`

Properties:

- `prompt` (`string`): Locale-specific prompt used when opening the current page in AI tools
- `actions` (`LocaleActions`): Locale-specific custom action overrides