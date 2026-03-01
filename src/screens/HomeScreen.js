import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, Patient</Text>
                <Text style={styles.subtext}>Your health summary</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Next Pickup</Text>
                <Text style={styles.cardContent}>Oct 24, 2025</Text>
                <Text style={styles.cardStatus}>Due in 5 days</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('StockAlerts')}>
                    <Text style={styles.actionText}>Stock Alerts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ConditionTracking')}>
                    <Text style={styles.actionText}>Health Log</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.primary,
        paddingTop: 60,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    subtext: {
        color: COLORS.white,
        opacity: 0.8,
    },
    card: {
        backgroundColor: COLORS.white,
        margin: 20,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    cardContent: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginVertical: 5,
    },
    cardStatus: {
        color: COLORS.warning,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    actionButton: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    actionText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});
