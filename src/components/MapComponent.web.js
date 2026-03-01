import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';

export default function MapComponent({ region, points }) {
    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Interactive Map is optimized for Mobile App.</Text>
            <Text style={styles.subtext}>On web, please use Google Maps directly.</Text>

            <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
                <Text style={styles.buttonText}>Open in Google Maps</Text>
            </TouchableOpacity>

            <View style={styles.pointsList}>
                <Text style={styles.header}>Available Pickup Points:</Text>
                {points.map(point => (
                    <View key={point.id} style={styles.pointItem}>
                        <Text style={styles.pointTitle}>{point.title}</Text>
                        <Text style={styles.pointDesc}>{point.description}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.background,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    pointsList: {
        width: '100%',
        maxWidth: 500,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.text,
    },
    pointItem: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pointTitle: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    pointDesc: {
        color: COLORS.textLight,
        fontSize: 12,
    },
});
