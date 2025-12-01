export default function(theme) {
    return {
        selectOption: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        labelStyle: {
            fontSize: theme.fontSizes.l,
            color: theme.colors.text
        },
        labelStyleBold: {
            fontSize: theme.fontSizes.xl,
            fontWeight: 'bold',
            color: theme.colors.text
        },
        horizontalSeparator: {
            height: 1,
            width: "100%",
            backgroundColor: theme.colors.listSeperator,
            marginTop: theme.paddings.small,
            marginBottom: theme.paddings.small
        },
        innerContainer: {
            paddingLeft: theme.paddings.small,
            paddingRight: theme.paddings.small,
            margin: theme.paddings.xsmall
        },
        setting: {
            flexDirection:'row',
            alignItems:'center',
            marginVertical: theme.paddings.xsmall,
            paddingVertical: theme.paddings.small,
            paddingHorizontal: theme.paddings.small,
            justifyContent:'space-between'
        }
    }
};
