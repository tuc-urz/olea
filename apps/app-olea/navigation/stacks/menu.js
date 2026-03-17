import React                    from 'react';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import { MainMenu as MainMenuView } from '@olea/base';
import { Opal as OpalView } from '@olea/base';
import { SettingsGeneral as GeneralSettingsView } from '@olea/base';
import { SettingsCanteens as CanteensSettingsView } from '@olea/base';
import { SettingsAccessibility as AccessibilitySettingsView } from '@olea/base';
import { Search as SearchView } from '@olea/base';
import { Webviews as WebviewsView } from '@olea/base';
import { Modal as ModalComponent } from '@olea/base';
import { CourseDetail as CourseDetailComponent } from '@olea/base';
import { Jobs as JobPortalView } from '@olea/base';
import { ComponentJobsFilter as JobFilterComponent } from '@olea/base';
import TabBarIcon from '../tabBarIcon';
import { SettingsAppInfo as AppInfoSettingsView } from '@olea/base';
import { TimetableCalendar as TimetableCalendarView } from '@olea/base';

/**
 * Tab Options
 */
const options = {
    title: 'Menu',
    tabBarAccessibilityLabel: 'accessibility:navigation.menu',
    tabBarIcon: (props) => TabBarIcon("menu", props, 26),
    header: () => null
}

/**
 * Navigation stack for Feeds
 */
const stack = (props) => {
    const Stack = createStackNavigator()
    return  (
        <Stack.Navigator>
            <Stack.Screen name="Menu"                   component={MainMenuView}                options={{headerShown: false}}/>
            <Stack.Screen name="Opal"                   component={OpalView}                    options={{headerShown: false}}/>
            <Stack.Screen name="SettingsGeneral"        component={GeneralSettingsView}         options={{headerShown: false}}/>
            <Stack.Screen name="SettingsCanteens"       component={CanteensSettingsView}        options={{headerShown: false}}/>
            <Stack.Screen name="SettingsAccessibility"  component={AccessibilitySettingsView}   options={{headerShown: false}}/>
            <Stack.Screen name="SettingsAppInfo"        component={AppInfoSettingsView}         options={{headerShown: false}}/>
            <Stack.Screen name="Search"                 component={SearchView}                  options={{headerShown: false}}/>
            <Stack.Screen name="Web"                    component={WebviewsView}                options={{headerShown: false}}/>
            <Stack.Screen name="Modal"
                  component={ModalComponent}
                  options={{headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}}
            />
            <Stack.Screen name="CourseInfo"             component={CourseDetailComponent}       options={{headerShown: false}}/>
            <Stack.Screen name="Job"                    component={JobPortalView}               options={{headerShown: false}}/>
            <Stack.Screen name="JobFilter"              component={JobFilterComponent}          options={{headerShown: false}}/>

            <Stack.Screen name="TimetableCalendarView"  component={TimetableCalendarView}       options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
