/**
 * Per-app SVG icon registry.
 *
 * Drop an SVG file into apps/app-olea/assets/icons/, import it here, and add it
 * to the map. The registry is attached to the theme as `theme.icons` in
 * constants/Theme.js, and IconsOpenasist picks it up automatically.
 *
 * See assets/icons/README.md for SVG authoring conventions.
 */

import InfoSvg from '../../assets/icons/info.svg';

const iconsSVG = {
    'info': InfoSvg,
};

export default iconsSVG;
