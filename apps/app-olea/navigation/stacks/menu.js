import React                    from 'react';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import MainMenuView                 from "@openasist/view-main-menu";
import OpalView                     from "@openasist/view-opal";
import GeneralSettingsView          from "@openasist/view-settings-general";
import CanteensSettingsView         from "@openasist/view-settings-canteens";
import AccessibilitySettingsView    from "@openasist/view-settings-accessibility";
import SearchView                   from "@openasist/view-search";
import WebviewsView                 from "@openasist/view-webviews";
import ModalComponent               from "@openasist/component-modal";
import CourseDetailComponent        from "@openasist/component-course-detail";
import JobPortalView                from "@openasist/view-jobs";
import JobFilterComponent           from "@openasist/component-jobs-filter";
import CoronaDetail                 from "@openasist/view-corona-detail";
import TabBarIcon                   from "../tabBarIcon";
import AppInfoSettingsView          from "@openasist/view-settings-app-info";
import TimetableCalendarView        from "@openasist/view-timetable-calendar";

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

            <Stack.Screen name="CoronaDetail"     component={CoronaDetail}                options={{headerShown: false}}/>
            <Stack.Screen name="TimetableCalendarView"  component={TimetableCalendarView}       options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
