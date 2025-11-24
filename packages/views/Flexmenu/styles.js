export default function(theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        contentContainer: {
            paddingTop: 0
        },
        titleStyle: {
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xxl,
            alignSelf: "center",
        },
        cardContent: {
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
        cardTitle: {
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: theme.fontSizes.l,
            ...theme.fonts.light,
        },
        cardImage: {
            justifyContent: 'center',
            alignContent: 'center',
            paddingRight: theme.paddings.default,
        },
        cardSubTitle: {
            width: 250,
            fontSize: theme.fontSizes.s,
            ...theme.fonts.regular,
            lineHeight: theme.lineHeights.xxs,
            color: theme.colors.subtitle,
            marginTop: theme.paddings.xsmall
        },
        title : {
            fontSize: theme.fontSizes.title,
            color: theme.colors.text,
            textAlign: 'center',
            marginTop: theme.paddings.default,
            marginLeft: theme.paddings.default,
            marginRight: theme.paddings.default,
        },
        subtitle : {
            fontSize: theme.fontSizes.subtitle,
            color: theme.colors.subtitle,
            textAlign: 'center',
            marginTop: theme.paddings.default,
            marginLeft: theme.paddings.default,
            marginRight: theme.paddings.default,
        },
        containerErrorMsg: {
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            margin: theme.paddings.default,
        },
    }
};
