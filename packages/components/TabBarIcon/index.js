import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import IconsOpenasist from '../../libraries/icons-openasist';

/**
 * Theme-aware icon for the bottom tab navigation.
 *
 * Size precedence:
 * 1. Explicit size
 * 2. Theme tab bar icon size
 * 3. Default size 24
 */
export default function TabBarIcon({ icon, color, size }) {
    const theme = useTheme();
    const iconSize = size ?? theme.tabBar?.iconSize ?? 24;

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