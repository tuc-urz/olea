export default function (theme) {
    return {
        formContainer: {
            backgroundColor: theme.colors.background,
            borderRadius: 10,
            padding: 20,
            elevation: 5,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            left: '5%',
            right: '5%',
            position: 'absolute',
            bottom: 100,
        },
        inputContainer: {
            flex: 1,
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 15,
        },
        infoIcon: {
            width: '10%',
            marginLeft: '3%',
        },
        codeInput: {
            height: 50,
            width: '87%',
            borderColor: theme.colors.accent,
            backgroundColor: theme.colors.contentBackground,
            color: theme.colors.text,
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
        },
        checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        checkboxLabel: {
            marginLeft: 10,
            fontSize: 16,
        },
        buttonContainer: {
            marginTop: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
        },
        dismissButton: {
            color: theme.colors.textAccent,
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: 16,
        },
        deleteButtonContainer: {
            flexDirection: 'row',
        },
        deleteButton: {
            color: theme.colors.error,
            fontWeight: 'bold',
            textAlign: 'left',
            fontSize: 16,
            marginRight: 3,
        },
        floatingButton: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 40,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 5,
        },
        importButton: {
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            padding: theme.paddings.small,
            flex: 1,
            backgroundColor: theme.colors.primary,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10

        },
        importButtonLabel: {
            color: theme.colors.buttonText,
            ...theme.fonts.medium,
            fontSize: theme.fontSizes.xl,
            lineHeight: theme.lineHeights.l,
            marginLeft: theme.paddings.small
        },
        errorText: {
            color: theme.colors.error,
            marginLeft: 5,
            marginBottom: 10,
        },
        infoText: {
            color: theme.colors.text,
            marginLeft: 5,
        },
        link: {
            textDecorationLine: 'underline',
            color: theme.colors.textAccent,
        }
    };
};
