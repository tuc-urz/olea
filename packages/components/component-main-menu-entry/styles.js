export default function (theme) {
    return {
        textContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            paddingHorizontal: 20,
            alignContent: 'center'
        },
        iconContainer: {
            flex: 0.2
        },
        entry: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 0,
            paddingVertical: 5,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.accent
        },
        titleText: {
            flex: 1,
            fontSize: theme.fontSizes.subtitle,
            marginTop: 1,
            alignSelf: 'center'
        },
    }
};
