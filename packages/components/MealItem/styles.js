// Helper function to add alpha to a color
const addAlpha = (hexColor, alpha) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function(theme) {
    return {
        mensaItem: {
            width: 190,
            height: '75%',
            paddingHorizontal: theme.paddings.default,
            borderRightWidth: 1,
            borderRightColor: addAlpha(theme.colors.mensaSliderTextColor, 0.5)
        },
        mensaItemText: {
            fontSize: theme.fontSizes.itemText,
            lineHeight: theme.lineHeights.s,
            color: theme.colors.mensaSliderTextColor
        },
        modalContainer: {
            flex: 1
        },
        modalContainerInner: {
            flex: 1,
            paddingTop: 20,
            paddingHorizontal: 20
        },
        modalMenuTitle: {
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.xl,
            textAlign: 'left'
        },
        modalMenuDescription: {
            fontSize: theme.fontSizes.l,
            lineHeight: theme.lineHeights.l,
        },
        modalMenuImage: {
            height: 240,
            width: 'auto',
            marginBottom: 40
        },
        modalMenuTable: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 5
        },
        modalMenuTableCol: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 20
        },
        modalMenuCol1: {
            backgroundColor: theme.colors.primary,
        },
        modalMenuCol1Text: {
            color: theme.colors.primaryText,
        },
        modalMenuCol2: {
            backgroundColor: theme.colors.secondary,
        },
        modalMenuCol2Text: {
            color: theme.colors.secondaryText,
        },
        modalMenuCol3: {
            backgroundColor: theme.colors.tertiary,
        },
        modalMenuCol3Text: {
            color: theme.colors.tertiaryText,
        },
        modalMenuPriceType: {
            marginBottom: 10,
            fontWeight: '700'
        }
}
};
