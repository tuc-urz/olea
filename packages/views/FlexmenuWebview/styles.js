export default function(theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        contentContainer: {
            paddingTop: 0
        },
        titleStyle: {
          ...theme.fonts.medium,
          fontSize: theme.fontSizes.xxl,
          alignSelf: "center"
        }
    }
};
