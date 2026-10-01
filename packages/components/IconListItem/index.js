import {
    useCallback,
    useMemo,
} from 'react';
import {
    StyleSheet,
} from 'react-native';

import {
    List,
    useTheme,
} from 'react-native-paper';

import { default as Icon } from '../../libraries/icons-openasist';

import componentStyles from './styles';

/**
 * Ein Listenelement, welches ein Icon auf der rechten Seite anzeigt.
 * Es können alle Properties der {@link List.Item}-Komponente verwendet werden, außer die `right`-Property.
 * Die `right`-Property wird für das Einbinden des Icons benutzt.
 * 
 * @param {object} props
 * @param {string} props.icon Iconname des anzuzeigenen Icons. Für mögliche Werte siehe {@link Icon}
 */
export default function IconListItem({ icon, ...listItemProps }) {
    const theme = useTheme();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    const themeIconColor = theme?.colors?.icon;

    const listItemIcon = useCallback(
        listIconProps => {

            const iconColor = themeIconColor ?? iconProps.color;

            return (
                <List.Icon
                    {...listIconProps}
                    color={iconColor}
                    icon={
                        props =>
                            <Icon
                                {...props}
                                icon={icon}
                            />
                    }
                />
            )
        },
        [icon, themeIconColor]
    );

    return (
        <List.Item
            {...listItemProps}
            right={listItemIcon}
        />
    );
}