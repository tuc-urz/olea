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
            fontSize: theme.fontSizes.m
        },
        licenseContent: {
            paddingHorizontal: 16,
            paddingBottom: 16
        },
        licenseText: {
            fontSize: theme.fontSizes.m,
            color: theme.colors.text,
            marginBottom: 16
        },
        infoBanner: {
            width: '100%'
        }
    }
}
