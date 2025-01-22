import {StatusBar} from "react-native";
import React from "react";
import {themeColors} from "../constants/layout/Colors"
export default ({ ...props}) => (
    <StatusBar translucent backgroundColor={themeColors.statusBar} {...props} barStyle={'light-content'}/>
);
