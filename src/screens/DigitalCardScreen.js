import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import { getUserProfile } from '../services/firestore';

export default function DigitalCardScreen() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock User ID for demo
    const userId = 'demo-user-id';

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        // Simulate fetching
        setTimeout(() => {
            setProfile({
                name: 'John Doe',
                facilityName: 'Central Clinic',
                fileNumber: '123456789',
                conditions: ['Hypertension']
            });
            setLoading(false);
        }, 1000);

        // Real implementation:
        // try {
        //   const data = await getUserProfile(userId);
        //   setProfile(data);
        // } catch (err) {
        //   console.error(err);
        // } finally {
        //   setLoading(false);
        // }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Digital CCMDD Card</Text>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Chronic Meds Card</Text>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text style={styles.label}>Patient Name</Text>
                        <Text style={styles.value}>{profile?.name || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text style={styles.label}>File Number</Text>
                        <Text style={styles.value}>{profile?.fileNumber || 'N/A'}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Facility</Text>
                        <Text style={styles.value}>{profile?.facilityName || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.label}>Conditions</Text>
                <Text style={styles.value}>
                    {profile?.conditions?.join(', ') || 'None listed'}
                </Text>

                <View style={styles.barcodePlaceholder}>
                    <Text style={styles.barcodeText}>||| || ||| || |||| |||</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.secondary,
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        minHeight: 250,
    },
    cardHeader: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        paddingBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 4,
    },
    value: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 15,
    },
    barcodePlaceholder: {
        marginTop: 20,
        backgroundColor: COLORS.white,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    barcodeText: {
        fontFamily: 'monospace',
        fontSize: 20,
        letterSpacing: 2,
    },
});
