import { Dimensions } from "react-native";
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function (theme) {
  return {
    eventContainer: {
      borderLeftWidth: 4,
      backgroundColor: theme.colors.eventContainerBackground,
      padding: 10,
      marginBottom: 10,
      marginRight: 10,
      borderRadius: 8,
      elevation: 5, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      overflow: 'visible',
    },
    
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 0,
    },
    eventTitle: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: 'bold',
      flex: 1,
      paddingRight: 10,
    },
    eventType: {
      color: theme.colors.text,
      fontSize: 13,
    },
    eventProfessor: {
      color: theme.colors.text,
      fontSize: 13,
      paddingTop: 4,
    },
    eventFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    eventTime: {
      fontSize: 13,
      color: theme.colors.text,
      flex: 1,
    },
    eventRoom: {
      fontSize: 13,
      color: theme.colors.text,
      textAlign: 'right',
      flex: 1,
    },
    highlightDateContainer: {
      borderRadius: 100,
      borderWidth: 3,
      borderColor: 'red',
      height: 48,
      width: 48,
    },
    courseCard: {
      paddingLeft: 5,
    },
    courseTimeContainer: {
      width: "15%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background
    },
    courseTimeContainerBigFont: {
      width: "25%",
    },
    timeText: {
      fontSize: theme.fontSizes.subtitle,
      paddingTop: theme.paddings.small,
      paddingBottom: theme.paddings.small
    },
    timeTextBig: {
      fontSize: theme.fontSizes.m
    },
    courseContainer: {
      flex: 1,
      flexDirection: "column",
      paddingLeft: theme.paddings.small,
      width: "85%",
      backgroundColor: theme.colors.background,
      paddingTop: theme.paddings.xsmall,
      paddingBottom: theme.paddings.xsmall
    },
    courseContainerBigFont: {
      width: "75%",
    },
    type: {
      fontSize: theme.fontSizes.subtitle,
      color: theme.colors.subtitle
    },
    title: {
      fontSize: theme.fontSizes.xl,
      paddingTop: theme.paddings.xsmall,
    },
    titleBigFont: {
      fontSize: theme.fontSizes.xl,
      paddingTop: theme.paddings.xsmall,
    },
    room: {
      fontSize: theme.fontSizes.l,
      paddingTop: theme.paddings.xsmall,
      fontWeight: "bold",
    },
    addLeftRightPadding: {
      paddingLeft: theme.paddings.xsmall,
      paddingRight: theme.paddings.xsmall,
    },
    professorText: {
      fontSize: theme.fontSizes.l,
      paddingTop: theme.paddings.xsmall,
      color: theme.colors.subtitle
    },
    professorName: {
      color: theme.colors.lecturerNameText
    },
    otherCourseContainer: {
      padding: theme.paddings.xsmall,
      width: "100%",
      backgroundColor: theme.colors.background
    },
    btnPosition: {
      position: 'absolute',
      bottom: 7,
      right: 7
    },
    textDetail: {
      fontSize: theme.fontSizes.l,
      paddingTop: theme.paddings.small,
    },
    textDetailBigFont: {
      fontSize: theme.fontSizes.xl,
      paddingTop: theme.paddings.small,
    },
    indentedText: {
      marginLeft: 10,
    },
    detailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailLabel: {
      width: '25%',
    },
    detailValue: {
      flexShrink: 1,
      width: '70%',
    },
    strip: {
      height: 65, 
      paddingTop: 5, 
      paddingBottom: 5,
      elevation: 5,
      backgroundColor: '#fff',
    },
    stripShadow:{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    hourStyle: {
      fontSize: 12,
      color: theme.colors.text,
    },
  };
}
