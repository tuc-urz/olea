export default function(theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.contentBackground,
        },
        containerInner: {
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 20
        },
        activity: {
            marginTop: 20
        },
        listTitle: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
            lineHeight: theme.lineHeights.xs
        },
        listDescription: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.s,
            lineHeight: theme.lineHeights.xxs,
            color: theme.colors.categoryBadgeColor,
        },
        titleHeadline : {
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            marginBottom: theme.paddings.small,
            paddingHorizontal: 15
        },
        buttonText: {
            ...theme.fonts.medium,
            color: theme.colors.messages.noticeText,
            marginLeft: theme.paddings.small
        },
        buttonHeadline: {
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l
        },
        buttonContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: theme.paddings.large + theme.paddings.default
        },
        button: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.paddings.small,
        },
        campusFinderUrl: {
            backgroundColor: theme.colors.primary,
            marginBottom: theme.paddings.small + theme.paddings.xsmall
        }
    };
}
