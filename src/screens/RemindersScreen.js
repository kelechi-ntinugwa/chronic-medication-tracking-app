import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { scheduleDailyDoseReminder } from '../services/notifications';

export default function RemindersScreen() {
    const [reminders, setReminders] = useState([
        { id: '1', medName: 'Lisinopril', time: '09:00', dosage: '10mg', taken: false },
        { id: '2', medName: 'Metformin', time: '20:00', dosage: '500mg', taken: false }
    ]);

    const [streak, setStreak] = useState(14); // Mock streak days

    useEffect(() => {
        // Schedule push notifications for these mock reminders
        reminders.forEach(r => {
            scheduleDailyDoseReminder(r.medName, r.time, r.dosage);
        });
    }, []);

    const handleTakeMedication = (id) => {
        setReminders(prev => prev.map(med =>
            med.id === id ? { ...med, taken: true } : med
        ));
        Alert.alert("Recorded!", "You've successfully logged this dose.");
        // In a real app, this would post to /api/AdherenceLogs
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.medName}>{item.medName} ({item.dosage})</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            {item.taken ? (
                <View style={styles.takenBadge}>
                    <Text style={styles.takenText}>Status: Taken ✓</Text>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleTakeMedication(item.id)}
                >
                    <Text style={styles.actionText}>Mark as Taken</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.streakContainer}>
                <Text style={styles.streakTitle}>Current Streak</Text>
                <Text style={styles.streakValue}>🔥 {streak} Days</Text>
            </View>
            <FlatList
                data={reminders}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    streakContainer: {
        backgroundColor: COLORS.primary,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    streakTitle: {
        color: COLORS.white,
        fontSize: 16,
    },
    streakValue: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 5,
    },
    card: {
        backgroundColor: COLORS.white,
        marginVertical: 8,
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    medName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    time: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    takenBadge: {
        backgroundColor: '#E8F5E9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    takenText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
