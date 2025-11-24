export default function(theme) {
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
            paddingHorizontal: 10
        },
        badge: {
            marginRight: 5,
            marginBottom: 5
        },
        bookHeader: {
            flex: 0,
            flexDirection: 'row',
            marginBottom: 20
        },
        bookImage: {
            flex: 0.4,
            maxHeight: 300
        },
        bookTitle: {
            flex: 0.6,
            paddingLeft: 15
        },
        bookDetails: {
            flex: 1,
            flexDirection: 'column'
        },
        holdingBranch: {
            flexWrap: 'wrap'
        },
        starIcon: {
            marginRight: theme.paddings.default
        }
    };
}
