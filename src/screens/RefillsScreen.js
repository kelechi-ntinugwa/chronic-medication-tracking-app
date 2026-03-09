import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RefillsScreen() {
    const [prescriptions, setPrescriptions] = useState([
        { id: '1', name: 'Lisinopril', dosage: '10mg', refillsRemaining: 2, status: 'Active' },
        { id: '2', name: 'Metformin', dosage: '500mg', refillsRemaining: 0, status: 'Needs Renewal' },
    ]);
    const [refillRequests, setRefillRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCachedData();
    }, []);

    const loadCachedData = async () => {
        try {
            const cachedRequests = await AsyncStorage.getItem('refillRequests');
            if (cachedRequests) {
                setRefillRequests(JSON.parse(cachedRequests));
            }
        } catch (e) {
            console.error("Error loading cached refill requests", e);
        }
    };

    const handleRequestRefill = async (prescription) => {
        if (prescription.refillsRemaining <= 0) {
            Alert.alert("Renewal Required", "You have no refills left. A renewal request will be sent to your provider.");
        }

        const newRequest = {
            id: Date.now().toString(),
            prescriptionId: prescription.id,
            medName: prescription.name,
            dosage: prescription.dosage,
            date: new Date().toLocaleDateString(),
            status: 'Requested'
        };

        const updatedRequests = [newRequest, ...refillRequests];
        setRefillRequests(updatedRequests);

        try {
            await AsyncStorage.setItem('refillRequests', JSON.stringify(updatedRequests));
            Alert.alert("Request Sent", `Your refill request for ${prescription.name} has been submitted.`);
        } catch (e) {
            console.error("Error saving refill request", e);
        }
        // In a real app, this would also POST to /api/RefillRequests
    };

    const renderPrescriptionItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.medName}>{item.name}</Text>
                <Text style={styles.dosage}>{item.dosage}</Text>
            </View>
            <Text style={styles.refillsText}>Refills Remaining: {item.refillsRemaining}</Text>

            <TouchableOpacity
                style={[styles.button, item.refillsRemaining === 0 ? styles.renewButton : styles.refillButton]}
                onPress={() => handleRequestRefill(item)}
            >
                <Text style={styles.buttonText}>
                    {item.refillsRemaining === 0 ? "Request Renewal" : "Request Refill"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyCard}>
            <Text style={styles.historyMedName}>{item.medName} {item.dosage}</Text>
            <View style={styles.historyDetails}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyStatus}>{item.status}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Active Prescriptions</Text>
            <FlatList
                data={prescriptions}
                keyExtractor={item => item.id}
                renderItem={renderPrescriptionItem}
                style={styles.list}
            />

            <Text style={styles.sectionTitle}>Recent Requests</Text>
            <FlatList
                data={refillRequests}
                keyExtractor={item => item.id}
                renderItem={renderHistoryItem}
                style={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No recent requests found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginVertical: 10,
        marginLeft: 5,
    },
    list: {
        flexGrow: 0,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    medName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    dosage: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    refillsText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 15,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    refillButton: {
        backgroundColor: COLORS.primary,
    },
    renewButton: {
        backgroundColor: COLORS.warning,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyCard: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    historyMedName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    historyDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    historyDate: {
        color: COLORS.textLight,
    },
    historyStatus: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: COLORS.textLight,
        fontStyle: 'italic',
    }
});
