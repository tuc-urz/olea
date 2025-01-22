import {Dimensions} from 'react-native';
const width = Dimensions.get('window').width;

export default function(theme) {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        contentContainer: {
            paddingTop: 0
        },
        titleStyle: {
          ...theme.fonts.medium,
          fontSize: theme.fontSizes.xxl,
          alignSelf: 'center'
        },
        universityIcon: {
            width: width * .40,
            height: (width * .40) * .5625, // 56.25% = 16:9 Ratio
            margin: theme.paddings.default
        }
    }
};
