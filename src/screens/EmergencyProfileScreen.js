import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyProfileScreen() {
    const [profile, setProfile] = useState({
        bloodType: '',
        allergies: '',
        emergencyContacts: '',
        primaryPhysician: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const cachedProfile = await AsyncStorage.getItem('emergencyProfile');
            if (cachedProfile) {
                setProfile(JSON.parse(cachedProfile));
            }
        } catch (e) {
            console.error("Failed to load emergency profile", e);
        }
    };

    const handleSave = async () => {
        try {
            await AsyncStorage.setItem('emergencyProfile', JSON.stringify(profile));
            setIsEditing(false);
            Alert.alert("Saved", "Emergency profile updated successfully. It is now accessible offline.");
            // In a real app, this would also POST to /api/EmergencyProfile
        } catch (e) {
            console.error("Error saving emergency profile", e);
            Alert.alert("Error", "Could not save profile");
        }
    };

    const renderField = (label, key, placeholder, multiline = false) => {
        if (!isEditing) {
            return (
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>{profile[key] || 'Not specified'}</Text>
                </View>
            );
        }

        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={[styles.input, multiline && styles.textArea]}
                    value={profile[key]}
                    onChangeText={(text) => setProfile({ ...profile, [key]: text })}
                    placeholder={placeholder}
                    multiline={multiline}
                />
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="medical" size={50} color={COLORS.danger} />
                <Text style={styles.title}>Medical ID</Text>
                <Text style={styles.subtitle}>Accessible Offline for First Responders</Text>
            </View>

            <View style={styles.card}>
                {renderField("Blood Type", "bloodType", "e.g., O-")}
                {renderField("Allergies", "allergies", "List any known allergies", true)}
                {renderField("Emergency Contacts", "emergencyContacts", "Names & Phone numbers", true)}
                {renderField("Primary Physician", "primaryPhysician", "Dr. Name & Contact info", true)}
            </View>

            {isEditing ? (
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText}>Edit Medical ID</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.sosButton} onPress={() => Alert.alert("SOS triggered", "Calling emergency services and notifying contacts...")}>
                <Ionicons name="warning" size={24} color={COLORS.white} />
                <Text style={styles.sosText}> TRIGGER SOS</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.danger,
        marginTop: 10,
    },
    subtitle: {
        color: COLORS.textLight,
        marginTop: 5,
    },
    card: {
        backgroundColor: COLORS.white,
        margin: 15,
        borderRadius: 10,
        padding: 20,
        elevation: 2,
    },
    fieldContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 10,
    },
    label: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: COLORS.text,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    editButton: {
        backgroundColor: COLORS.primary,
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '48%',
    },
    cancelButton: {
        backgroundColor: COLORS.textLight,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sosButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.danger,
        margin: 15,
        marginTop: 30,
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    sosText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10,
    }
});
