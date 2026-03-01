import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

export default function MapComponent({ region, points, style }) {
    return (
        <MapView
            style={style || styles.map}
            initialRegion={region}
            showsUserLocation={true}
        >
            {points.map(point => (
                <Marker
                    key={point.id}
                    coordinate={point.coordinate}
                    title={point.title}
                    description={point.description}
                    pinColor={COLORS.primary}
                />
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
