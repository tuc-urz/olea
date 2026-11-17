import { Platform, Dimensions } from 'react-native'

export default function (theme) {
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const headerImageHeight = height / 2
  return {
    appHeader: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'baseline'
    },
    appHeaderSearchButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? theme.paddings.default : theme.paddings.xlarge,
      right: theme.paddings.default

    },
    appHeaderSearch: {},
    appHeaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      height: headerImageHeight
    },
    universityTitle: {
      marginTop: theme.paddings.large,
      marginLeft: theme.paddings.default,
      color: theme.colors.primaryText,
      fontSize: theme.fontSizes.universityTitle,
      ...theme.fonts.bold,
      lineHeight: theme.lineHeights.xxl,
      textAlign: 'left',
      alignSelf: 'flex-start',
      marginBottom: theme.paddings.small
    },
    newsImage: {
      height: width * 9 / 16,
      width
    },
    backgroundImageWrapper: {
      height: headerImageHeight,
      width,
      marginTop: 0,
      backgroundColor: theme.colors.primary,
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundImage: {
      position: 'absolute',
      top: -10,
      left: 0,
      right: 0,
      bottom: 0
    },
    imageOverlay: {
      height: headerImageHeight,
      width,
      flex: 1
    },
    newsItem: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.paddings.default,
      paddingTop: theme.paddings.default
    },
    newsItemCategory: {
      marginBottom: 5,
      fontSize: theme.fontSizes.s,
      color: theme.colors.text
    },
    newsItemTitle: {
      ...theme.fonts.bold,
      fontSize: theme.fontSizes.xxl,
      lineHeight: theme.lineHeights.titleBigger,
      marginBottom: theme.paddings.small,
      color: theme.colors.text
    },
    newsItemText: {
      ...theme.fonts.regular,
      fontSize: theme.fontSizes.m,
      lineHeight: theme.lineHeights.s,
      color: theme.colors.text
    },
    newsItemReadMore: {
      textDecorationLine: 'underline',
      color: theme.colors.textAccent
    },
    newsItemActionbar: {
      borderBottomColor: theme.colors.accent,
      borderBottomWidth: 1,
      // borderStyle: 'dotted', // TODO Not available on iOS at the moment (also dashed)
      borderStyle: 'solid',
      paddingBottom: theme.paddings.small,
      marginTop: theme.paddings.small,
      flex: 1,
      flexDirection: 'row'
    },
    newsItemDate: {
      fontSize: theme.fontSizes.s,
      ...theme.fonts.bold,
      color: theme.colors.subtitle,
      flex: 1,
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row'
    },
    newsItemAuthor: {
      fontSize: theme.fontSizes.s,
      ...theme.fonts.bold,
      color: theme.colors.subtitle,
      flex: 1,
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row'
    },
    newsItemActions: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    },
    newsItemAction: {
      marginRight: -4
    },
    modalContainer: {
      flex: 1
    }
  }
};
