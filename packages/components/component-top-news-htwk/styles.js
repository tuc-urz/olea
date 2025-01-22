import {Platform, Dimensions} from "react-native";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const headerImageHeight = height / 2;

export default function(theme) {
    return {
        appHeader: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'baseline',
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
            height: headerImageHeight,
        },
        universityIconWrapper: {
            flex: 1,
            zIndex: 9,
            backgroundColor: theme.colors.topNewsIconBackground,
        },
        universityIcon: {
            width: width * .6,
            height: (width) * .1,
            margin: (width * .15) / 4,
            marginLeft: theme.paddings.default,

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
            height: width/16*9,
            width: width
        },
        backgroundImageWrapper: {
            position:'relative',
            overflow: 'hidden',
            backgroundColor: 'blue'
        },
        imageOverlay: {
            height: headerImageHeight,
            width: width,
            flex: 1
        },
        newsItem: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: theme.paddings.default,
            paddingTop: theme.paddings.xsmall,
            paddingBottom: theme.paddings.xsmall,
        },
        newsItemCategory: {
            marginBottom: 5,
            fontSize: theme.fontSizes.s
        },
        newsItemTitle: {
            ...theme.fonts.thin,
            fontSize: theme.fontSizes.title,
            lineHeight: theme.lineHeights.titleBig,
            marginBottom: theme.paddings.small,
        },
        newsItemText: {
            ...theme.fonts.thin,
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.l
        },
        newsItemReadMore: {
            textDecorationLine: 'underline'
        },
        newsItemActionbar: {
            borderBottomColor: theme.colors.accent,
            borderBottomWidth: 1,
            //borderStyle: 'dotted', // TODO Not available on iOS at the moment (also dashed)
            borderStyle: 'solid',
            paddingBottom: theme.paddings.none,
            marginTop: theme.paddings.none,
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
            flexDirection: 'row',
        },
        newsItemAuthor: {
            fontSize: theme.fontSizes.s,
            ...theme.fonts.bold,
            color: theme.colors.subtitle,
            flex: 1,
            alignSelf: 'flex-start',
            flexDirection: 'row',
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
        },
        tape: {
            position: 'absolute',
            top: '16.7%',       // 16.7 % = 0.5/3 of height as per CI
            bottom: '16.7%',    // 16.7 % = 0.5/3 of height as per CI
            zIndex: 10,
            flex: 1,
            width: width * 0.1143, // 11.43% width as per CI
            resizeMode: 'cover',
            backgroundColor: theme.colors.tapeColor
        },
        tapeLeft: {
            left: theme.paddings.default - ((width * 0.1143) / 3) // 2/3 overlay
        },
        tapeRight: {
            right: theme.paddings.default  - ((width * 0.1143) / 3) // 2/3 overlay
        }
    }
};
