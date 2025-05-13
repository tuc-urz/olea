import React                    from 'react';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import MainMenuView                 from "@olea/view-main-menu";
import OpalView                     from "@olea/view-opal";
import GeneralSettingsView          from "@olea/view-settings-general";
import CanteensSettingsView         from "@olea/view-settings-canteens";
import AccessibilitySettingsView    from "@olea/view-settings-accessibility";
import SearchView                   from "@olea/view-search";
import WebviewsView                 from "@olea/view-webviews";
import ModalComponent               from "@olea/component-modal";
import CourseDetailComponent        from "@olea/component-course-detail";
import JobPortalView                from "@olea/view-jobs";
import JobFilterComponent           from "@olea/component-jobs-filter";
import CoronaDetail                 from "@olea/view-corona-detail";
import TabBarIcon                   from "../tabBarIcon";
import AppInfoSettingsView          from "@olea/view-settings-app-info";
import TimetableCalendarView        from "@olea/view-timetable-calendar";

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
