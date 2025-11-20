export default function (theme, width, height) {

  const roundButtonWidth = width / 5;

  return {
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: theme.paddings.default,
      paddingVertical: theme.paddings.small,
      paddingTop: theme.paddings.xsmall,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: theme.paddings.small,
    },
    headline: {
      ...theme.fonts.regular,
      fontSize: theme.fontSizes.m,
      textTransform: 'uppercase'
    },
    roundButtons: {
      width: roundButtonWidth,
      height: roundButtonWidth,
      borderRadius: roundButtonWidth / 2,
      backgroundColor: theme.colors.quicklinksBackground,
      justifyContent: "center",
      alignItems: "center"
    },
    badgeContainer: {
      position: 'absolute',
      width: roundButtonWidth,
    },
    badge: {
      backgroundColor: 'red',
    },
    quicklinkLabel: {
      color: theme.colors.primaryText,
      fontSize: theme.fontSizes.s,
      lineHeight: theme.fontSizes.subtitle * 1.1,
      textAlign: 'center',
    },
  }
};
