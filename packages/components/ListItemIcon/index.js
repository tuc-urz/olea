import { useMemo } from 'react';
import {
    View,
    ColorValue,
    StyleProp,
    ViewStyle,
    StyleSheet,
} from 'react-native';

import {
    List,
    useTheme,
} from 'react-native-paper';

import { default as Icon } from '../../libraries/icons-openasist';

import componentStyles from './styles';

/**
 * Eine Komponente, die ein Icon in einem {@link List.Item} anzeigt.
 * Als Iconname für den icon-Parameter, können die Iconnamen der {@link Icon}-Komponente verwenden werden.
 * 
 * @param {object} props
 * @param {string} props.icon Iconname des anzuzeigenen Icons. Für mögliche Werte siehe {@link Icon}
 * @param {ColorValue} props.color Farbe des Icon
 * @param {Number} props.size Größe des Icons
 * @param {StyleProp<ViewStyle>} props.style Styleangaben die am Container({@link View}) fürs Icon weitergeben werden
 */
export default function ListItemIcon({ icon, color, size, style }) {
    const theme = useTheme();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    return (
        <View
            style={[styles.iconContainer, style]}
        >
            <Icon
                icon={icon}
                color={color}
                size={size}
            />
        </View>
    );
}