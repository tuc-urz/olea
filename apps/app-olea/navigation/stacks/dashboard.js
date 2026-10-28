import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import { DashboardHtwk as DashboardView } from '@olea-bps/base';
import { NewsDetail as NewsDetailComponent } from '@olea-bps/base';
import { CourseDetail as CourseDetailComponent } from '@olea-bps/base';
import { Modal as ModalComponent } from '@olea-bps/base';

import { TabBarIcon } from '@olea-bps/base';

/**
 * Tab Options
 */
const options = {
    title: 'Dashboard',
    tabBarAccessibilityLabel: 'accessibility:navigation.dashboard' ,
    tabBarIcon: ({ color }) => (
        <TabBarIcon icon="dashboard" color={color} />
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
            <Stack.Screen name="Dashboard"      component={DashboardView}       options={{headerShown: false}}/>
            <Stack.Screen name="TopNewsDetail"  component={NewsDetailComponent} options={{headerShown: false}}/>
            <Stack.Screen name="CourseInfo"     component={CourseDetailComponent} options={{headerShown: false}}/>
            <Stack.Screen name="Modal"          component={ModalComponent}      options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
