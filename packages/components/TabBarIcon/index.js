import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import IconsOpenasist from '../../libraries/icons-openasist';

/**
 * Renders a theme-aware icon for the bottom tab navigation.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.icon - Name of the icon to render.
 * @param {string} props.color - Color provided by the tab navigator.
 * @param {number} [props.size] - Optional icon size overriding the theme setting.
 * @returns {React.JSX.Element} The rendered tab bar icon.
 */
export default function TabBarIcon({ icon, color, size }) {
    const theme = useTheme();
    const iconSize = size ?? theme?.tabBar?.iconSize;

    return (
        <View
            style={{
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
            }}
        >
            <IconsOpenasist
                icon={icon}
                color={color}
                size={iconSize}
            />
        </View>
    );
}
