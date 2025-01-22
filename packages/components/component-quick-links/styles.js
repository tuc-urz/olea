import Responsive from 'react-native-lightweight-responsive';

const width = Responsive.width(75);
const height = Responsive.width(75);

export default function (theme) {
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
      width: width,
      height: height,
      borderRadius: width / 2,
      backgroundColor: theme.colors.quicklinksBackground,
      justifyContent: "center",
      alignItems: "center"
    },
    quicklinkLabel: {
      color: theme.colors.primaryText,
      fontSize: theme.fontSizes.s,
      textAlign: 'center',
    },
  }
};