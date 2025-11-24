export default function(theme) {
    return {
        container: {
            flex: 1
        },
        innerContainer: {
            flex: 1,
        },
        activity: {
            margin: 40
        },
        newsTitle: {
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.xxl,
            marginBottom: theme.paddings.default
        },
        newsDate: {
            ...theme.fonts.bold,
            marginTop: 3,
            paddingLeft: theme.paddings.small
        },
        newsContent: {
            paddingTop: theme.paddings.default,
            paddingLeft: theme.paddings.default,
            paddingRight: theme.paddings.default
        },
        newsIcon: {
            paddingRight: theme.paddings.xsmall
        }
    }
};
