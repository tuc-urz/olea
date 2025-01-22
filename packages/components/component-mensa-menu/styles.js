export default function(theme) {
    return {
        container: {
            backgroundColor: theme.colors.white,
            flex: 1
        },
        innerContainer: {
            flex: 1,
        },
        activity: {
            margin: 40
        },
        mealDate: {
            ...theme.fonts.bold,
            marginTop: theme.paddings.xsmall,
            paddingLeft: theme.paddings.small,
        },
        mealContent: {
            paddingTop: theme.paddings.default,
            paddingLeft: theme.paddings.default,
            paddingRight: theme.paddings.default,
            marginBottom: theme.paddings.default
        },
        listSeperator: {
            height: 1,
            backgroundColor: theme.colors.listSeperator,
        },
        mealImage: {
            aspectRatio: 16/9,
            paddingBottom: theme.paddings.small,
        },
        mealItemTitle: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            marginTop: theme.paddings.default,
            marginBottom: theme.paddings.default,
        },
        mealItemTitleText: {
            ...theme.fonts.bold,
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.l,
        },
        mealItemTitleIcons: {
            marginLeft: 5,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
        mealItemPrice: {
            ...theme.fonts.bold,
            marginTop: theme.paddings.xsmall,
            color: theme.colors.textAccent
        },
        mealItemText: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.l,
            marginBottom: theme.paddings.default,
        },
        mealItemNoVisible: {
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.l,
            marginBottom: theme.paddings.small,
            color: theme.colors.noticeText,
        },
        buttonLabel: {
            fontSize: theme.fontSizes.m
        },
        addionalInformation: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        addionals: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom:theme.paddings.small,
            paddingTop:theme.paddings.small,
        },
        dialogTitle: {
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.xxl
        },
        dialogContent: {
            fontSize: theme.fontSizes.m
        },

    }
};
