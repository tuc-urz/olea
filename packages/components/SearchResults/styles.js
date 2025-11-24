export default function(theme) {
    return {
        container: {
            flex: 1
        },
        tabs: {
            backgroundColor: theme.colors.primary
        },
        tab: {
            ...theme.fonts.medium
        },
        tabIndicator: {
            backgroundColor: theme.colors.tabs.tabIndicator,
            height: 5
        },
        searchBar: {
            borderRadius: 0,
            height: 55
        },
        resultsContainer: {

        },
        activity: {
            marginTop: theme.paddings.default
        },
        modalContainer: {
            flex: 1,
            //paddingTop: 50
        },
        modalContainerInner: {
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 20
        },
        containerErrorMsg: {
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            margin: theme.paddings.default
        },
        title : {
            fontSize: theme.fontSizes.title,
            color: theme.colors.text,
            textAlign: 'center',
            marginTop: theme.paddings.default,
            marginLeft: theme.paddings.default,
            marginRight: theme.paddings.default
        },
        subtitle : {
            fontSize: theme.fontSizes.subtitle,
            color: theme.colors.subtitle,
            textAlign: 'center',
            marginTop: theme.paddings.default,
            marginLeft: theme.paddings.default,
            marginRight: theme.paddings.default
        }
    }
};
