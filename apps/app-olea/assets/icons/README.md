# App Icons (SVG)

This folder holds the per-app SVG icon set. Icons here are bundled at build time
via `react-native-svg-transformer` (wired in `metro.config.js`) and registered in
`apps/app-olea/constants/layout/IconsSVG.js`. The registry is attached to the
React Native Paper theme as `theme.icons`, and `<IconsOpenasist icon="<name>" />`
picks it up automatically (see `packages/libraries/icons-openasist/index.js`).

This path runs in parallel to the existing `openasist-wl-app.ttf` font icon set:
icons not in this folder still resolve via the font.

## Conventions

When authoring or sourcing an SVG for this folder:

- **viewBox**: `0 0 24 24` (a 24×24 unit grid).
- **Fill**: `fill="currentColor"` on the visible paths. Do **not** hardcode hex
  colors — the runtime `color` prop is forwarded via `currentColor`.
- **No padding or border**: the icon's drawing should fill the viewBox edge to
  edge. Whitespace is the caller's job (set via `size` and surrounding layout).
- **Single color**: prefer a single path (or multiple paths all using
  `currentColor`). Multi-color icons are fine in theory, but the `color` prop
  will only tint the `currentColor` parts.
- **No inline `width` / `height` attributes**: leave sizing to the runtime
  `size` prop (forwarded as `width` and `height` to the rendered SVG).
- **Strip metadata**: remove editor cruft (`<title>`, `<desc>`, `xmlns:sketch`,
  `data-*`, etc.) before committing.

## File naming

- **kebab-case**, matching the registry key.
- File extension: `.svg`.
- Example: `arrow-left.svg` ⇄ `'arrow-left': ArrowLeftSvg` in `IconsSVG.js`.

## Registering an icon

1. Drop the SVG here as `<name>.svg`.
2. Open `apps/app-olea/constants/layout/IconsSVG.js`.
3. Add: `import <Name>Svg from '../../assets/icons/<name>.svg';`
4. Add the entry to the exported map: `'<name>': <Name>Svg`.

That's it. Any existing `<IconsOpenasist icon="<name>" />` call site renders
the SVG instead of the font glyph.

## See also

- Lookup precedence: `packages/libraries/icons-openasist/index.js`
- Theme wiring: `apps/app-olea/constants/Theme.js`
