import { useCallback } from 'react';
import { ColorValue } from 'react-native';

import {
    Appbar,
    useTheme,
} from 'react-native-paper';

import IconsOpenasist from '../../libraries/icons-openasist';

/**
 * Eine Action, welche die Icons über die {@link IconsOpenasist}-Komponente einbindet.
 * Es werden alle Properties der {@link Appbar.Action}-Komponente unterstüzt.
 * Die `icon`-Property wird auf eine andere Art und Weise verwendet.
 * Wird keine Farbe übergeben, wird die primäre Textfarbe (`primaryText`) aus den Theme verwendet.
 *
 * @param {object} props - Es werden die Properties der {@link Appbar.Action}-Komponente unsterstützt
 * @param {string} props.icon - Name eines Icons, welches über die {@link IconsOpenasist} angezeigt werden kann.
 * @param {?ColorValue} props.color - Farbe des Icons. Wenn keine Farbe übergeben wird, wird die primäre Textfarbe (`primaryText`) aus den Theme verwendet.
 * @returns
 */
export default function AppbarAction({ icon, color, ...rest }) {
    const theme = useTheme();
    const iconColor = color ?? theme?.colors?.primaryText;

    const iconCallback = useCallback(
        props =>
            <IconsOpenasist
                {...props}
                icon={icon}
                color={iconColor}
            />,
        [icon, iconColor]
    );

    return (
        <Appbar.Action
            {...rest}
            icon={iconCallback}
        />
    );
}