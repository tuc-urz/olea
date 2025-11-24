import { createStackNavigator } from '@react-navigation/stack';

import { TimetableCalendar as TimetableViewCalendar } from '@olea-bps/views';

import TabBarIcon from               '../tabBarIcon';

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
            <Stack.Screen name="TimetableViewCalendar" component={TimetableViewCalendar} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default { options, stack }