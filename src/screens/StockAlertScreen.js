import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { COLORS } from '../constants/theme';

export default function StockAlertScreen() {
    const [alerts, setAlerts] = useState([
        { id: '1', facility: 'Central Clinic', status: 'No Stock', medication: 'ARVs', timestamp: '2 hours ago' },
        { id: '2', facility: 'Dis-Chem', status: 'System Offline', medication: 'General', timestamp: '5 hours ago' },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [facility, setFacility] = useState('');
    const [medication, setMedication] = useState('');
    const [status, setStatus] = useState('No Stock');

    const addAlert = () => {
        if (!facility || !medication) return;

        const newAlert = {
            id: Date.now().toString(),
            facility,
            medication,
            status,
            timestamp: 'Just now'
        };

        setAlerts([newAlert, ...alerts]);
        setFacility('');
        setMedication('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Report Issue</Text>
            </TouchableOpacity>

            <FlatList
                data={alerts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.facility}>{item.facility}</Text>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                        </View>
                        <Text style={styles.status}>{item.status}</Text>
                        <Text style={styles.medication}>Medication: {item.medication}</Text>
                    </View>
                )}
                contentContainerStyle={styles.list}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Report Stock Issue</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Facility Name"
                        value={facility}
                        onChangeText={setFacility}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Medication (e.g. ARVs, Insulin)"
                        value={medication}
                        onChangeText={setMedication}
                    />

                    <View style={styles.statusContainer}>
                        {['No Stock', 'System Offline', 'Clinic Closed'].map(s => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.statusButton, status === s && styles.statusButtonActive]}
                                onPress={() => setStatus(s)}
                            >
                                <Text style={[styles.statusText, status === s && styles.statusTextActive]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={addAlert}>
                            <Text style={styles.buttonText}>Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    list: {
        padding: 20,
    },
    addButton: {
        backgroundColor: COLORS.danger,
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    facility: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    timestamp: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    status: {
        color: COLORS.danger,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    medication: {
        color: COLORS.textLight,
    },
    modalView: {
        margin: 20,
        marginTop: '30%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    statusButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    statusButtonActive: {
        backgroundColor: COLORS.danger,
        borderColor: COLORS.danger,
    },
    statusText: {
        color: COLORS.textLight,
    },
    statusTextActive: {
        color: COLORS.white,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.textLight,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
