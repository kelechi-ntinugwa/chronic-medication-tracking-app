import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import StockAlertScreen from '../screens/StockAlertScreen';
import ConditionTrackingScreen from '../screens/ConditionTrackingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="StockAlerts" component={StockAlertScreen} options={{ headerShown: true, title: 'Stock Alerts' }} />
            <Stack.Screen name="ConditionTracking" component={ConditionTrackingScreen} options={{ headerShown: true, title: 'Health Log' }} />
        </Stack.Navigator>
    );
}
