import settings from './Settings';

import fonts from './layout/Fonts';

import {
    fontSizes,
    accessibilityFontSizes,
    lineHeights,
    accessibilityLineHeights
} from './layout/fontSizes';

import icons from './layout/Icons';
import iconsSVG from './layout/IconsSVG';
import { getStyles } from './layout/Styles';
import paddings from './layout/Paddings';

import {
    themeColors,
    themeColorsHighContrast,
    themeColorsDark,
    themeColorsDarkHighContrast
} from './layout/Colors';

import { Asset } from 'expo-asset';

const fontFamily = Asset.fromModule(require('./../assets/fonts/Poppins-Regular.ttf')).uri;

/**
 * Erstellt den HTML-Head mit den Styles für die WebView.
 *
 * @param {object} colors - Farben des aktiven App-Themes.
 * @param {object} sizes - Schriftgrößen des aktiven App-Themes.
 * @returns {string} HTML-Head mit Schriftdefinition und Styles.
 */
function createThemeCss(colors, sizes) {
    return '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">' +
        '<style type="text/css">' +
        '@font-face {font-family: \'poppins-regular\'; src:url(' + fontFamily + ')}' +
        'html, body {background-color: ' + colors.contentBackground + '; color: ' + colors.text + ';}' +
        '* {font-size: ' + sizes.l + 'px; font-family: \'poppins-regular\'; max-width: 100%;}' +
        'a {color: ' + colors.textAccent + ';}' +
        '.content span[style*="windowtext" i] {color: inherit !important;}' +
        'strong {font-weight: 600}' +
        '.content {width: 100%;}' +
        '</style></head>';
}

const theme = {
    version: 2,
    dark: false,
    supportsColorScheme: true,
    roundness: 4,
    paddings: paddings,
    colors: themeColors,
    themeStyles: getStyles(themeColors, fontSizes, lineHeights),
    fonts,
    fontSizes: fontSizes,
    lineHeights: lineHeights,
    appSettings: settings,
    css: createThemeCss(themeColors, fontSizes),
    customScript: "document.cookie = 'klaro=%7B%22matomo%22%3Afalse%2C%22technicalTracker%22%3Atrue%7D'",
    animation: {
        scale: 1.0,
    },
    AppIcons: icons, //old icons import from .ttf font file
    icons: iconsSVG //new icons import from svg file
};

export const getTheme = (highContrast, increaseFontSize, dark = false) => {
    const colorsToUse = dark
        ? (
            highContrast
                ? themeColorsDarkHighContrast
                : themeColorsDark
        )
        : (
            highContrast
                ? themeColorsHighContrast
                : themeColors
        );

    const fontSizesToUse = increaseFontSize
        ? accessibilityFontSizes
        : fontSizes;

    const lineHeightsToUse = increaseFontSize
        ? accessibilityLineHeights
        : lineHeights;

    return {
        ...theme,
        dark,
        colors: colorsToUse,
        themeStyles: getStyles(
            colorsToUse,
            fontSizesToUse,
            lineHeightsToUse
        ),
        fontSizes: fontSizesToUse,
        lineHeights: lineHeightsToUse,
        css: createThemeCss(colorsToUse, fontSizesToUse)
    };
};
