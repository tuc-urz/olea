import React                    from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import TimetableViewCalendar    from '@olea/view-timetable-calendar';
import TimetableViewList        from '@olea/view-timetable-list';
import TimetableCourseView      from "@olea/component-course-detail";

import ModalComponent           from "@olea/component-modal";

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
            <Stack.Screen name="TimetableViewList"     component={TimetableViewList}      options={{headerShown: false}}/>
            <Stack.Screen name="CourseInfo"            component={TimetableCourseView}    options={{headerShown: false}}/>
            <Stack.Screen name="Modal"                 component={ModalComponent}         options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default { options, stack }
