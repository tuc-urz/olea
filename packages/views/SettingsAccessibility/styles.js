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
        }
    }
};
