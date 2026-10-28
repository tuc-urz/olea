import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import { Canteens as CanteensTabView } from '@olea-bps/base';


import { Modal as ModalComponent } from '@olea-bps/base';

import { TabBarIcon } from '@olea-bps/base';

/**
 * Tab Options
 */
const options = {
    title: 'Canteens',
    tabBarAccessibilityLabel: 'accessibility:navigation.canteens',
    tabBarIcon: ({ color }) => (
        <TabBarIcon icon="mensa" color={color} />
    ),
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
