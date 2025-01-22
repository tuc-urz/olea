export default function(theme) {
    return {
        container: {
            flex: 1
        },
        innerContainer: {
            flex: 1
        },
        cardContent: {
            paddingLeft: theme.paddings.large,
            paddingTop: theme.paddings.small,
            paddingBottom: theme.paddings.small
        },
        screenView: {
          flex: 1
        },
        tabHeaderText: {
          ...theme.fonts.medium,
          color: theme.colors.primaryText
        },
        tabHeaderView: {
          backgroundColor: theme.colors.primary,
          alignItems: "center",
          padding: theme.paddings.xsmall
        }
    }
};
