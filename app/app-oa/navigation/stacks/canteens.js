import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import CanteensTabView          from '@olea/view-canteens';


import ModalComponent           from "@olea/component-modal";

import TabBarIcon               from "../tabBarIcon";

/**
 * Tab Options
 */
const options = {
    title: 'Canteens',
    tabBarAccessibilityLabel: 'accessibility:navigation.canteens',
    tabBarIcon:  (props) => TabBarIcon("mensa", props),
    header: () => null
}

/**
 * Navigation stack for Dashboard
 */
const stack = (props) => {
    const Stack = createStackNavigator()
    return  (
        <Stack.Navigator>
            <Stack.Screen name="Canteens"       component={CanteensTabView}         options={{headerShown: false}}/>
            <Stack.Screen name="Modal"          component={ModalComponent}          options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
