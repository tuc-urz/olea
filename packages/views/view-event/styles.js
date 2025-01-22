export default function(theme) {
    return {
      activity: {
        padding: 20
      },
      arrowIcon: {
        marginStart: 'auto',
        marginEnd: 10,
      },
      companyCity:{
        fontSize: theme.fontSizes.s,
        paddingTop: theme.paddings.xsmall,
        color: theme.colors.secondaryText
      },
      container: {
          flex: 1,
          backgroundColor: theme.colors.background,
      },
      containerErrorMsg: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        margin: theme.paddings.default,
      },
      content: {
        backgroundColor: theme.colors.background,
        flex: 1,
        padding: "2%",
      },
      date:{
        fontSize: theme.fontSizes.s,
        paddingTop: theme.paddings.xsmall
      },
      header: {
        backgroundColor: theme.colors.background,
        padding: 10,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      headerText: {
        fontSize: theme.fontSizes.l,
        ...theme.fonts.light,
        marginTop: 10,
        marginBottom: 10
      },
      innerContainer: {
        padding: 40,
        marginTop: 200
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
    }
};
