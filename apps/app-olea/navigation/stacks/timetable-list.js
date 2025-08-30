import { createStackNavigator } from '@react-navigation/stack';

import TimetableViewList        from '@openasist/view-timetable-list';
import TimetableCourseView      from '@openasist/component-course-detail';
import ModalComponent           from '@openasist/component-modal';

import TabBarIcon               from '../tabBarIcon';

/**
 * Tab Options
 */
const options = {
    title: 'Timetable',
    tabBarAccessibilityLabel: 'accessibility:navigation.timetable',
    tabBarIcon: (props) => TabBarIcon("timetable", props),
    header: () => null
}

/**
 * Navigation stack for courses
 */
const stack = (props) => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name="TimetableViewList" component={TimetableViewList}   options={{ headerShown: false }} />
            <Stack.Screen name="CourseInfo"        component={TimetableCourseView} options={{ headerShown: false }} />
            <Stack.Screen name="Modal"             component={ModalComponent}      options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default { options, stack }