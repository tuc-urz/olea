export default function (theme) {
  return {
    selectOption: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    listItemTitle: {
      fontSize: theme.fontSizes.l,
      color: theme.colors.text
    },
    listItemDescription: {
      fontSize: theme.fontSizes.m,
      color: theme.colors.textLighter
    },
    colorSchemeHeading: {
      marginHorizontal: 24,
      marginBottom: 4,
      fontSize: theme.fontSizes.m,
      fontWeight: '600',
      color: theme.colors.text
    },
    colorSchemeOption: {
      paddingLeft: 24,
      paddingRight: 16,
      paddingVertical: 0,
      minHeight: 48
    },
    accentColorItem: {
      marginTop: 16,
      paddingHorizontal: 16
    },
    accentColorSwatch: {
      alignSelf: 'center',
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.text,
      marginHorizontal: theme.paddings.small
    },
    buttonLabel: {
      fontSize: theme.fontSizes.m,
      color: theme.colors.text
    },
    dialogTitle: {
      fontSize: theme.fontSizes.l,
      lineHeight: theme.lineHeights.xxl,
      color: theme.colors.text
    },
    dialogContent: {
      fontSize: theme.fontSizes.m,
      color: theme.colors.text
    }
  }
}
