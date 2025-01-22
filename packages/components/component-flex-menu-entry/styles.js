export default function (theme) {
    return {
        cardContent: {
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
        title: {
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: theme.fontSizes.l,
            ...theme.fonts.light,
        },
        leftIconImage: {
            justifyContent: 'center',
            alignContent: 'center',
            paddingRight: theme.paddings.default,
        },
        description: {
            width: 250,
            fontSize: theme.fontSizes.s,
            ...theme.fonts.regular,
            lineHeight: theme.lineHeights.xxs,
            color: theme.colors.subtitle,
            marginTop: theme.paddings.xsmall
        },
    }
};