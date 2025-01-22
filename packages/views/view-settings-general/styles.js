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
        }
    }
}
