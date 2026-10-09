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
            color: theme.colors.text,
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
            color: theme.colors.text,
            marginTop: theme.paddings.xsmall
        },
    }
};