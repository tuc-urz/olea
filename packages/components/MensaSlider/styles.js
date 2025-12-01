export default function(theme) {
    return {
        container: {
            paddingHorizontal: 0,
            paddingTop: theme.paddings.small,
            backgroundColor: theme.colors.mensaSliderBackground
        },
        innerContainer: {
            flex: 1,
            flexDirection: 'row',
            position: 'relative'
        },
        mensaNameText: {
              ...theme.fonts.regular,
              fontSize: theme.fontSizes.s,
              lineHeight: theme.lineHeights.xs,
              paddingBottom: theme.paddings.small,
              marginLeft: theme.paddings.default,
              color: theme.colors.mensaSliderTextColor,
              textTransform: 'uppercase',

        },
        headline: {
            paddingHorizontal: theme.paddings.default,
            paddingBottom: theme.paddings.default,
            ...theme.fonts.regular,
            fontSize: theme.fontSizes.m,
            color: theme.colors.mensaSliderTextColor,
            textTransform: 'uppercase',

        },
        slider: {
            paddingBottom: theme.paddings.small,
            zIndex: 1
        },
        shadowLeft: {
            width: theme.paddings.default,
            position: 'absolute',
            top:0,
            left: 0,
            bottom: 0,
            zIndex: 2
        },
        shadowRight: {
            width: theme.paddings.default,
            position: 'absolute',
            top:0,
            right: 0,
            bottom: 0,
            zIndex: 2
        }
    }
};
