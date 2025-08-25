import React                        from 'react';
import { View }                     from 'react-native';
import { useTranslation }           from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import ConnectivityWarning          from '@openasist/component-connectivity-warning';

import DashboardStack               from './stacks/dashboard';
import FeedsStack                   from './stacks/feeds';
import TimetableListStack           from './stacks/timetable-list';
import CanteensStack                from './stacks/canteens';
import MenuStack                    from './stacks/menu';

const BottomTabs = createBottomTabNavigator();


export default ({colors}) => {

    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const tabBarHeight = 46 + insets.bottom;

    return (
        <SafeAreaProvider>
            <View style={{
                flex: 1,
                paddingTop: insets.top,
                backgroundColor: colors.safeAreaTopBackground
            }}>
                <ConnectivityWarning bottomNavbarHeight={tabBarHeight}>
                    <BottomTabs.Navigator screenOptions={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarActiveTintColor: colors.tabIconSelected,
                        tabBarInactiveTintColor: colors.tabIconDefault,
                        tabBarHideOnKeyboard: true,
                        tabBarStyle: [{
                            display: 'flex',
                            height:  tabBarHeight,
                            backgroundColor: colors.tabBar
                        }]
                    }}>
                        <BottomTabs.Screen name="dashboardTab"  options={{...DashboardStack.options, tabBarAccessibilityLabel: t(DashboardStack.options.tabBarAccessibilityLabel)}} accessible={true}>{DashboardStack.stack}</BottomTabs.Screen>
                        <BottomTabs.Screen name="feedsTab"      options={{...FeedsStack.options, tabBarAccessibilityLabel: t(FeedsStack.options.tabBarAccessibilityLabel)}}>{FeedsStack.stack}</BottomTabs.Screen>
                        <BottomTabs.Screen name="TimetableList" options={{...TimetableListStack.options, tabBarAccessibilityLabel: t(TimetableListStack.options.tabBarAccessibilityLabel)}}>{TimetableListStack.stack}</BottomTabs.Screen>
                        <BottomTabs.Screen name="canteensTab"   options={{...CanteensStack.options, tabBarAccessibilityLabel: t(CanteensStack.options.tabBarAccessibilityLabel)}}>{CanteensStack.stack}</BottomTabs.Screen>
                        <BottomTabs.Screen name="menuTab"       options={{...MenuStack.options, tabBarAccessibilityLabel: t(MenuStack.options.tabBarAccessibilityLabel)}}>{MenuStack.stack}</BottomTabs.Screen>
                    </BottomTabs.Navigator>
                </ConnectivityWarning>
            </View>
        </SafeAreaProvider>
    );
};
