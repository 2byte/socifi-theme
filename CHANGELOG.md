# Changelog

All notable changes to `@socifi/ui-theme` are documented here. Format is loosely based on [Keep a Changelog](https://keepachangelog.com/). The project follows [Semantic Versioning](https://semver.org/) — see README "Semver policy" for what counts as a breaking change.

## [Unreleased]

## [1.0.0] - 2026-05-24

Initial extraction from `notes-app`.

### Added

- Two-tier token system: primitives (`--c-blue-500`, `--c-gray-900`, …) and semantic tokens (`--color-primary`, `--color-text`, `--color-surface`, …)
- Sass palette (`_palette.scss`) shared between Quasar build-time variables and runtime CSS tokens
- Light theme (default) and dark theme (activated via Quasar's `body--dark`)
- Base styles for Quasar components: cards, fields, buttons, drawer, header
- Utility classes: `.text-muted`, `.text-primary`, `.text-on-brand`, `.bg-primary-soft`, `.bg-surface`, `.full-width`
- Cascade-layer ordering (`components` < `utilities`) declared in `_layers.scss`
