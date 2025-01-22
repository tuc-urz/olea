export default function(theme) {
    return {
        container: {
            flex: 1,
        },
        containerInner: {
            flex: 1,
            paddingHorizontal: theme.paddings.default,
            paddingVertical: theme.paddings.default
        },
        activity: {
            marginTop: theme.paddings.default
        },
        badges: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: theme.paddings.small
        },
        badge: {
            marginRight: theme.paddings.xsmall,
            marginBottom: theme.paddings.xsmall
        },
        name: {
            paddingLeft: theme.paddings.xsmall + theme.paddings.small,
            fontSize: theme.fontSizes.title,
            lineHeight: theme.lineHeights.contactName
        },
        space: {
            height: theme.paddings.large
        }
    };
}
