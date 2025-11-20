import {Dimensions} from "react-native";

export default function(theme) {
    const width = Dimensions.get('window').width;
    return {
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
            paddingHorizontal: 0
        },
        badge: {
            backgroundColor: theme.colors.categoryBadgeBackgroundColor,
            color: theme.colors.categoryBadgeColor,
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
            lineHeight: theme.lineHeights.xs,
            paddingHorizontal: theme.paddings.default,
            paddingVertical: theme.paddings.xsmall,
            marginRight: theme.paddings.default,
            marginBottom: theme.paddings.default,
            borderRadius: 0,
            minWidth: 80,
            height: 'auto'
        },
        badgeFullWidth: {
            flex: 1,
            textAlign: 'left',
            marginRight: 0
        },
        badgeLabel: {
            flex: 0,
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
            lineHeight: theme.lineHeights.xs,
            width: width,
            marginBottom: theme.paddings.xsmall
        },
        bookHeader: {
            flex: 0,
            flexDirection: 'row',
            elevation: 1,
            marginBottom: theme.paddings.default
        },
        bookImage: {
            flex: 0.4,
            minHeight: 200
        },
        bookTitle: {
            flex: 0.6,
            padding: theme.paddings.small
        },
        bookTitleFull: {
            flex: 1,
            padding: theme.paddings.small
        },
        bookTitleHeadline: {
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            marginBottom: theme.paddings.small
        },
        bookTitleSubline: {
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.m,
            lineHeight: theme.lineHeights.s,
            color: theme.colors.subtitle
        },
        bookDetails: {
            flex: 1,
            flexDirection: 'column'
        },
        holdingBranch: {
            paddingHorizontal: theme.paddings.xsmall,
            paddingVertical: theme.paddings.xsmall,
            flexWrap: 'wrap',
            padding: 0,
            backgroundColor: theme.colors.bookHoldingBackgroundColor,

        },
        holdingTitle: {
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.m,
            lineHeight: theme.lineHeights.xs,
            color: theme.colors.bookHoldingColor
        },
        holdingDescription: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
            lineHeight: theme.lineHeights.xs,
            color: theme.colors.subtitle
        },
        holdingContainer: {
            elevation: 0,
            marginBottom: 10
        },
        notAvailable: {
            backgroundColor: theme.colors.categoryBadgeBackgroundColor,
            color: theme.colors.categoryBadgeColor,
            paddingHorizontal: theme.paddings.default,
            paddingVertical: theme.paddings.xsmall,
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
            lineHeight: theme.lineHeights.xs,
        },
        availableCount: {
            textAlign: 'right',
            textTransform: 'none',
            ...theme.fonts.regular,
            color: theme.colors.grayLight1,
            fontSize: theme.fontSizes.m
        }
    };
}
