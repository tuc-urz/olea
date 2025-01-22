import {Dimensions} from "react-native";
import { tabColors } from "../../../apps/app-tuc/constants/layout/Colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function(theme) {
    return {
        card: {
          marginLeft: theme.paddings.default,
          marginRight: theme.paddings.default,
          marginTop:   10,
          marginBottom: 10,
          backgroundColor: theme.colors.background,
          paddingVertical: theme.paddings.small,
          paddingHorizontal: theme.paddings.default,
          flex: 1,
          flexDirection: 'row',
          shadowColor: theme.colors.shadow,
          shadowOffset: {
              width: 0,
              height: 1,
          },
          shadowOpacity: 0.15,
          shadowRadius: 0.32,
          elevation: 3
        },
        courseCard: {
          paddingLeft: 5,
        },
        verticalSeperator: {
          height: "100%",
          marginLeft: theme.paddings.small,
          width: 1,
          backgroundColor: theme.colors.listSeperator2,
        },
        verticalSeperatorSmall: {
          height: "15%",
          width: 1,
          backgroundColor: theme.colors.listSeperator2,

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
          paddingLeft: theme.paddings.small,
          width:"100%",
          backgroundColor:theme.colors.background,
          paddingTop: theme.paddings.xsmall,
          paddingBottom: theme.paddings.xsmall
        },
        courseContainerBigFont: {
            width: "75%",
        },
        type: {
          fontSize: theme.fontSizes.l,
          color: theme.colors.lecturerNameText
        },
        title: {
          fontSize: theme.fontSizes.xl,
          paddingTop: theme.paddings.xsmall,
        },
        titleBigFont: {
            fontSize: theme.fontSizes.xl,
            paddingTop: theme.paddings.xsmall,
        },
        location: {
          fontSize: theme.fontSizes.subtitle,
          paddingTop: theme.paddings.xsmall,
          color: theme.colors.secondaryText,
        },
        locationLink: {
          textDecorationLine: 'underline',
          color: 'blue'
        },
        addLeftRightPadding: {
          paddingLeft: theme.paddings.xsmall,
          paddingRight: theme.paddings.xsmall,
        },
        professorText: {
          fontSize: theme.fontSizes.m,
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
        starPosition:{
          position: 'absolute',
          top: 10,
          right: 10,
        }
    }
};
