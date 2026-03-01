import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS } from '../constants/theme';
import { scheduleMedicationReminder } from '../services/notifications';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState('');
    const [medications, setMedications] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [newMedName, setNewMedName] = useState('');

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        setModalVisible(true);
    };

    const addMedication = async () => {
        if (!newMedName) return;

        const newMeds = { ...medications };
        if (!newMeds[selectedDate]) {
            newMeds[selectedDate] = [];
        }
        newMeds[selectedDate].push({ name: newMedName, status: 'due' });

        setMedications(newMeds);

        try {
            await scheduleMedicationReminder(newMedName, selectedDate);
            Alert.alert('Success', 'Reminder scheduled!');
        } catch (error) {
            console.log('Notification error:', error);
        }

        setNewMedName('');
        setModalVisible(false);
    };

    const getMarkedDates = () => {
        const marked = {};
        Object.keys(medications).forEach(date => {
            marked[date] = { marked: true, dotColor: COLORS.warning };
        });
        if (selectedDate) {
            marked[selectedDate] = { ...marked[selectedDate], selected: true, selectedColor: COLORS.primary };
        }
        return marked;
    };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={onDayPress}
                markedDates={getMarkedDates()}
                theme={{
                    selectedDayBackgroundColor: COLORS.primary,
                    todayTextColor: COLORS.primary,
                    arrowColor: COLORS.primary,
                }}
            />

            <View style={styles.listContainer}>
                <Text style={styles.listHeader}>Upcoming Pickups</Text>
                <FlatList
                    data={Object.keys(medications).sort()}
                    keyExtractor={item => item}
                    renderItem={({ item: date }) => (
                        <View>
                            <Text style={styles.dateHeader}>{date}</Text>
                            {medications[date].map((med, index) => (
                                <View key={index} style={styles.medItem}>
                                    <Text style={styles.medName}>{med.name}</Text>
                                    <Text style={styles.medStatus}>{med.status}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add Pickup for {selectedDate}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Medication Name"
                        value={newMedName}
                        onChangeText={setNewMedName}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={addMedication}>
                            <Text style={styles.buttonText}>Add</Text>
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
        paddingTop: 50,
    },
    listContainer: {
        flex: 1,
        padding: 20,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.text,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textLight,
        marginTop: 10,
    },
    medItem: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderLeftWidth: 5,
        borderLeftColor: COLORS.warning,
    },
    medName: {
        fontSize: 16,
        color: COLORS.text,
    },
    medStatus: {
        color: COLORS.warning,
        fontWeight: 'bold',
    },
    modalView: {
        margin: 20,
        marginTop: '50%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 10,
        width: '100%',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.danger,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
