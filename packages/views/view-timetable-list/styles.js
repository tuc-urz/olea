import {Dimensions} from "react-native";

const width = Dimensions.get('window').width;

export default function(theme) {
    return {
        horizontalSeperator: {
          height: 1,
          width: "100%",
          backgroundColor: theme.colors.listSeperator
        },
        otherContainer: {
          width: width,
          height: "10%",
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
              width: 0,
              height: 1,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 3,
          justifyContent: 'center'
        },
        otherTitle: {
          fontSize: theme.fontSizes.xxl,
          ...theme.fonts.medium,
          textAlign: "center",
          padding: theme.paddings.small,
          color: theme.colors.primaryText,
        },
        container: {
          flex: 1,
          backgroundColor: theme.colors.contentBackground,
        },
        modalContainer: {
            flex: 1,
        },
        renderList: {
          marginBottom: theme.paddings.small
        },
        emptyListContainer: {
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 400,
            padding: theme.paddings.default,
            marginTop: theme.paddings.default
        },
        emptyText: {
          textAlign: "center",
          fontSize: theme.fontSizes.title
        }
    }
};
