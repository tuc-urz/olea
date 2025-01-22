import { PixelRatio } from 'react-native';

const scalingFactor = PixelRatio.getFontScale();
const accessibilityFontScale = 2;
const accessibilityLineHeightScale = 2;

function getFontWithoutScale(fontSize) {
    return fontSize / scalingFactor;
}

export function limitFontScaling(fontSize) {
    if (scalingFactor > 2.8) {
        // reduce font scaling a bit
        return (fontSize / scalingFactor) * 2;
    } else if (scalingFactor > 2) {
        return fontSize * 0.75;
    }
    return fontSize;
}

export function limitLineHeightScaling(lineHeight) {
    if (scalingFactor > 2.8) {
        // reduce font scaling a bit
        return lineHeight * 0.55;
    } else if (scalingFactor > 2) {
        return lineHeight * 0.75;
    }
    return lineHeight;
}

const defaultFontSizes = {
    xxl: 20,
    xl: 18,
    l: 16,
    m: 14,
    s: 12,
    xs: 10,
    searchBar: 40,
    temperature: 38,
    titleBigger: 26,
    title: 24,
    universityTitle: 22,
    weather: 17,
    subtitle: 15,
    itemText: 13
}

const defaultLineHeights = {
    xxl: 26,
    xl: 24,
    l: 22,
    m: 20,
    s: 18,
    xs: 16,
    xxs: 14,
    titleBig: 28,
    titleBigger: 32,
    titleSmall: 21,
    contactName: 34
}

const fontSizesWithoutScale = {
    xxl: getFontWithoutScale(defaultFontSizes.xxl),
    xl: getFontWithoutScale(defaultFontSizes.xl),
    l: getFontWithoutScale(defaultFontSizes.l),
    m: getFontWithoutScale(defaultFontSizes.m),
    s: getFontWithoutScale(defaultFontSizes.s),
    xs: getFontWithoutScale(defaultFontSizes.xs),
    title: getFontWithoutScale(defaultFontSizes.title),
    titleBigger: getFontWithoutScale(defaultFontSizes.titleBigger),
    universityTitle: getFontWithoutScale(defaultFontSizes.universityTitle),
    temperature: getFontWithoutScale(46)
}

export const fontSizes = {
    xxl: limitFontScaling(defaultFontSizes.xxl),
    xl: limitFontScaling(defaultFontSizes.xl),
    l: limitFontScaling(defaultFontSizes.l),
    m: limitFontScaling(defaultFontSizes.m),
    s: limitFontScaling(defaultFontSizes.s),
    xs: limitFontScaling(defaultFontSizes.xs),
    searchBar: limitFontScaling(defaultFontSizes.searchBar),
    temperature: limitFontScaling(defaultFontSizes.temperature),
    titleBigger: limitFontScaling(defaultFontSizes.titleBigger),
    title: limitFontScaling(defaultFontSizes.title),
    universityTitle: limitFontScaling(defaultFontSizes.universityTitle),
    weather: limitFontScaling(defaultFontSizes.weather),
    subtitle: limitFontScaling(defaultFontSizes.subtitle),
    itemText: limitFontScaling(defaultFontSizes.itemText),
    fontSizesWithoutScale
}

export const accessibilityFontSizes = {
    xxl: defaultFontSizes.xxl * accessibilityFontScale,
    xl: defaultFontSizes.xl * accessibilityFontScale,
    l: defaultFontSizes.l * accessibilityFontScale,
    m: defaultFontSizes.m * accessibilityFontScale,
    s: defaultFontSizes.s * accessibilityFontScale,
    xs: defaultFontSizes.xs * accessibilityFontScale,
    searchBar: defaultFontSizes.searchBar * accessibilityFontScale,
    temperature: defaultFontSizes.temperature * accessibilityFontScale,
    titleBigger: defaultFontSizes.titleBigger * accessibilityFontScale,
    title: defaultFontSizes.title * accessibilityFontScale,
    universityTitle: defaultFontSizes.universityTitle * accessibilityFontScale,
    weather: defaultFontSizes.weather * accessibilityFontScale,
    subtitle: defaultFontSizes.subtitle * accessibilityFontScale,
    itemText: defaultFontSizes.itemText * accessibilityFontScale,
    fontSizesWithoutScale
}

export const lineHeights = {
    xxl: limitLineHeightScaling(defaultLineHeights.xxl),
    xl: limitLineHeightScaling(defaultLineHeights.xl),
    l: limitLineHeightScaling(defaultLineHeights.l),
    m: limitLineHeightScaling(defaultLineHeights.m),
    s: limitLineHeightScaling(defaultLineHeights.s),
    xs: limitLineHeightScaling(defaultLineHeights.xs),
    xxs: limitLineHeightScaling(defaultLineHeights.xxs),
    titleBig: limitLineHeightScaling(defaultLineHeights.titleBig),
    titleBigger: limitLineHeightScaling(defaultLineHeights.titleBigger),
    titleSmall: limitLineHeightScaling(defaultLineHeights.titleSmall),
    contactName: limitLineHeightScaling(defaultLineHeights.contactName)
}

export const accessibilityLineHeights = {
    xxl: defaultLineHeights.xxl * accessibilityLineHeightScale,
    xl: defaultLineHeights.xl * accessibilityLineHeightScale,
    l: defaultLineHeights.l * accessibilityLineHeightScale,
    m: defaultLineHeights.m * accessibilityLineHeightScale,
    s: defaultLineHeights.s * accessibilityLineHeightScale,
    xs: defaultLineHeights.xs * accessibilityLineHeightScale,
    xxs: defaultLineHeights.xxs * accessibilityLineHeightScale,
    titleBig: defaultLineHeights.titleBig * accessibilityLineHeightScale,
    titleBigger: defaultLineHeights.titleBigger * accessibilityLineHeightScale,
    titleSmall: defaultLineHeights.titleSmall * accessibilityLineHeightScale,
    contactName: defaultLineHeights.contactName * accessibilityLineHeightScale
}
