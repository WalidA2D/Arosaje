import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

import OpenLayersMap from '../../components/OpenLayersMap';
import Loading from '../../components/Loading';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ActuMap() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState<{ latitude: number, longitude: number }[]>([]);
  const mapRef = useRef<any>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  // Add a state to store the selected marker
  const [selectedMarker, setSelectedMarker] = useState<{ latitude: number, longitude: number } | null>(null);

  // Update the handleMarkerPress function to set the selected marker
  const handleMarkerPress = (marker: { latitude: number, longitude: number }) => {
    setSelectedMarker(marker);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Fetch user posts to get markers
      fetchUserPosts();
    })();
  }, []);

  const fetchUserPosts = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken || '',
        }
    };

    try {
        const response = await fetch(`${apiUrl}/post/read`, options);
        const data = await response.json();

        if (data.success && data.posts) {
            const filteredPosts = data.posts.filter(post => !post.accepted && post.acceptedBy === null);
            const markersData = await Promise.all(filteredPosts.map(async (post: { address: string, cityName: string }) => {
                const address = post.address;
                const cityName = post.cityName;
                const coordinates = await fetchCoordinates(address, cityName);
                return coordinates;
            }));
            setMarkers(markersData);
        } else {
            console.error('Failed to fetch posts:', data.message);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
  };

  const fetchCoordinates = async (address: string, cityName: string) => {
    const formattedAddress = `${address}, ${cityName}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedAddress)}&format=json`;

    try {
        const response = await axios.get(url);
        
        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { latitude: lat, longitude: lon };
        } else {
            console.error('No results found for the address:', formattedAddress);
            return null;
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
  };

  const recenterMap = async () => {
    setLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    if (mapRef.current) {
      (mapRef.current as any).setCenter([location.coords.longitude, location.coords.latitude]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {location ? (
          <OpenLayersMap
            ref={mapRef}
            latitude={location.coords.latitude}
            longitude={location.coords.longitude}
            markers={markers}
            onMarkerPress={handleMarkerPress} // Pass the handleMarkerPress function to the map component
          />
        ) : (
          <Loading />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={recenterMap} disabled={loading}>
        {loading ? (
          <Loading />
        ) : (
          <Ionicons name="navigate-outline" size={32} color="#fff" />
        )}
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