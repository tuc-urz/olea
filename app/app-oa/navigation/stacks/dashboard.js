import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import DashboardView            from "@openasist/view-dashboard-htwk";
import NewsDetailComponent      from "@openasist/component-news-detail";
import CourseDetailComponent    from "@openasist/component-course-detail";
import ModalComponent           from "@openasist/component-modal";

import TabBarIcon               from "../tabBarIcon";

/**
 * Tab Options
 */
const options = {
    title: 'Dashboard',
    tabBarAccessibilityLabel: 'accessibility:navigation.dashboard' ,
    tabBarIcon: (props) => TabBarIcon("dashboard", props ),
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
