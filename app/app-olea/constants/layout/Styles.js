
import fonts from './Fonts';
import paddings from './Paddings';

export const getStyles = (colors, fontSizes, lineHeights) => ({
    webview: {
        backgroundColor: colors.contentBackground
    },
    tabs: {
        backgroundColor: colors.primary,
    },
    tab: {
        ...fonts.medium,
        fontSize: fontSizes.m,
        color: colors.primaryText
    },
    tabIndicator: {
        backgroundColor: colors.tabs.tabIndicator,
        height: 5
    },
    appSafeAreaContainer: {
        flex: 1,
        backgroundColor: colors.safeAreaBackground
    },
    safeAreaContainer: {
        flex: 1,
        backgroundColor: colors.background
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: colors.contentBackground
    },
    cardLeftIcon: {
        justifyContent: 'center',
        alignContent: 'center',
        paddingRight: paddings.default
    },
    cardLeftImage: {
        justifyContent: 'center',
        alignContent: 'center',
        paddingRight: paddings.default
    },
    card: {
        marginLeft: paddings.default,
        marginRight: paddings.default,
        marginTop:   paddings.default,
        backgroundColor: colors.background,
        paddingVertical: paddings.small,
        paddingHorizontal: paddings.default,
        flex: 1,
        flexDirection: 'row',
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 0.32,
        elevation: 3
    },
    cardSmall: {
        marginLeft: paddings.small,
        marginRight: paddings.small,
        marginBottom: paddings.default,
    },
    cardWithImage: {
        marginLeft: paddings.default,
        marginRight: paddings.default,
        marginTop:   paddings.default,
        backgroundColor: colors.background,
        flex: 1,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.22,
        elevation: 3
    },
    cardWithImageContent: {
        padding: paddings.small,
        backgroundColor: colors.background
    },
    cardImage: {
        overflow: "hidden",
    },
    cardPlaceboImage: {
        width: 50,
        height: 50
    },
    cardContent: {
        flex: 0,
        flexDirection: 'column',
        width: 0,
        flexGrow: 1
    },
    cardRightIcon: {
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: paddings.default
    },
    cartHeaderSplit: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.accent
    },
    cartHeaderSplitImage: {
        flex: 0.45,
        overflow: "hidden"
    },
    cartHeaderSplitDetails: {
        flex: 0.55,
        paddingVertical: paddings.small,
        paddingHorizontal: paddings.default
    },
    cartHeaderDetails: {
        flex: 1,
        paddingVertical: paddings.small,
        paddingHorizontal: paddings.default
    },
    cardTitle: {
        fontSize: fontSizes.l,
        ...fonts.light,
        lineHeight: lineHeights.s,
        flex: 1,
        flexWrap: 'wrap',
        marginBottom: paddings.xsmall
    },
    cardSubTitle: {
        fontSize: fontSizes.s,
        ...fonts.regular,
        lineHeight: lineHeights.xxs,
        color: colors.subtitle
    },
    cardText: {
        ...fonts.regular,
        fontSize: fontSizes.s,
        lineHeight: lineHeights.xxs,
        color: colors.text
    },
    cardLinkExternal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'center',
        alignItems: 'center',
        padding: paddings.small
    },
    cardLinkTextExternal: {
        ...fonts.medium,
        textTransform: 'uppercase',
        color: colors.subtitle,
        fontSize: fontSizes.s,
        lineHeight: lineHeights.xxs,
        textAlign: 'right',
        marginRight: paddings.small
    },
    noItemsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    noItems: {
        padding: paddings.default,
        fontSize: fontSizes.l,
        ...fonts.light,
        lineHeight: lineHeights.s
    },
    noticeTextContainer: {
        padding: paddings.default,
        fontSize: fontSizes.l,
        ...fonts.light,
        lineHeight: lineHeights.s,

    },
    noticeText: {
        color: colors.noticeText
    },
    newsItemTitle: {
        fontSize: fontSizes.xxl
    },
    searchDetailTitle: {
        fontSize: fontSizes.l
    },
    textLighter: {
        fontSize: fontSizes.m,
        color: colors.textLighter
    },
    button: {
        backgroundColor: colors.buttonBackground,
    }
});
