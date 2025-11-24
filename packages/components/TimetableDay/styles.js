export default function (theme) {
    return {
        eventContainer: {
            borderLeftWidth: 4,
            backgroundColor: theme.colors.eventContainerBackground,
            padding: 10,
            marginBottom: 10,
            marginRight: 10,
            borderRadius: 8,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            overflow: 'visible',
        },

        eventHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 0,
        },
        eventTitle: {
            color: theme.colors.text,
            fontSize: 14,
            fontWeight: 'bold',
            flex: 1,
            paddingRight: 10,
        },
        eventType: {
            color: theme.colors.text,
            fontSize: 13,
        },
        eventProfessor: {
            color: theme.colors.text,
            fontSize: 13,
            paddingTop: 4,
        },
        eventFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
        },
        eventTime: {
            fontSize: 13,
            color: theme.colors.text,
            flex: 1,
        },
        eventRoom: {
            fontSize: 13,
            color: theme.colors.text,
            textAlign: 'right',
            flex: 1,
        },
        highlightDateContainer: {
            borderRadius: 100,
            borderWidth: 3,
            borderColor: 'red',
            height: 48,
            width: 48,
        },
        courseCard: {
            paddingLeft: 5,
        },
        courseTimeContainerBigFont: {
            width: "25%",
        },
        timeText: {
            fontSize: theme.fontSizes.subtitle,
            paddingTop: theme.paddings.small,
            paddingBottom: theme.paddings.small
        },
        timeTextBig: {
            fontSize: theme.fontSizes.m
        },

        courseContainerBigFont: {
            width: "75%",
        },
        type: {
            fontSize: theme.fontSizes.subtitle,
            color: theme.colors.subtitle
        },
        strip: {
            height: 65,
            paddingTop: 5,
            paddingBottom: 5,
            elevation: 5,
            backgroundColor: '#fff',
        },
        stripShadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        hourStyle: {
            fontSize: 12,
            color: theme.colors.text,
        },
    };
}
