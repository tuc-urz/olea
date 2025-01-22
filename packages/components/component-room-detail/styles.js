export default function(theme) {
    return {
        titleHeadline : {
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            marginBottom: theme.paddings.small
        },
        container: {
            flex: 1,
        },
        containerInner: {
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 20
        },
        activity: {
            marginTop: 20
        },
        badges: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 10
        },
        badge: {
            marginRight: 5,
            marginBottom: 5
        },
        title: {
            paddingLeft: 15
        },
        buttonText: {
            color: theme.colors.messages.noticeText,
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            marginLeft: theme.paddings.small
        },
        buttonContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: theme.paddings.large + theme.paddings.default
        },
        button: {
            ...theme.themeStyles.button,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.paddings.small,
        },
        campusFinderUrl: {
            marginBottom: theme.paddings.small + theme.paddings.xsmall
        }
    };
};
