import {Dimensions} from "react-native";

export default function(theme) {
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    return {
        overflow: {
            backgroundColor: theme.colors.overlayColor,
        },
        image: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: null,
            resizeMode: 'cover',
        },
        container: {
            flex: 1,
            overflow: 'hidden'
        },
        containerInner: {
            flex: 1
        },
        containerContent: {
            backgroundColor: theme.colors.contentBackground,
            flex: 1,
            paddingHorizontal: 5,
            paddingVertical: 20,
            minHeight: height * 1.25 // To make sure the animation won't break / stop
        },
        activity: {
            marginTop: 20
        },
        badges: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 10
        },
        badge: {
            marginRight: 5,
            marginBottom: 5
        },
        title: {
            paddingLeft: 10,
            fontSize: theme.fontSizes.title,
            lineHeight: theme.lineHeights.titleBig
        },
        bar: {
            alignItems: 'flex-start',
            justifyContent: 'center',
            position: 'absolute',
            top: 5,
            left: 0,
            right: 0,
        },
        barText: {
            color: theme.colors.primaryText,
            ...theme.fonts.bold,
        },
        newsContent : {
            marginVertical: theme.paddings.default,
            marginHorizontal: theme.paddings.small,
            width: width - (2 * theme.paddings.small)
        },
        newsContentText: {
            fontSize: theme.fontSizes.m
        },
        imageDesc: {
            backgroundColor: theme.colors.overlayColor,
            color: theme.colors.primaryText,
            paddingVertical: 2,
            paddingHorizontal: theme.paddings.small,
            fontSize: theme.fontSizes.xs
        }
    };
}
