import { addAlpha } from '@olea-bps/base/libraries/core/helper/color';

export const colors = {
    black: '#000000',
    white: '#ffffff',
    grayLight1: '#d8d8d8',
    grayLight2: '#ddd',
    grayLight3: '#fefefe',
    grayLight4: addAlpha('#BEC3C6', 0.4),
    grayLight5: '#F5F5F5',
    grayDark1: '#545454',
    grayDark2: '#3d3d3d',
    grayDark3: '#CED0CE',

    green: '#1e8f39',
    yellow: '#f0c808',
    red: '#e53935',
    primary: '#70e0d0',
    accent: '#00535c',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#e53935',
    text: '#000000',

    /*
    Farbe: #9BC900
    Font: Poppins (im Logo werden Poppins und Source Code Pro verwendet)
    Hintergrund #252525
     */

    standardDescription: '#787878FF'
};

const mensaShadow = [
    colors.grayLight4,
    addAlpha('#BEC3C6', 0.12),  // 0.4 * 0.3 = 0.12
    addAlpha('#BEC3C6', 0.04),  // 0.4 * 0.1 = 0.04
    addAlpha('#BEC3C6', 0.02)   // 0.4 * 0.05 = 0.02
];


export const tabColors = {
    tabTitleDefault: colors.white,
    tabTitleSelected: colors.primary,
    tabIconDefault: colors.grayLight4,
    tabIconSelected: colors.primary,
    tabBar: colors.accent,
    tabIndicator: colors.accent,
    safeAreaTopBackground: colors.accent
};
export const tabColorsHighContrast = {
    ...tabColors,
    tabIconDefault: colors.grayLight1,
    tabIconSelected: colors.primary

};
export const priceTableColors = {
    col1Background: addAlpha(colors.primary, 1),
    col2Background: addAlpha(colors.primary, 0.8),
    col3Background: addAlpha(colors.primary, 0.6),
    col1Text: colors.black,
    col2Text: colors.black,
    col3Text: colors.black,
    disabled: addAlpha(colors.primary, 0.2),
    opacity: .4
};
export const priceTableColorsHighContrast = {
    ...priceTableColors,
    opacity: .65
};

export const messageColors = {
    errorBackground: colors.red,
    errorText: colors.white,
    warningBackground: colors.yellow,
    warningText: colors.black,
    noticeBackground: colors.primary,
    noticeText: colors.black,
    successBackground: colors.green,
    iconDefault: colors.black,
    iconDefaultBackground: colors.primary,
    iconDark: colors.black
};
export const messageColorsHighContrast = {
    ...messageColors,
    iconDefault: colors.grayDark1,

};

export const themeColors = {
    primary: colors.primary,
    primaryText: colors.black,
    secondary: colors.primary,
    secondaryText: colors.black,
    tertiary: colors.red,
    tertiaryText: colors.white,
    accent: '#ddd',
    subtitle: colors.accent,
    iconSubtitle: colors.accent,
    background: colors.white,
    safeAreaBackground: colors.white,
    appbarBackground: colors.accent,
    appbarText: colors.primary,
    appbarIconColor: colors.primary,
    appbarSubtitle: colors.primary,
    contentBackground: colors.grayLight5,
    searchBackground: colors.grayLight5,
    surface: colors.white,
    error: colors.red,
    errorText: colors.white,
    text: colors.black,
    textAccent: colors.accent,
    shadow: colors.black,
    icon: colors.grayDark2,
    statusBar: colors.primary,
    categoryBadgeBackgroundColor: colors.grayLight5,
    categoryBadgeColor: colors.grayDark1,
    bookHoldingBackgroundColor: colors.grayLight5,
    bookHoldingColor: colors.primary,
    disabled: addAlpha(colors.black, 0.26),
    placeholder: addAlpha(colors.black, 0.54),
    backdrop: addAlpha(colors.black, 0.5),
    notification: colors.accent,
    overlayColor: addAlpha(colors.primary, 0.47),
    tabs: tabColors,
    topNewsIconBackground: colors.accent,
    messages: messageColors,
    mensaShadow: mensaShadow,
    mensaSliderBackground: colors.grayLight4,
    mensaSliderTextColor: colors.black,
    priceTable: priceTableColors,
    highlightBackground: colors.primary,
    highlightTextColor: colors.black,
    checkboxChecked: colors.black,
    checkboxUnchecked: colors.black,
    loadingIndicator: colors.black,
    noticeText: colors.grayDark1,
    listSeperator: colors.grayDark3,
    listSeperator2: colors.grayDark2,
    lecturerNameText: colors.grayDark2,
    buttonText: colors.black,
    buttonBackground: colors.primary,
    tapeColor: addAlpha(colors.primary, 0.7),
    jobsTitleColor: colors.black,
    textInput: colors.black,
    textInputSelection: colors.grayDark3,
    timeTableRoom: colors.primary,
    textLighter: colors.standardDescription,
    quicklinksBackground: colors.primary,
    eventContainerBackground: colors.primary,
    eventContainerSidebar: colors.primary,
    eventTitleText: colors.black,
    eventRoomText: colors.accent,
    calendarBackground: colors.white,
    calendarHeaderBackground: colors.white,
    calendarGrid: colors.grayLight2,
    calendarGridMinor: colors.grayLight5,
};

