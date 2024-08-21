import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import axios from 'axios';

import OpenLayersMap from '../../components/OpenLayersMap';
import Loading from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  BlogFocus: { id: string };
};

export default function ActuMap() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [markers, setMarkers] = useState<{ latitude: number, longitude: number, id: string }[]>([]);
  const mapRef = useRef<any>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
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
        const filteredPosts = data.posts.filter((post: { accepted: boolean; acceptedBy: any; address: string; cityName: string; idPosts: string; }) => !post.accepted && post.acceptedBy === null);
        const markersData = await Promise.all(filteredPosts.map(async (post: { address: string; cityName: string; idPosts: string; }) => {
          const coordinates = await fetchCoordinates(post.address, post.cityName);
          if (coordinates) {
            return { 
              latitude: Number(coordinates.latitude),
              longitude: Number(coordinates.longitude),
              id: post.idPosts
            };
          }
          return null;
        }));
        setMarkers(markersData.filter(marker => marker !== null));
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

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {location ? (
          <OpenLayersMap
            ref={mapRef}
            latitude={location.coords.latitude}
            longitude={location.coords.longitude}
            markers={markers}
            onMarkerPress={(id) => {
                console.log('Navigating to BlogFocus with ID:', id);
                navigation.navigate('BlogFocus', { id });
            }} // Passer la fonction de navigation ici
          />
        ) : (
          <Loading />
        )}
      </View>
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
});