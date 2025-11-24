export default function (theme) {
  return {
    mainContentContainer: {
      flex: 1,
      backgroundColor: theme.colors.contentBackground,
    },
    paragraph: {
      paddingTop: theme.paddings.default,
      paddingLeft: theme.paddings.default,
      paddingRight: theme.paddings.default
    },
    paragraphText: {
      fontSize: theme.fontSizes.l,
      lineHeight: theme.lineHeights.l
    },
    importButtonLabel: {
      fontSize: theme.fontSizes.l,
      lineHeight: theme.lineHeights.l
    },
    importTextInputContainer: {
      paddingLeft: theme.paddings.default,
      paddingRight: theme.paddings.default
    },
    link: {
      textDecorationLine: 'underline',
    },
  }
};
