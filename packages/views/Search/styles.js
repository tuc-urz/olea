export default function(theme) {
    return {
        container: {
            flex: 1,
        },
        containerInner: {
            flex: 1,
            backgroundColor: theme.colors.contentBackground
        },
        containerLoading: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
        },
        tabs: {
            backgroundColor: theme.colors.primary,
        },
        tab: {
            ...theme.fonts.medium,
        },
        tabBarContainer: {
            position: 'relative',
            zIndex: 2
        },
        tabIndicator: {
            backgroundColor: theme.colors.tabs.tabIndicator,
            height: 5
        },
        searchBar: {
            borderRadius: 0,
            height: 50,
            paddingHorizontal: theme.paddings.small,
            shadowOpacity: 0.0,
            borderBottomColor: theme.colors.accent,
            borderBottomWidth: 1,
            fontSize: theme.fontSizes.searchBar
        },
        searchBarInput: {
            fontSize: theme.fontSizes.xl
        },
        activity: {
            marginTop: theme.paddings.default,
            width: 160,
            height: 160
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
            color: theme.colors.text,
            textAlign: 'center',
            marginTop: theme.paddings.default,
            marginLeft: theme.paddings.default,
            marginRight: theme.paddings.default,
        },

    }
};
