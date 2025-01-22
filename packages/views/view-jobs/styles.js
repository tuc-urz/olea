import {Dimensions} from 'react-native';

export default function(theme) {
    return {
      container: {
          flex: 1,
          backgroundColor: theme.colors.background,
      },
      title:{
        fontSize: theme.fontSizes.xxl,
        color: theme.colors.jobsTitleColor
      },
      titleNoJobs:{
        fontSize: theme.fontSizes.xxl,
        color: theme.colors.jobsTitleColor,
        textAlign: 'center',
        marginBottom: theme.paddings.default
      },
      companyCity:{
        fontSize: theme.fontSizes.s,
        paddingTop: theme.paddings.xsmall,
        color: theme.colors.secondaryText
      },
      date:{
        fontSize: theme.fontSizes.s,
        paddingTop: theme.paddings.xsmall
      },
      activity: {
          padding: 20
      },
      innerContainer: {
          padding: 40,
          marginTop: 200
      },
      containerErrorMsg: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        margin: theme.paddings.default,
      },
    }
};
