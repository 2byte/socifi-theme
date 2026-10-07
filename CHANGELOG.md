# Changelog

All notable changes to `@socifi/ui-theme` are documented here. Format is loosely based on [Keep a Changelog](https://keepachangelog.com/). The project follows [Semantic Versioning](https://semver.org/) — see README "Semver policy" for what counts as a breaking change.

## [Unreleased]

### Added

- Added a second dark skin, `nocturne`, activated with `data-theme="nocturne"` on `<body>` next to Quasar's `body--dark`. It re-points the semantic tokens onto a new indigo surface ramp (`--c-indigo-*`) with a periwinkle brand (`--c-periwinkle-*`) and inherits the dark theme's depth model unchanged.
- Added the dark-only `--page-glow` token, so a skin can change the *quantity* of light the page gives off, not just its hue.
- Nocturne now hands the page fill to a backdrop layer: the skin clears the background on `#q-app` and `.q-page` and moves it to `body`, which leaves a gap between the fill and the content for an app to paint into (the Socifi app draws its canvas starfield there, and re-applies the fill and the glow on that layer). An app that leaves the gap empty still renders the page correctly.

### Changed

- Rebranded the shared Quasar theme to the violet Socifi dashboard design system, including its light and dark palettes, surfaces, typography, radii, and shadows.
- Refined Quasar navigation, cards, buttons, fields, tables, dialogs, and status styling around the shared semantic tokens.
- Removed corner rounding across Quasar components and app-level styles.
- Moved Quasar component overrides into the unlayered cascade so they can override Quasar defaults without `!important`.
- Redesigned Quasar form fields with consistent sizing, neutral surfaces, clearer labels, and a violet focus ring in light and dark themes.
- Matched Quasar form fields to the Tailwind reference input: 44px height (h-11), 4px `--radius-field` corners, and a single 1px violet focus border under the soft focus ring.
- Set the header to a frosted `bg-white/90` bar in light mode and `bg-slate-950/85` in dark mode (`backdrop-filter` blur), matching the design-system top bar.
- Styled the default Quasar button as the design-system `secondary` variant (white surface, 1px slate border, slate text, soft shadow, violet hover) and removed the forced shadow from ghost/`flat` buttons.
- Confined button elevation to the default (standard) button only: `flat`, `outline`, `unelevated` and `push` buttons — including the colored action buttons — are now completely flat, leaving only a whisper-thin 1px shadow on the default one.
- Styled Quasar list rows (`q-item`) after the design-system nav item: `h-11` (44px), `px-3`, `gap-3`, `rounded-xl`, `text-sm font-medium`, slate-500 label with a slate-50 / slate-800 hover (slate-400 → slate-900 / white in dark), keeping the brand tint for the active route.
- Gave list rows and buttons the design-system `rounded-xl` (4px) corners via a new `--radius-xl` token; cards and other surfaces stay square.
- Normalized Quasar `q-gutter-*` spacing inside card sections to flex `gap`, so content stays within the card padding instead of overflowing and clipping against one edge.
- Rebuilt the dark palette on a dedicated surface ramp (`--c-ink-*`) so dark mode no longer mixes the violet-grey palette with Tailwind slate values, and gave the shell three distinct planes: page, drawer ("well"), card, plus a raised step for dialogs.
- Replaced the dark-mode solid grey borders with translucent white hairlines, so a single value stays correct on the page, on a card, and on a floating layer instead of needing a per-surface grey.
- Added a dark-only depth layer: a 1px inner top highlight on every raised surface, deeper two-part shadows for floating elements, frosted glass on menus/tooltips/notifications, a dialog scrim, a soft brand bloom behind the page content, and an inset accent bar on the selected navigation row.
- Gave filled primary buttons a brand halo in dark mode and a 1px lift on hover; they previously had no hover feedback at all.
- Removed the dark-mode `[color="primary"]` button selectors, which could never match: `QBtn` consumes the `color` prop and renders `bg-primary text-white`, whose declarations are both `!important` in Quasar's stylesheet.
- Fixed dark-mode contrast regressions: form placeholders, navigation labels, the primary brand text used on tinted rows, and the status labels (`text-negative` and friends) all cleared WCAG AA again.
- Lifted the page bloom, the dark shadows, the inner top highlight and the translucent borders out of hard-coded literals into tokens so a skin can re-point them; the `nocturne` skin re-points `--q-primary` too, so Quasar's `bg-primary` fills, chips and active toggle segments follow the pale brand.

## [1.0.0] - 2026-05-24

Initial extraction from `notes-app`.

### Added

- Two-tier token system: primitives (`--c-blue-500`, `--c-gray-900`, …) and semantic tokens (`--color-primary`, `--color-text`, `--color-surface`, …)
- Sass palette (`_palette.scss`) shared between Quasar build-time variables and runtime CSS tokens
- Light theme (default) and dark theme (activated via Quasar's `body--dark`)
- Base styles for Quasar components: cards, fields, buttons, drawer, header
- Utility classes: `.text-muted`, `.text-primary`, `.text-on-brand`, `.bg-primary-soft`, `.bg-surface`, `.full-width`
- Cascade-layer ordering (`components` < `utilities`) declared in `_layers.scss`
