import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import { NewsDetail as NewsDetailComponent } from '@olea-bps/components';
import { NewsTabbar as NewsTabBarView } from '@olea-bps/views';
import { NewsList } from '@olea-bps/components';
import { Modal as ModalComponent } from '@olea-bps/components';

import TabBarIcon               from "../tabBarIcon";

/**
 * Tab Options
 */
const options = {
    title: 'Feeds',
    tabBarAccessibilityLabel: 'accessibility:navigation.feeds',
    tabBarIcon:  (props) => TabBarIcon("news", props),
    header: () => null
}

/**
 * Navigation stack for Feeds
 */
const stack = (props) => {
    const Stack = createStackNavigator()
    return  (
        <Stack.Navigator>
            <Stack.Screen name="News"           component={NewsTabBarView}        options={{headerShown: false}}/>
            <Stack.Screen name="NewsComponent"  component={NewsList}   options={{headerShown: false}}/>
            <Stack.Screen name="NewsDetail"     component={NewsDetailComponent} options={{headerShown: false}}/>
            <Stack.Screen name="Modal"          component={ModalComponent}      options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
