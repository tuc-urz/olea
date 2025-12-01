import React                    from 'react';
import { View }                 from "react-native";

import IconsOpenasist           from "@olea-bps/icons-openasist";

/**
 * Create a tab bar icon
 */
export default (icon, props, size = 28) => {
    const { color } = props;
    return (
        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            <IconsOpenasist
                icon={icon}
                color={color}
                size={size}/>
        </View>
    );
}
