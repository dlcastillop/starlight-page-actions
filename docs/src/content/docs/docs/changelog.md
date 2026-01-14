---
title: Changelog
description: New features, bug fixes, and improvements made to Starlight Page Actions.
lastUpdated: 2026-01-14
---

New features, bug fixes, and improvements made to Starlight Page Actions.

## v0.4.0

### Features

- Add internationalization for plugin UI texts
- Remove `Steps` component from Markdown content
- Replace `LinkCard` component with Markdown links
- Apply `baseUrl` to internal links in Markdown

### Bug Fixes

- Fix multi-line imports not being fully removed from Markdown content

## v0.3.0

### Features

- Customize page actions
- Per-page opt-out for page actions

### Bug Fixes

- Fix edge cases in the `llms.txt` generation
  - Handle case when `slug` prop is used instead of `link`
  - Handle case when `slug` prop is used without specifying the `label` prop
  - Handle case when `autogenerate` is being used

## v0.2.0

### Features

- Handle "Copy Markdown" errors
- Remove frontmatter and imports from .md and .mdx files
- Replace .md references with direct URLs in Page Actions and `llms.txt`

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
