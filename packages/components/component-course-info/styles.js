export default function(theme) {
    return {
        container: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme.paddings.default,
            paddingVertical: theme.paddings.small,
            paddingBottom: 0
        },
        innerContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: theme.paddings.small,
            paddingHorizontal: theme.paddings.default,

        },
        iconContainer: {
            paddingTop: theme.paddings.xsmall / 2,
            paddingBottom: theme.paddings.xsmall / 2,
            paddingRight: theme.paddings.small,
        },
        contentContainer: {
            flex: 1,
            padding: theme.paddings.xsmall
        },
        headline: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
            textTransform: 'uppercase'
        },
        title: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
        },
        modalContainer: {
            flex: 1
        }
    }
};
