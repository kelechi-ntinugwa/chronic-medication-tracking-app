import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function InsuranceScreen() {
    const [cards, setCards] = useState([
        { id: '1', provider: 'Discovery Health', policy: 'DISC928374', group: 'EMP482' }
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [provider, setProvider] = useState('');
    const [policy, setPolicy] = useState('');
    const [group, setGroup] = useState('');

    const handleAddCard = () => {
        if (!provider) return;
        setCards([...cards, { id: Date.now().toString(), provider, policy, group }]);
        setProvider('');
        setPolicy('');
        setGroup('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="card" size={24} color={COLORS.white} />
                <Text style={styles.addButtonText}>  Add Insurance Card</Text>
            </TouchableOpacity>

            <FlatList
                data={cards}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.provider}>{item.provider}</Text>
                            <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.label}>Policy Number</Text>
                        <Text style={styles.value}>{item.policy}</Text>

                        <Text style={styles.label}>Group Number</Text>
                        <Text style={styles.value}>{item.group}</Text>
                    </View>
                )}
                contentContainerStyle={styles.list}
            />

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add Insurance</Text>
                    <TextInput style={styles.input} placeholder="Provider Name" value={provider} onChangeText={setProvider} />
                    <TextInput style={styles.input} placeholder="Policy Number" value={policy} onChangeText={setPolicy} />
                    <TextInput style={styles.input} placeholder="Group Number" value={group} onChangeText={setGroup} />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleAddCard}>
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
    list: { padding: 20, paddingTop: 0 },
    addButton: { flexDirection: 'row', backgroundColor: COLORS.primary, margin: 20, padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    addButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
    card: { backgroundColor: '#1C3144', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    provider: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
    label: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 2 },
    value: { fontSize: 16, color: COLORS.white, fontWeight: 'bold', marginBottom: 15 },
    modalView: { margin: 20, marginTop: '30%', backgroundColor: 'white', borderRadius: 20, padding: 35, elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 15 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 12, width: '45%', alignItems: 'center' },
    cancelButton: { backgroundColor: COLORS.textLight },
    buttonText: { color: 'white', fontWeight: 'bold' }
});
