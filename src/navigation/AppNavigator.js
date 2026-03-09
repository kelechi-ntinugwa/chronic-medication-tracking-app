import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import StockAlertScreen from '../screens/StockAlertScreen';
import ConditionTrackingScreen from '../screens/ConditionTrackingScreen';
import RemindersScreen from '../screens/RemindersScreen';
import RefillsScreen from '../screens/RefillsScreen';
import EmergencyProfileScreen from '../screens/EmergencyProfileScreen';
import DependentsScreen from '../screens/DependentsScreen';
import InsuranceScreen from '../screens/InsuranceScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="StockAlerts" component={StockAlertScreen} options={{ headerShown: true, title: 'Stock Alerts' }} />
            <Stack.Screen name="ConditionTracking" component={ConditionTrackingScreen} options={{ headerShown: true, title: 'Health Log' }} />
            <Stack.Screen name="Reminders" component={RemindersScreen} options={{ headerShown: true, title: 'Daily Reminders' }} />
            <Stack.Screen name="Refills" component={RefillsScreen} options={{ headerShown: true, title: 'Medication Refills' }} />
            <Stack.Screen name="EmergencyProfile" component={EmergencyProfileScreen} options={{ headerShown: true, title: 'Medical ID / SOS' }} />
            <Stack.Screen name="Dependents" component={DependentsScreen} options={{ headerShown: true, title: 'Family & Dependents' }} />
            <Stack.Screen name="Insurance" component={InsuranceScreen} options={{ headerShown: true, title: 'Insurance Cards' }} />
        </Stack.Navigator>
    );
}
