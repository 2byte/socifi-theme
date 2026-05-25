# @socifi/ui-theme

Shared design system for Socifi Quasar applications. Provides:

- A two-tier token system (primitives → semantic) as Sass + CSS custom properties
- Light and dark themes (dark activated via Quasar's `body--dark` class)
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

## Token reference

### Primitives (palette)

Available as both Sass variables (`$palette-blue-500`) and CSS variables (`--c-blue-500`). Use Sass form when feeding Quasar's build-time variables, CSS form everywhere else. **Don't reference these directly in app components** — go through semantic tokens.

| Scale | Range |
|---|---|
| `blue-50` … `blue-900` | brand |
| `gray-0` … `gray-1000` | neutral |
| `green-500`, `amber-500`, `amber-800`, `red-500`, `cyan-500`, `purple-500` | status |

### Semantic tokens

These are what components consume.

| Token | Role |
|---|---|
| `--color-primary` | brand color, buttons, headers |
| `--color-primary-hover` | hover state for primary surfaces |
| `--color-primary-active` | active/pressed state |
| `--color-primary-soft` | subtle brand tint (badges, fills) |
| `--color-primary-soft-strong` | stronger brand tint (active items, card actions) |
| `--color-on-primary` | text color on brand surfaces |
| `--color-surface` | card / popover background |
| `--color-surface-base` | page background |
| `--color-surface-soft` | subtle panel background (drawer, sections) |
| `--color-surface-soft-strong` | drawer active item, card actions |
| `--color-text` | default body text |
| `--color-text-muted` | secondary text |
| `--color-text-on-brand` | text on brand surfaces |
| `--color-text-link` | hyperlinks |
| `--color-border` | default border |
| `--color-border-strong` | emphasized borders (cards, fields) |
| `--color-border-subtle` | dividers within soft surfaces |
| `--color-success-fg` / `--color-success-bg` | success status |
| `--color-warning-fg` / `--color-warning-bg` | warning status |
| `--color-danger-fg` | error status |
| `--shadow-sm`, `--shadow-md`, `--shadow-card-soft` | elevation |
| `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` | corners |
| `--font-family-base`, `--font-size-base`, `--font-size-lg`, `--font-size-xl` | type |

### Utility classes

| Class | Effect |
|---|---|
| `.text-on-brand` | text color = `--color-text-on-brand` |
| `.text-muted` | text color = `--color-text-muted` |
| `.text-primary` | text color = `--color-primary` |
| `.bg-primary-soft` | background = `--color-primary-soft` |
| `.bg-surface` | background = `--color-surface` |
| `.full-width` | width: 100% |

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

### Why `@layer` AND a `body` selector prefix

Quasar's own CSS is **unlayered**. Per CSS spec, unlayered rules win over any layered rule, so wrapping our styles in `@layer` alone cannot beat Quasar's defaults.

We use `@layer` to order our **own** rules between themselves (`components` < `utilities`), and we boost specificity with a `body` selector prefix to beat Quasar (specificity 0,1,1 > 0,1,0). Together this eliminates the need for `!important`.

If a future Quasar release ships layered CSS, the `body` prefix can be dropped.

### Cascade layer order

```
@layer components, utilities;
```

`utilities` is declared last, so utility classes always win over component styles when both apply.

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
