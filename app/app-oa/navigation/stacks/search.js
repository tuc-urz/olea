import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import SearchView               from "@openasist/view-search";
import ModalComponent           from "@openasist/component-modal";

import TabBarIcon               from "../tabBarIcon";

/**
 * Tab Options
 */
const options = {
    title: 'Search',
    tabBarAccessibilityLabel: 'accessibility:navigation.search',
    tabBarIcon:  (props) => TabBarIcon("search", props),
    header: () => null
}

/**
 * Navigation stack for Dashboard
 */
const stack = (props) => {
    const Stack = createStackNavigator()
    return  (
        <Stack.Navigator>
            <Stack.Screen name="Search"      component={SearchView}       options={{headerShown: false}}/>
            <Stack.Screen name="Modal"       component={ModalComponent}   options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
