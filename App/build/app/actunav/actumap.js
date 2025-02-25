var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import OpenLayersMap from '../../components/OpenLayersMap';
import Loading from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ActuMap() {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null);
    const apiUrl = process.env.EXPO_PUBLIC_API_IP || '';
    useEffect(() => {
        (() => __awaiter(this, void 0, void 0, function* () {
            let { status } = yield Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = yield Location.getCurrentPositionAsync({});
            setLocation(location);
            fetchUserPosts();
        }))();
    }, []);
    const fetchUserPosts = () => __awaiter(this, void 0, void 0, function* () {
        const userToken = yield AsyncStorage.getItem('userToken');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || '',
            }
        };
        try {
            const response = yield fetch(`${apiUrl}/post/read`, options);
            const data = yield response.json();
            if (data.success && data.posts) {
                const filteredPosts = data.posts.filter((post) => !post.accepted && post.idUserAssigned === null);
                const markersData = yield Promise.all(filteredPosts.map((post) => __awaiter(this, void 0, void 0, function* () {
                    const coordinates = yield fetchCoordinates(post.address, post.cityName);
                    if (coordinates) {
                        return {
                            latitude: Number(coordinates.latitude),
                            longitude: Number(coordinates.longitude),
                            id: post.idPost
                        };
                    }
                    return null;
                })));
                setMarkers(markersData.filter(marker => marker !== null));
            }
            else {
                console.error('Failed to fetch posts:', data.message);
            }
        }
        catch (error) {
            console.error('Error fetching posts:', error);
        }
    });
    const fetchCoordinates = (address, cityName) => __awaiter(this, void 0, void 0, function* () {
        const formattedAddress = `${address}, ${cityName}`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedAddress)}&format=json`;
        try {
            const response = yield axios.get(url);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { latitude: lat, longitude: lon };
            }
            else {
                console.error('No results found for the address:', formattedAddress);
                return null;
            }
        }
        catch (error) {
            console.error('Error fetching coordinates:', error);
            return null;
        }
    });
    return (<View style={styles.container}>
      <View style={styles.mapContainer}>
        {location ? (<OpenLayersMap ref={mapRef} latitude={location.coords.latitude} longitude={location.coords.longitude} markers={markers} onMarkerPress={(id) => {
                console.log('Navigating to BlogFocus with ID:', id);
                navigation.navigate('BlogFocus', { id });
            }} // Passer la fonction de navigation ici
        />) : (<Loading />)}
      </View>
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
    },
});
