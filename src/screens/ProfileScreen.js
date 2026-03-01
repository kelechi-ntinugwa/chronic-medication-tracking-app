import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { createUserProfile, getUserProfile } from '../services/firestore';
// import { auth } from '../services/firebase';

export default function ProfileScreen() {
    const [name, setName] = useState('');
    const [facility, setFacility] = useState('');
    const [fileNumber, setFileNumber] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock User ID for demo
    const userId = 'demo-user-id';

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        // setLoading(true);
        // try {
        //   const profile = await getUserProfile(userId);
        //   if (profile) {
        //     setName(profile.name);
        //     setFacility(profile.facilityName);
        //     setFileNumber(profile.fileNumber);
        //   }
        // } catch (error) {
        //   console.error(error);
        // } finally {
        //   setLoading(false);
        // }
    };

    const handleSave = async () => {
        if (!name || !facility || !fileNumber) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            // await createUserProfile(userId, {
            //   name,
            //   facilityName: facility,
            //   fileNumber,
            //   updatedAt: new Date()
            // });
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>My Profile</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                />

                <Text style={styles.label}>Facility Name (Clinic/Hospital)</Text>
                <TextInput
                    style={styles.input}
                    value={facility}
                    onChangeText={setFacility}
                    placeholder="e.g. Central Clinic"
                />

                <Text style={styles.label}>File Number</Text>
                <TextInput
                    style={styles.input}
                    value={fileNumber}
                    onChangeText={setFileNumber}
                    placeholder="e.g. 12345678"
                />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 20,
        marginTop: 40,
    },
    form: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
