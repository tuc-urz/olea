export default function(theme) {
    return {
        selectOption: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        listItemTitle: {
            fontSize: theme.fontSizes.l
        },
        listItemDescription: {
            fontSize: theme.fontSizes.m,
            color: theme.colors.textLighter
        },
        buttonLabel: {
            fontSize: theme.fontSizes.m
        },
        dialogTitle: {
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.xxl
        },
        dialogContent: {
            fontSize: theme.fontSizes.m
        },
        listItems: {
            flex: 1,
            
        },
        container: {
            flex: 1,
            backgroundColor: theme.colors.contentBackground,
          },
        paragraph: {
            paddingTop: theme.paddings.default,
            paddingLeft: theme.paddings.default,
            paddingRight: theme.paddings.default
          },
          paragraphText: {
              fontSize: theme.fontSizes.l,
              lineHeight: theme.lineHeights.l
          },
          linkText: {
              fontSize: theme.fontSizes.l,
              lineHeight: theme.lineHeights.l,
              textDecorationLine: 'underline',
              color: 'blue'
          },
          importButtonLabel: {
            color: theme.colors.messages.noticeText,
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            marginLeft: theme.paddings.small
          },
          continueWithoutCodeButtonLabel:{
            color: theme.colors.primary,
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            marginLeft: theme.paddings.small
          },
          importTextInput:{
            paddingLeft: theme.paddings.default,
            paddingRight: theme.paddings.default
          },
          orText:{
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.xxl,
            textAlign: "center"
          },
          importButton:{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10, 
            marginLeft: 20,
            marginRight: 20,
            padding: theme.paddings.small,
            flex: 1,
            backgroundColor: theme.colors.primary,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
          },
          continueWithoutCodeButton:{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10, 
            marginLeft: 20,
            marginRight: 20,
            padding: theme.paddings.small,
            flex: 1,
            borderColor: theme.colors.primary,
            borderWidth: 1,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
          }
        
    }
}