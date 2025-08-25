import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import TimetableViewCalendar    from '@openasist/view-timetable-calendar';
import TimetableViewList        from '@openasist/view-timetable-list';
import TimetableCourseView      from "@openasist/component-course-detail";

import ModalComponent           from "@openasist/component-modal";

import TabBarIcon               from "../tabBarIcon";

/**
 * Tab Options
 */
const options = {
    title: 'Timetable',
    tabBarAccessibilityLabel: 'accessibility:navigation.timetable',
    tabBarIcon:  (props) => TabBarIcon("timetable", props),
    header: () => null
}

/**
 * Navigation stack for courses
 */
const stack = (props) => {
    const Stack = createStackNavigator()
    return  (
        <Stack.Navigator>
            <Stack.Screen name="TimetableViewCalendar" component={TimetableViewCalendar}  options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
