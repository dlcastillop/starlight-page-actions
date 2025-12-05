---
title: Types Reference
description: The full reference documentation for Starlight Page Actions plugin types.
lastUpdated: 2025-12-05
---

## `Actions`

Properties:

- `chatgpt` (`boolean`): Enable or disable the ChatGPT action. Default: `true`
- `claude` (`boolean`): Enable or disable the Claude action. Default: `true`
- `t3chat` (`boolean`): Enable or disable the T3 Chat action. Default: `false`
- `v0` (`boolean`): Enable or disable the v0 action. Default: `false`
- `markdown` (`boolean`): Enable or disable the Markdown view action. Default: `true`
- `custom` (`Record<string, CustomAction>`): Define custom actions with unique keys

## `CustomAction`

Properties:

- `label` (`string`, **required**): The text displayed for the action button
- `href` (`string`, **required**): The URL to open when the action is clicked
