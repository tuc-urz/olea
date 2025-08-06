import color from "color";

export const colors = {
    black: '#000000',
    white: '#ffffff',
    grayLight1: '#d8d8d8',
    grayLight2: '#ddd',
    grayLight3: '#fefefe',
    grayLight4: color('#BEC3C6').alpha(0.4).rgb().string(),
    grayLight5: '#F5F5F5',
    grayDark1: '#545454',
    grayDark2: '#3d3d3d',
    grayDark3: '#CED0CE',

    green: '#1e8f39',
    yellow: '#f0c808',
    red: '#e53935',
    primary: '#70e0d0',
    accent: '#006d70',
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
    color(colors.grayLight4).alpha(0.3).rgb().string(),
    color(colors.grayLight4).alpha(0.1).rgb().string(),
    color(colors.grayLight4).alpha(0.05).rgb().string()
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
    col1Background: color(colors.primary).alpha(1).rgb().string(),
    col2Background: color(colors.primary).alpha(0.8).rgb().string(),
    col3Background: color(colors.primary).alpha(0.6).rgb().string(),
    col1Text: colors.black,
    col2Text: colors.black,
    col3Text: colors.black,
    disabled: color(colors.primary).alpha(0.2).rgb().string(),
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
    appbarIconColor: colors.black,
    appbarSubtitle: colors.standardDescription,
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
    disabled: color(colors.black)
    .alpha(0.26)
    .rgb()
    .string(),
    placeholder: color(colors.black)
    .alpha(0.54)
    .rgb()
    .string(),
    backdrop: color(colors.black)
    .alpha(0.5)
    .rgb()
    .string(),
    notification: colors.accent,
    overlayColor: color(colors.primary)
        .alpha(0.47)
        .rgb()
        .string(),
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
    lecturerNameText: colors.grayDark2,
    buttonText: colors.black,
    buttonBackground: colors.primary,
    tapeColor: color(colors.primary)
            .alpha(0.7)
            .rgb()
            .string(),
    jobsTitleColor: colors.black,
    textInput: colors.black,
    textInputSelection: colors.grayDark3,
    timeTableRoom: colors.primary,
    textLighter: colors.standardDescription,
    quicklinksBackground: colors.primary,
    eventContainerBackground: colors.primary,
    eventContainerSidebar: colors.primary,
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
    overlayColor: color(colors.primary)
        .alpha(0.65)
        .rgb()
        .string(),
    appbarSubtitle: colors.accent,
    eventContainerBackground: colors.primary,
    eventContainerSidebar: colors.primary,
};
