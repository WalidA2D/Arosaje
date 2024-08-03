import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import axios from 'axios';

import OpenLayersMap from '../../components/OpenLayersMap';
import BigButtonDown from '../../components/BigButtonDown';
import Loading from '../../components/Loading';

type RootStackParamList = {
  Publier: { locValid?: boolean, localisation: string };
  Localisation: { localisation: '' };
};

type UpdateLocaNavigationProp = StackNavigationProp<RootStackParamList, 'Localisation'>;
type UpdateLocaRouteProp = RouteProp<RootStackParamList, 'Localisation'>;

type Suggestion = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
};

export default function PubLoca() {
  const navigation = useNavigation<UpdateLocaNavigationProp>();
  const route = useRoute<UpdateLocaRouteProp>();
  const [localisation, setLocalisation] = useState('');
  const [locCompleted, setLocCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocalisation();
  }, []);

  const loadLocalisation = async () => {
    try {
      const savedLocalisation = await AsyncStorage.getItem('savedLocalisation');
      if (savedLocalisation) {
        setLocalisation(savedLocalisation);
        setLocCompleted(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la localisation:', error);
    }
  };

  const saveLocalisation = async () => {
    try {
      await AsyncStorage.setItem('savedLocalisation', localisation);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la localisation:', error);
    }
  };

  const handleValidation = () => {
    if (localisation.trim() !== '') {
      setLocCompleted(true);
      setIsEditing(false);
      saveLocalisation();
      navigation.navigate('Publier', { locValid: true, localisation: localisation });
    } else {
      navigation.navigate('Publier', { locValid: false, localisation: '' });
    }
  };

  const clearLocalisation = async () => {
    try {
      if (!isEditing) {
        await AsyncStorage.removeItem('savedLocalisation');
        setLocalisation('');
        setLocCompleted(false);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la localisation sauvegardée:', error);
    }
  };

  const editLocalisation = () => {
    setIsEditing(true);
  };

  const handleAutoLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setRegion({
      latitude,
      longitude,
    });

    let address = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address.length > 0) {
      const { street, city, region, postalCode } = address[0];
      const fullAddress = `${street}, ${city}, ${postalCode}, ${region}`;
      setLocalisation(fullAddress);
      setLocCompleted(true);
      setIsEditing(false);
      saveLocalisation();
    }
    setLoading(false);
  };

  const fetchSuggestions = async (input: string) => {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&countrycodes=fr`);
    setSuggestions(response.data);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const { lat, lon, display_name } = suggestion;
    setRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    });
    setLocalisation(display_name);
    setSuggestions([]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {loading && <Loading />}
      {!loading && (
        <>
          {locCompleted ? <Text style={styles.text}>Localisation : {localisation}</Text> : null}
          <View style={styles.mapContainer}>
            <OpenLayersMap latitude={region.latitude} longitude={region.longitude} />
          </View>
          <TouchableOpacity onPress={handleAutoLocation} style={styles.autoButton}>
            <Text style={styles.buttonText}>Localisation automatique</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={editLocalisation} style={styles.manualButton}>
            <Text style={styles.buttonText}>Localisation manuelle</Text>
          </TouchableOpacity>
          {isEditing && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Entrez l'adresse"
                value={localisation}
                onChangeText={text => {
                  setLocalisation(text);
                  fetchSuggestions(text);
                }}
                textAlignVertical="top"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                    <Text style={styles.suggestion}>{item.display_name}</Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
          <TouchableOpacity onPress={clearLocalisation} style={styles.clearButtonContainer}>
            <Text style={styles.clearButton}>Vider la localisation</Text>
          </TouchableOpacity>
          <BigButtonDown buttonText="Valider" onPress={handleValidation} />
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapContainer: {
    width: '90%',
    height: 200,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  autoButton: {
    backgroundColor: '#668F80',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  manualButton: {
    backgroundColor: '#668F80',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  clearButtonContainer: {
    marginTop: 20,
    marginBottom: 100,
  },
  clearButton: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});