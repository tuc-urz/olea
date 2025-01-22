export default function(theme) {
    return {
        contentStyleBigFont: {
            paddingHorizontal: 0
        },
        titleStyle: {
            fontSize: theme.fontSizes.xxl,
            lineHeight: theme.lineHeights.l,
            ...theme.fonts.medium
        },
        titleBigFont: {
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            ...theme.fonts.medium
        },
        subtitle: {
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.s,
            color: theme.colors.appbarSubtitle
        },
        subtitleBigFont: {
            fontSize: theme.fontSizes.s,
            lineHeight: theme.lineHeights.xxs,
            color: theme.colors.appbarSubtitle
        }
    };
}
