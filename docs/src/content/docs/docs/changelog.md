---
title: Changelog
description: New features, bug fixes, and improvements made to Starlight Page Actions.
lastUpdated: 2025-11-08
---

New features, bug fixes, and improvements made to Starlight Page Actions.

## v0.1.1

### Bug Fixes

- Fixed dependency configuration: moved `vite` and `vite-plugin-static-copy` from `devDependencies` to `dependencies` to prevent missing module errors during development and build

## v0.1.0

### Features

- Generate doc pages in Markdown
- "Copy Markdown" button
- "Open" dropdown menu with options to open the page in AI chat services
- Automatic generation of the `llms.txt` file with all documentation URLs during build
- Customize the default prompt
