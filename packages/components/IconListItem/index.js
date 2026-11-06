import { useCallback } from 'react'
import { List } from 'react-native-paper'

import Icon from '../../libraries/icons-openasist'

/**
 * Ein Listenelement, welches ein Icon auf der rechten Seite anzeigt.
 * Es können alle Properties der {@link List.Item}-Komponente verwendet werden, außer die `right`-Property.
 * Die `right`-Property wird für das Einbinden des Icons benutzt.
 *
 * @param {object} props
 * @param {string} props.icon Iconname des anzuzeigenen Icons. Für mögliche Werte siehe {@link Icon}
 */
export default function IconListItem ({ icon, iconColor, ...listItemProps }) {
  const listItemIcon = useCallback(
    (listIconProps) => (
      <List.Icon
        {...listIconProps}
        color={iconColor ?? listIconProps.color}
        icon={(props) => <Icon {...props} icon={icon} />}
      />
    ),
    [icon, iconColor]
  )

  return <List.Item {...listItemProps} right={listItemIcon} />
}
