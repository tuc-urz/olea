export default function(theme) {
    return {
        selectOption: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        listItemTitle: {
            fontSize: theme.fontSizes.l,
            color: theme.colors.text,
        },
        listItemDescription: {
            fontSize: theme.fontSizes.m,
            color: theme.colors.textLighter
        },
        buttonLabel: {
            fontSize: theme.fontSizes.m,
            color: theme.colors.text,
        },
        dialogTitle: {
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.xxl,
            color: theme.colors.text,
        },
        dialogContent: {
            fontSize: theme.fontSizes.m,
          color: theme.colors.text,
        }
    }
}
