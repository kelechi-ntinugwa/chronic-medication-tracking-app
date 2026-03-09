import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DependentsScreen() {
    const [dependents, setDependents] = useState([
        { id: '1', name: 'Grandma Rose', relation: 'Grandmother', dob: '1945-05-12' }
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('');
    const [dob, setDob] = useState('');

    const handleAddDependent = () => {
        if (!name) return;
        const newDep = {
            id: Date.now().toString(),
            name,
            relation,
            dob
        };
        setDependents([...dependents, newDep]);
        setName('');
        setRelation('');
        setDob('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="person-add" size={24} color={COLORS.white} />
                <Text style={styles.addButtonText}>  Add Dependent</Text>
            </TouchableOpacity>

            <FlatList
                data={dependents}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.relation}>{item.relation}</Text>
                        </View>
                        <Text style={styles.dob}>DOB: {item.dob}</Text>
                        <TouchableOpacity style={styles.manageButton}>
                            <Text style={styles.manageButtonText}>Manage Medications</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No dependents added yet.</Text>}
            />

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add Care Dependent</Text>
                    <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
                    <TextInput style={styles.input} placeholder="Relationship (e.g. Son, Mother)" value={relation} onChangeText={setRelation} />
                    <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleAddDependent}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: 20 },
    addButton: { flexDirection: 'row', backgroundColor: COLORS.primary, margin: 20, padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    addButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
    card: { backgroundColor: COLORS.white, padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    name: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    relation: { fontSize: 14, color: COLORS.primary, fontStyle: 'italic', alignSelf: 'center' },
    dob: { color: COLORS.textLight, marginBottom: 15 },
    manageButton: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, alignItems: 'center' },
    manageButtonText: { color: COLORS.primary, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, color: COLORS.textLight },
    modalView: { margin: 20, marginTop: '30%', backgroundColor: 'white', borderRadius: 20, padding: 35, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 15 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 12, width: '45%', alignItems: 'center' },
    cancelButton: { backgroundColor: COLORS.textLight },
    buttonText: { color: 'white', fontWeight: 'bold' }
});
