import React                    from 'react';
import { View }                 from "react-native";

import IconsOLEA           from "@olea/icons-olea";

/**
 * Create a tab bar icon
 */
export default (icon, props, size = 28) => {
    const { color } = props;
    return (
        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            <IconsOLEA
                icon={icon}
                color={color}
                size={size}/>
        </View>
    );
}
