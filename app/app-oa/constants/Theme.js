import settings from './Settings';

import fonts from './layout/Fonts';
import { fontSizes, accessibilityFontSizes, lineHeights, accessibilityLineHeights } from './layout/fontSizes';
import icons from './layout/Icons';
import { getStyles } from './layout/Styles';
import paddings from './layout/Paddings';
import {themeColors, themeColorsHighContrast} from './layout/Colors';
import { Asset } from 'expo-asset';

const fontFamily = Asset.fromModule(require('./../assets/fonts/Poppins-Regular.ttf')).uri;

const theme = {
    version: 2,
    dark: false,
    roundness: 4,
    paddings: paddings,
    colors: themeColors,
    themeStyles: getStyles(themeColors, fontSizes, lineHeights),
    fonts,
    fontSizes: fontSizes,
    lineHeights: lineHeights,
    appSettings: settings,
    css: '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><style type="text/css"> @font-face {font-family: \'poppins-regular\'; src:url(' + fontFamily + ')}  * {font-size: '+fontSizes.l+'; font-family: \'source-sans-pro-regular\';background-color: '+themeColors.contentBackground+'; max-width: 100%} strong {font-weight: 600} .content{width: 100%;}</style></head>',
    customScript: "document.cookie = 'klaro=%7B%22matomo%22%3Afalse%2C%22technicalTracker%22%3Atrue%7D'",
    animation: {
        scale: 1.0,
    },
    AppIcons: icons
};

export const getTheme = (highContrast, increaseFontSize) => {
    const colorsToUse = highContrast ? themeColorsHighContrast : themeColors;
    const fontSizesToUse = increaseFontSize ? accessibilityFontSizes : fontSizes;
    const lineHeightsToUse = increaseFontSize ? accessibilityLineHeights : lineHeights;

    return {
        ...theme,
        colors: colorsToUse,
        themeStyles: getStyles(colorsToUse, fontSizesToUse, lineHeightsToUse),
        fontSizes: fontSizesToUse,
        lineHeights: lineHeightsToUse,
        css: '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><style type="text/css"> @font-face {font-family: \'poppins-regular\'; src:url(' + fontFamily + ')}  * {font-size: '+fontSizesToUse.l+'; font-family: \'source-sans-pro-regular\';background-color: '+themeColors.contentBackground+'; max-width: 100%} strong {font-weight: 600} .content{width: 100%;}</style></head>'
    };
}
