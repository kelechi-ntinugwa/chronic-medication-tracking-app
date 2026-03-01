import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { COLORS } from '../constants/theme';

export default function ConditionTrackingScreen() {
    const [logs, setLogs] = useState([
        { id: '1', type: 'Blood Pressure', value: '120/80', date: '2025-10-20' },
        { id: '2', type: 'Glucose', value: '5.5', date: '2025-10-21' },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [type, setType] = useState('Blood Pressure');
    const [value, setValue] = useState('');

    const addLog = () => {
        if (!value) return;
        const newLog = {
            id: Date.now().toString(),
            type,
            value,
            date: new Date().toISOString().split('T')[0]
        };
        setLogs([newLog, ...logs]);
        setValue('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Log New Reading</Text>
            </TouchableOpacity>

            <FlatList
                data={logs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.logItem}>
                        <View>
                            <Text style={styles.logType}>{item.type}</Text>
                            <Text style={styles.logDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.logValue}>{item.value}</Text>
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
                    <Text style={styles.modalTitle}>Log Health Data</Text>

                    <View style={styles.typeContainer}>
                        {['Blood Pressure', 'Glucose', 'Viral Load'].map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.typeButton, type === t && styles.typeButtonActive]}
                                onPress={() => setType(t)}
                            >
                                <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Value (e.g. 120/80)"
                        value={value}
                        onChangeText={setValue}
                    />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={addLog}>
                            <Text style={styles.buttonText}>Save</Text>
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
        backgroundColor: COLORS.secondary,
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
    logItem: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    logType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    logDate: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    logValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    modalView: {
        margin: 20,
        marginTop: '40%',
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
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        justifyContent: 'center',
    },
    typeButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        margin: 5,
    },
    typeButtonActive: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    typeText: {
        color: COLORS.textLight,
    },
    typeTextActive: {
        color: COLORS.white,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
