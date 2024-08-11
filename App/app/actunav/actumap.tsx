import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';

import OpenLayersMap from '../../components/OpenLayersMap';
import Loading from '../../components/Loading';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ActuMap() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const recenterMap = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    if (mapRef.current) {
      (mapRef.current as any).setCenter([location.coords.longitude, location.coords.latitude]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {location ? (
          <OpenLayersMap
            ref={mapRef}
            latitude={location.coords.latitude}
            longitude={location.coords.longitude}
            forwardRef={mapRef}
          />
        ) : (
          <Loading />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={recenterMap}>
        <Ionicons name="navigate-outline" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#668F80',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
});