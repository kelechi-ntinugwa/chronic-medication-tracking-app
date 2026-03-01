import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { COLORS } from '../constants/theme';
import MapComponent from '../components/MapComponent';

export default function DirectoryScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Mock Data for Pick-Up Points
    const pickupPoints = [
        { id: 1, title: 'Central Clinic', description: 'CCMDD Pickup Point', coordinate: { latitude: -26.2041, longitude: 28.0473 } },
        { id: 2, title: 'Clicks Pharmacy', description: 'Commercial Pickup', coordinate: { latitude: -26.1952, longitude: 28.0340 } },
        { id: 3, title: 'Dis-Chem', description: 'Commercial Pickup', coordinate: { latitude: -26.2100, longitude: 28.0500 } },
    ];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapComponent
                region={{
                    latitude: -26.2041,
                    longitude: 28.0473,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                points={pickupPoints}
                style={styles.map}
            />
            {errorMsg && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    errorContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,0,0,0.7)',
        padding: 10,
        borderRadius: 10,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
    },
});
