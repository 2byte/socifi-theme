# @socifi/ui-theme

Shared design system for Socifi Quasar applications. Provides:

- A two-tier token system (primitives → semantic) as Sass + CSS custom properties
- Light and dark themes (dark activated via Quasar's `body--dark` class)
- A second dark *skin*, `nocturne` (indigo surfaces, periwinkle accent), activated with `data-theme="nocturne"`
- Base styles for Quasar components, themed to match
- Utility classes

## Install

This package is distributed via git, not a registry. Pin to a tag:

```bash
npm install --save "github:socifi/ui-theme#v1.0.0"
```

Or via SSH if the repo is private:

```bash
npm install --save "git+ssh://git@github.com:socifi/ui-theme.git#v1.0.0"
```

Do **not** use semver ranges with git URLs — they don't work. Always pin to a specific tag.

## Use in a Quasar app

### 1. `src/css/quasar.variables.scss`

Quasar reads its theme colors at build time. Feed them from this package's palette so a rebrand only happens in one place.

```scss
@use 'sass:color';
@use '@socifi/ui-theme/palette' as *;

$primary:       $palette-blue-500;
$light-primary: color.scale($palette-blue-500, $lightness: 50%);
$secondary:     #26a69a;
$accent:        $palette-purple-500;

$dark:          $palette-gray-900;
$dark-page:     $palette-gray-1000;

$positive:      $palette-green-500;
$negative:      $palette-red-500;
$info:          $palette-cyan-500;
$warning:       $palette-amber-500;
```

### 2. `src/css/app.scss`

```scss
@use '@socifi/ui-theme';
```

That's it. The package pulls in primitives, semantic tokens, dark-mode overrides, base component styles, and utilities in the correct cascade-layer order.

### 3. `quasar.config.js`

```js
css: [
  'app.scss'
],
```

### 4. Dark mode

Activate via Quasar's standard API — no extra setup needed:

```js
import { Dark } from 'quasar'
Dark.set(true)   // or Dark.toggle()
```

The package overrides semantic tokens on `body.body--dark`, so everything themed through tokens flips automatically.

### 5. Dark skins

Dark mode ships with more than one palette. The default dark theme is neutral;
`nocturne` is a saturated indigo alternative. Both are *dark*: they share every
dark-only depth, glass and hairline rule and differ only in the colour ramp and
the accent, so a skin never has to re-describe elevation.

Select a skin with a second attribute next to Quasar's class:

```js
import { Dark } from 'quasar'

Dark.set(true)                            // Quasar owns light/dark
document.body.dataset.theme = 'nocturne'  // the package owns the skin
```

`data-theme` is only consulted while `body--dark` is present, so a skin can
never be applied on top of the light palette, and it stops applying the moment
Quasar drops `body--dark`. The value is free-form: an absent or unknown one
falls back to the base dark theme, which is what keeps the package usable by
apps that know nothing about skins.

## Token reference

### Primitives (palette)

Available as both Sass variables (`$palette-blue-500`) and CSS variables (`--c-blue-500`). Use Sass form when feeding Quasar's build-time variables, CSS form everywhere else. **Don't reference these directly in app components** — go through semantic tokens.

| Scale | Range |
|---|---|
| `blue-50` … `blue-900` | brand |
| `gray-0` … `gray-1000` | neutral |
| `green-500`, `amber-500`, `amber-800`, `red-500`, `cyan-500`, `purple-500` | status |
| `ink-1000` … `ink-700` | neutral dark-theme surface ramp — not a general neutral scale, see [Dark theme](#dark-theme) |
| `indigo-1000` … `indigo-700` | indigo dark surface ramp for the `nocturne` skin, see [Skins](#skins) |
| `periwinkle-200` … `periwinkle-400` | `nocturne` brand and accent |

### Semantic tokens

These are what components consume.

| Token | Role |
|---|---|
| `--color-primary` | brand color, buttons, headers |
| `--color-primary-hover` | hover state for primary surfaces |
| `--color-primary-active` | active/pressed state |
| `--color-primary-soft` | subtle brand tint (badges, fills) |
| `--color-primary-soft-strong` | stronger brand tint (active items, card actions) |
| `--color-primary-light` | faintest brand wash |
| `--color-primary-text` | brand used as text (lightened in dark for contrast) |
| `--color-on-primary` | text color on brand surfaces |
| `--color-surface` | card / popover background |
| `--color-surface-base` | page background |
| `--color-surface-raised` | dialogs and notifications (one step above `--color-surface`) |
| `--color-surface-soft` | subtle panel background (drawer, sections) |
| `--color-surface-soft-strong` | drawer active item, card actions |
| `--color-text` | default body text |
| `--color-text-muted` | secondary text |
| `--color-text-on-brand` | text on brand surfaces |
| `--color-text-link` | hyperlinks |
| `--color-border` | default border |
| `--color-border-strong` | emphasized borders (cards, fields) |
| `--color-border-subtle` | dividers within soft surfaces |
| `--color-button-surface` / `--color-button-surface-hover` | default/secondary button background and its hover |
| `--color-button-border` / `--color-button-border-hover` | default/secondary button border and its hover |
| `--color-button-text` | default/secondary button label |
| `--shadow-button` | elevation of the default button only (flat / outline / unelevated are never elevated) |
| `--color-item-text` | navigation / list row label |
| `--color-item-hover-bg` / `--color-item-hover-text` | navigation / list row hover surface and label |
| `--color-success-fg` / `--color-success-bg` | success status |
| `--color-warning-fg` / `--color-warning-bg` | warning status |
| `--color-danger-fg` / `--color-danger-bg` | error status |
| `--shadow-sm`, `--shadow-md`, `--shadow-card-soft`, `--shadow-focus` | elevation and keyboard focus |
| `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-field`, `--radius-pill` | corners |
| `--font-family-base`, `--font-size-base`, `--font-size-lg`, `--font-size-xl` | type |

### Dark theme

Light mode buys separation with shadows. On a near-black page a soft, low-alpha shadow is invisible, so the dark theme rebuilds elevation out of the surfaces themselves, in three moves:

1. **Fills.** Four steps, each ~1.1:1 against its neighbour — the spacing Radix uses for its dark scales. The dark-only `--c-ink-*` ramp exists for exactly these steps.

   | Step | Token | Used by |
   |---|---|---|
   | `ink-1000` | `--color-surface-base` | page |
   | `ink-975` | `--color-field-surface` | form controls (recessed) |
   | `ink-950` | `--color-surface-soft` | drawer, wells |
   | `ink-900` | `--color-surface` | cards |
   | `ink-850` | `--color-surface-raised`, `--color-surface-soft-strong` | dialogs, popovers, buttons |

2. **Edges.** Dark-mode borders are translucent white hairlines, so one value stays correct on every step instead of needing a hand-picked grey per surface. Every raised surface also carries a 1px inner top highlight (`--surface-highlight`) — at 1.1:1 fill steps it is the *edge*, not the fill, that makes a surface legible.

3. **Float.** Menus, tooltips and notifications are frosted glass (`--glass-surface`, `--glass-blur`); dialogs sit on `--color-surface-raised` behind a `--scrim`.

Dark-only helper tokens, defined on `body.body--dark` and safe to override per app:

| Token | Role |
|---|---|
| `--surface-highlight` | 1px inner top highlight for raised surfaces |
| `--shadow-float` | menus, dialogs, tooltips, notifications |
| `--shadow-glow-primary`, `--shadow-glow-hover` | brand halo on filled primary buttons |
| `--glass-surface`, `--glass-blur`, `--scrim` | floating-layer glass and dialog backdrop |
| `--page-glow` | radial bloom painted behind the page content; re-pointed by skins, see [Skins](#skins) |

The dark theme is deliberately asymmetric in one place: `--color-primary` is the *accent* violet (borders, focus rings, icons, labels), while filled `.bg-primary` surfaces keep Quasar's `--q-primary`. Accent violet is light enough that white text on it falls to 3.1:1, so it must never be used as a fill underneath white text.

### Skins

A skin re-points the semantic tokens; it never adds components. `nocturne`
(`_theme-nocturne.scss`) is scoped to `body.body--dark[data-theme='nocturne']`,
so it only ever layers on top of the dark theme and inherits its entire depth
model. It changes three things, each for a reason:

1. **A different ramp, the same contract.** Surfaces move from `--c-ink-*` to
   `--c-indigo-*`. The steps keep the dark theme's spacing (≥ 3 L* apart,
   page → card ≈ 9.7 L*) and only the hue moves, so every layering rule above
   keeps holding without a single component rule changing.
2. **A light accent.** `--color-primary` becomes periwinkle (`#a9baff`, L* 76.5)
   and `--color-on-primary` flips to the darkest page colour. Periwinkle carries
   dark ink at ~10:1, so this skin *can* do what the base dark theme cannot: use
   its accent as a fill underneath text. `--q-primary` is re-pointed so Quasar's
   own `bg-primary` follows, and one `!important` bridge flips `.bg-primary`
   labels to dark ink — white on periwinkle is only 1.88:1.
3. **More light on the page.** `--page-glow` is re-pointed to a stronger
   periwinkle bloom plus a cool counter-bloom in the bottom corner. It is a
   token rather than a literal inside `_components.scss` precisely so a skin can
   change the *quantity* of light the page gives off, not just its hue.
4. **A backdrop hand-off.** The page fill leaves the page: the skin clears the
   background on `#q-app` and on `.q-page` and moves it to `body` (which paints
   it as the canvas background — the only plane below a fixed layer). That
   leaves a gap between the fill and the content for an app to paint into; the
   Socifi app fills it with the canvas starfield in its `Starfield.vue`, which
   is also where the fill and the glow are re-applied. The skin only guarantees
   the gap, so an app that fills it with nothing still renders the page
   correctly, just without the field.

Everything else is inherited untouched: hairline borders, the inner top
highlight, frosted floating layers, the dialog scrim and the inset accent bar on
the active row. Text temperature moves with the ramp as well — Nocturne's muted
grey is tinted toward the surface hue, because neutral grey text on an indigo
page reads as dusty. The file records the measured WCAG ratios for text, muted
text and brand text against all six surface steps.

### Utility classes

| Class | Effect |
|---|---|
| `.text-on-brand` | text color = `--color-text-on-brand` |
| `.text-muted` | text color = `--color-text-muted` |
| `.text-primary` | text color = `--color-primary` |
| `.bg-primary-soft` | background = `--color-primary-soft` |
| `.bg-surface` | background = `--color-surface` |
| `.text-danger` | text color = `--color-danger-fg` |
| `.bg-danger-soft` | background = `--color-danger-bg` |
| `.full-width` | width: 100% |
| `.field-compact` | Quasar field sized to 36px high × 80px wide |

## Per-app overrides

If a single app needs a different brand color (e.g. an admin panel with purple primary), override semantic tokens **in the app**, not in this package:

```scss
// app's src/css/app.scss
@use '@socifi/ui-theme';

:root {
  --color-primary:       var(--c-purple-500);
  --color-primary-hover: #7b1fa2;
  --color-primary-soft:  rgba(156, 39, 176, 0.12);
}
```

If the same override appears in 3+ apps, that's a signal to add it to this package as a named variant (PR welcome).

## Architecture notes

### Why two tiers of tokens

- **Primitives** (`--c-blue-500`) name a color. They never change role.
- **Semantic** (`--color-primary`) name a use. They never change rebrand.

Components reference semantic tokens only. Rebrand = edit `_semantic.scss`. Dark mode = re-point semantic tokens on `body--dark` (see `_dark.scss`). Components don't move.

### Quasar component overrides

Quasar's own CSS is unlayered. The theme keeps component overrides unlayered too, then uses a `body` selector prefix where extra specificity is needed. This lets rules such as the global `q-item` color override Quasar defaults without `!important`.

Utilities load after component styles, so they can take precedence when both selectors have comparable specificity.

## Contributing

1. Branch from `main`, make your change in `src/`.
2. Update `CHANGELOG.md` under an "Unreleased" heading.
3. Open a PR.
4. On merge, maintainer runs `npm version <patch|minor|major>` and `git push --follow-tags`.

### Semver policy

| Change | Bump |
|---|---|
| Rename a public token; remove a utility class; change default brand hue | **major** |
| New token; new utility class; new component style; first dark mode | **minor** |
| Internal refactor; comment fixes; contrast adjustments imperceptible to users | **patch** |

When in doubt, bump higher.
