import { addAlpha } from '../../libraries/core/helper/color';

/**
 * Erzeugt die Styles für die Hochschulausweis-View anhand des übergebenen Themes.
 *
 * @param {Object} theme Theme der App
 * @returns {Object} Style-Definitionen für StyleSheet.create
 */
export default function (theme) {
    const colors = theme?.colors ?? {};
    const paddings = theme?.paddings ?? {};
    const fontSizes = theme?.fontSizes ?? {};

    return {
        container: {
            flex: 1,
        },
        scrollContent: {
            padding: paddings.default,
        },
        card: {
            // Inhalt (insbesondere der Hologramm-Streifen) darf nicht über den Ausweis hinausragen
            overflow: 'hidden',
            borderRadius: 16,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.listSeperator,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: paddings.default,
            backgroundColor: colors.primary,
        },
        cardHeaderText: {
            flex: 1,
            marginLeft: paddings.small,
        },
        institutionName: {
            fontSize: fontSizes.xl,
            fontWeight: 'bold',
            color: colors.primaryText,
        },
        cardTitle: {
            fontSize: fontSizes.m,
            color: colors.primaryText,
        },
        cardBody: {
            flexDirection: 'row',
            padding: paddings.default,
        },
        avatar: {
            width: 80,
            height: 100,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.contentBackground,
            borderWidth: 1,
            borderColor: colors.listSeperator,
        },
        avatarText: {
            fontSize: fontSizes.xxl,
            fontWeight: 'bold',
            color: colors.textLighter,
        },
        fields: {
            flex: 1,
            marginLeft: paddings.default,
        },
        field: {
            marginBottom: paddings.small,
        },
        fieldLabel: {
            fontSize: fontSizes.s,
            color: colors.textLighter,
        },
        fieldValue: {
            fontSize: fontSizes.l,
            fontWeight: 'bold',
            color: colors.text,
        },
        shine: {
            position: 'absolute',
            top: '-50%',
            bottom: '-50%',
            left: 0,
            backgroundColor: addAlpha('#ffffff', 0.35),
        },
        notLoggedInContainer: {
            padding: paddings.default,
            alignItems: 'center',
        },
        notLoggedInText: {
            fontSize: fontSizes.l,
            textAlign: 'center',
            marginBottom: paddings.small,
        },
    };
}
