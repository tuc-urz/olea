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

    // Farbe für den Status "gültig" bzw. "abgelaufen"
    const validColor = colors.messages?.successBackground ?? colors.textAccent;
    const invalidColor = colors.error;

    // Gemeinsame Basis aller weißen Kacheln unterhalb des Ausweises
    const tile = {
        borderRadius: 14,
        backgroundColor: colors.surface,
    };

    // Kleine Überschrift in Großbuchstaben (Abschnitts- und Kachelbezeichnungen)
    const overline = {
        fontSize: fontSizes.xs,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: colors.textLighter,
    };

    return {
        container: {
            flex: 1,
        },
        scrollView: {
            backgroundColor: colors.contentBackground,
        },
        scrollContent: {
            paddingHorizontal: 18,
            paddingVertical: 22,
            gap: 14,
        },
        sectionTitle: {
            ...overline,
            fontSize: fontSizes.s,
        },

        // Ausweis
        card: {
            // Inhalt (insbesondere der Hologramm-Streifen) darf nicht über den Ausweis hinausragen
            overflow: 'hidden',
            borderRadius: 18,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.listSeperator,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 4,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            paddingVertical: 11,
            backgroundColor: colors.primary,
        },
        cardHeaderInstitution: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        institutionName: {
            flexShrink: 1,
            fontSize: fontSizes.s,
            fontWeight: 'bold',
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: colors.primaryText,
        },
        semesterBadge: {
            marginLeft: paddings.small,
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 3,
            backgroundColor: addAlpha(colors.primaryText, 0.12),
        },
        semesterBadgeText: {
            fontSize: fontSizes.s,
            fontWeight: '600',
            color: colors.primaryText,
        },
        cardBody: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 18,
            paddingTop: 16,
            paddingBottom: 14,
        },
        photo: {
            width: 62,
            height: 78,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.contentBackground,
            borderWidth: 1,
            borderColor: colors.listSeperator,
        },
        photoIcon: {
            color: colors.textLighter,
        },
        cardInfo: {
            flex: 1,
            gap: 3,
        },
        name: {
            fontSize: fontSizes.xxl,
            fontWeight: 'bold',
            color: colors.text,
        },
        memberTypes: {
            marginBottom: 3,
            fontSize: fontSizes.s,
            fontWeight: '600',
            color: colors.textAccent,
        },
        cardInfoText: {
            fontSize: fontSizes.s,
            color: colors.textLighter,
        },
        cardInfoValue: {
            fontWeight: '600',
            letterSpacing: 0.4,
            color: colors.text,
        },
        cardFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 18,
            paddingVertical: 9,
            borderTopWidth: 1,
            borderTopColor: colors.contentBackground,
            backgroundColor: addAlpha(colors.contentBackground, 0.6),
        },
        cardFooterLabel: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        cardFooterLabelText: {
            fontSize: fontSizes.xs,
            fontWeight: '500',
            color: colors.textLighter,
        },
        cardFooterValue: {
            fontSize: fontSizes.s,
            fontWeight: 'bold',
            letterSpacing: 0.4,
            color: colors.text,
        },
        shine: {
            position: 'absolute',
            top: '-50%',
            bottom: '-50%',
            left: 0,
            backgroundColor: addAlpha('#ffffff', 0.35),
        },

        // Gültigkeitsstatus
        validity: {
            ...tile,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        validityIconValid: {
            color: validColor,
        },
        validityIconInvalid: {
            color: invalidColor,
        },
        validityContent: {
            flex: 1,
        },
        validityTitleValid: {
            fontSize: fontSizes.itemText,
            fontWeight: '600',
            color: validColor,
        },
        validityTitleInvalid: {
            fontSize: fontSizes.itemText,
            fontWeight: '600',
            color: invalidColor,
        },
        tileSubtitle: {
            marginTop: 1,
            fontSize: fontSizes.s,
            color: colors.textLighter,
        },

        // Deutschlandticket
        ticket: {
            ...tile,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingLeft: 12,
            paddingRight: 14,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.listSeperator,
        },
        ticketIcon: {
            width: 38,
            height: 38,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: addAlpha(colors.error, 0.1),
        },
        ticketIconColor: {
            color: colors.error,
        },
        ticketContent: {
            flex: 1,
        },
        ticketTitle: {
            fontSize: fontSizes.itemText,
            fontWeight: '600',
            color: colors.text,
        },
        ticketAction: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        ticketActionText: {
            fontSize: fontSizes.s,
            fontWeight: '600',
            color: colors.textAccent,
        },

        // Kacheln mit weiteren Angaben
        infoGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 10,
        },
        infoTile: {
            ...tile,
            // Zwei Kacheln pro Zeile mit 10px Abstand
            width: '48.5%',
            paddingHorizontal: 14,
            paddingTop: 14,
            paddingBottom: 12,
        },
        infoTileLabel: {
            ...overline,
            marginBottom: 5,
        },
        infoTileValue: {
            fontSize: fontSizes.itemText,
            fontWeight: '600',
            color: colors.text,
        },
        infoTileValueLarge: {
            fontSize: fontSizes.l,
            fontWeight: 'bold',
            letterSpacing: 0.6,
            color: colors.text,
        },

        // Nicht angemeldet
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
