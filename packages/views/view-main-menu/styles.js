export default function(theme) {
    return {
        container: {
            flex: 1,
            paddingTop: 0,
            backgroundColor: theme.colors.background,
        },
        optionTextContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            paddingHorizontal: 20,
            alignContent: 'center'
        },
        optionsTitleText: {
            fontSize: theme.fontSizes.l,
            textAlign: 'left'
        },
        optionIconContainer: {
           flex: 0.2
        },
        option: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 0,
            paddingVertical: 5,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.accent
        },
        optionText: {
            flex: 1,
            fontSize: theme.fontSizes.subtitle,
            marginTop: 1,
            alignSelf: 'center'
        },
        selectOption: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    }
};
