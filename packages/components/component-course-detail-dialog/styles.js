import {Dimensions} from "react-native";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function(theme) {
    return {
        courseCard: {
            paddingLeft: 5,
        },
        verticalSeperator: {
          height: "100%",
          marginLeft: theme.paddings.small,
          width: 1,
          backgroundColor: theme.colors.listSeperator
        },
        verticalSeperatorSmall: {
          height: "15%",
          width: 1,
          backgroundColor: theme.colors.listSeperator,

        },
        courseTimeContainer: {
          width:"15%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:theme.colors.background
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
          width:"85%",
          backgroundColor:theme.colors.background,
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
        otherCourseContainer:{
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
    }
};