export const themeColorsHighContrast = {
    ...themeColors,
    tabs: tabColorsHighContrast,
    messages: messageColorsHighContrast,
    noticeText: colors.black,
    subtitle: colors.accent,
    iconSubtitle: colors.grayDark1,
    priceTable: priceTableColorsHighContrast,
    textLighter: colors.accent,
    overlayColor: addAlpha(colors.primary, 0.65),
    appbarText: colors.white,
    appbarIconColor: colors.white,
    appbarSubtitle: colors.white,
    eventContainerBackground: colors.primary,
    eventContainerSidebar: colors.primary,
};

// Complementary UI colors for dark mode.
export const themeColorsDark = {
    ...themeColors,

    appbarBackground: '#252525',
    background: '#252525',
    surface: '#252525',
    safeAreaBackground: '#252525',
    contentBackground: '#181818',
    searchBackground: '#181818',

    text: '#F5F5F5',
    textInput: '#F5F5F5',
    jobsTitleColor: '#F5F5F5',
    subtitle: '#C6C6C6',
    iconSubtitle: '#C6C6C6',
    textLighter: '#C6C6C6',
    noticeText: '#C6C6C6',
    lecturerNameText: '#C6C6C6',

    textAccent: colors.primary,
    icon: '#D8D8D8',
    accent: '#606060',
    listSeperator: '#606060',
    listSeperator2: '#606060',

    categoryBadgeBackgroundColor: '#383838',
    categoryBadgeColor: '#F5F5F5',
    bookHoldingBackgroundColor: '#383838',
    bookHoldingColor: colors.primary,

    disabled: addAlpha(colors.white, 0.38),
    placeholder: '#C6C6C6',
    backdrop: addAlpha(colors.black, 0.65),

    checkboxChecked: colors.primary,
    checkboxUnchecked: '#C6C6C6',
    loadingIndicator: colors.primary,
    notification: colors.primary,
    textInputSelection: colors.accent,

    calendarBackground: '#181818',
    calendarHeaderBackground: '#252525',
    calendarGrid: '#606060',
    calendarGridMinor: '#383838',
    eventContainerSidebar: colors.accent,

    mensaSliderBackground: '#252525',
    mensaSliderTextColor: '#F5F5F5',

    tertiary: '#FF8A85',
    tertiaryText: '#3B1110',
    error: '#FF8A85',
    errorText: '#3B1110',

    messages: {
        ...messageColors,
        errorBackground: '#FF8A85',
        errorText: '#3B1110',
    },

    tabs: {
        ...tabColors,
        tabTitleDefault: '#C6C6C6',
        tabIconDefault: '#C6C6C6',
        tabIndicator: colors.primary,
        safeAreaTopBackground: '#252525',
        activeTab: colors.primary,
        inactiveTab: '#C6C6C6',
    },
};

export const themeColorsDarkHighContrast = {
    ...themeColorsDark,

    appbarText: colors.white,
    appbarIconColor: colors.white,
    appbarSubtitle: colors.white,
    eventRoomText: colors.black,
    text: colors.white,
    textInput: colors.white,
    jobsTitleColor: colors.white,
    textAccent: '#A8F5EB',
    subtitle: '#DEDEDE',
    iconSubtitle: '#DEDEDE',
    textLighter: '#DEDEDE',
    noticeText: '#DEDEDE',
    lecturerNameText: '#DEDEDE',
    icon: colors.white,
    checkboxChecked: '#A8F5EB',
    checkboxUnchecked: colors.white,

    tabs: {
        ...themeColorsDark.tabs,
        tabIconSelected: '#A8F5EB',
        tabIconDefault: colors.white,
        tabTitleSelected: '#A8F5EB',
        tabIndicator: '#A8F5EB',
        activeTab: '#A8F5EB',
        inactiveTab: colors.white,
    },
};