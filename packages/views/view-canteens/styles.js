export default function(theme) {
    return {
        container: {
            flex: 1
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
        },
        optionTextContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        optionsTitleText: {
            fontSize: theme.fontSizes.l,
            marginLeft: 15,
            marginTop: 0,
            marginBottom: 0,
            textAlign: 'left'
        },
        optionIconContainer: {
            marginRight: 9,
        },
        option: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 0,
            paddingVertical: 0,
            borderBottomWidth: 0.4,
            borderBottomColor: theme.colors.accent,
        },
        optionText: {
            fontSize: theme.fontSizes.m,
            marginTop: 1,
        },
        cardTitle: {
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginBottom: 0
        },
        cardContent: {
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: theme.paddings.small
        },
        favorite: {
          backgroundColor: theme.colors.secondary
        },
        header: {
            backgroundColor: theme.colors.background,
            padding: 10,
            flexDirection: "row",
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        content: {
            backgroundColor: theme.colors.background,
            flex: 1
        },
        headerText: {
            fontSize: theme.fontSizes.l,
            ...theme.fonts.light,
            marginTop: 10,
            marginBottom: 10
        },
        accordian: {
            borderBottomColor: theme.colors.accent,
            borderBottomWidth: 1
        },
        arrowIcon: {
            marginStart: 'auto',
            marginEnd: 10,
        },
        tabItem: {
            paddingHorizontal: 16
        },
        tabDay: {
            textAlign: "center",
            fontSize: theme.fontSizes.xxl,
            color: theme.colors.primary
        },
        tabDate: {
            ...theme.fonts.medium,
            textAlign: "center",
            color: theme.colors.primary,
        }
    }
};
