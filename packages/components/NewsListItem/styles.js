export default function(theme) {
    return {
        contentContainer: {
            paddingTop: theme.paddings.default,
            paddingLeft: theme.paddings.default,
            paddingRight: theme.paddings.default,
            marginBottom: theme.paddings.default
        },
        publicationDate: {
            ...theme.fonts.bold,
            marginTop: 3,
            paddingLeft: theme.paddings.small,
        },
        image: {
            aspectRatio: 16/9,
            paddingBottom: theme.paddings.small,
        },
        title: {
            ...theme.fonts.bold,
            fontSize: theme.fontSizes.subtitle,
            lineHeight: theme.lineHeights.titleSmall,
            marginTop: theme.paddings.default,
            marginBottom: theme.paddings.small,
        },
        description: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.itemText,
            lineHeight: theme.lineHeights.s,
            marginBottom: theme.paddings.small,
       }
    }
};
