import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import BigButtonDown from '../../components/BigButtonDown';
import Loading from '../../components/Loading';

type RootStackParamList = {
  Photo: { photo: '', plantName: '' };
  Publier: { photoValid?: boolean; plantName?: string };
};

type UpdatePhotoNavigationProp = StackNavigationProp<RootStackParamList, 'Photo'>;
type UpdatePhotoRouteProp = RouteProp<RootStackParamList, 'Photo'>;

export default function PubPhoto() {
  const navigation = useNavigation<UpdatePhotoNavigationProp>();
  const route = useRoute<UpdatePhotoRouteProp>();
  const [photo, setPhoto] = useState<string | null>(null);
  const [plantName, setPlantName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const PLANTNET = process.env.EXPO_PUBLIC_API_PLANTNET;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Désolé, nous avons besoin des permissions de la caméra pour que cela fonctionne !');
      }
      const storedPhoto = await AsyncStorage.getItem('photo');
      const storedPlant = await AsyncStorage.getItem('plant');
      if (storedPhoto) {
        setPhoto(storedPhoto);
      }
      if (storedPlant) {
        setPlantName(storedPlant);
      }
    })();
  }, []);

  const identifyPlant = async () => {
    setLoading(true);
    if (photo) {
      const formData = new FormData();
      formData.append('images', {
        uri: photo,
        name: 'plant.jpg',
        type: 'image/jpg',
      } as unknown as Blob);

      try {
        const response = await fetch(`https://my-api.plantnet.org/v2/identify/all?lang=fr&pageSize=300&page=1&api-key=${PLANTNET}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
        console.log(formData)
        console.log(response.status)

        if (!response.ok) {
          if (response.status === 404) {
            setPlantName('Plante inconnue / Non reconnue');
          } else {
            throw new Error('Something went wrong with the plant identification');
          }
        }

        const result = await response.json();
        const bestMatch = result.results[0];
        const plantName = bestMatch?.species?.scientificNameWithoutAuthor || 'Plante inconnue / Non reconnue';
        setPlantName(plantName);

      } catch (error) {
        console.error(error);
        Alert.alert('Erreur', 'Impossible d’identifier la plante');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Photo manquante', 'Veuillez ajouter une photo en premier');
    }
  };

  const handleValidatePhoto = async () => {
    if (photo) {
      await AsyncStorage.setItem('photo', photo || '');
      await AsyncStorage.setItem('plant', plantName || '');
      navigation.navigate('Publier', { photoValid: true, plantName: plantName || '' });
    } else {
      navigation.navigate('Publier', { photoValid: false });
    }
  };

  const handleAddPhoto = async () => {
    Alert.alert(
      "Ajouter une photo",
      "Choisissez une option",
      [
        {
          text: "Prendre une photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status === 'granted') {
              let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
              if (!result.canceled) {
                const uri = result.assets[0].uri;
                setPhoto(uri);
                await AsyncStorage.setItem('photo', uri);
              }
            } else {
              alert('Permission de caméra non accordée');
            }
          }
        },
        {
          text: "Choisir dans la galerie",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setPhoto(uri);
              await AsyncStorage.setItem('photo', uri);
            }
          }
        },
        { text: "Annuler", style: "cancel" }
      ]
    );
  };

  const handleDeletePhoto = async () => {
    if (photo || plantName) {
    setPhoto(null);
    setPlantName(null);
    await AsyncStorage.removeItem('photo');
    await AsyncStorage.removeItem('plant');
    } else {
      Alert.alert('Photo manquante', 'Veuillez ajouter une photo en premier')
    }
  };

  const handlePlantPhoto = async () => {
    if (photo) {
    await identifyPlant();
    } else {
      Alert.alert('Photo manquante', 'Veuillez ajouter une photo en premier')
    }
  };

  {/*const GoPlantes = async () => {
    navigation.navigate('Plantes', { plante: '' });
  };*/}

  return (
    <View style={styles.container}>
      {!loading ? ( 
        <>
      <Text style={styles.plantName}>Plante : {plantName}</Text>
      <Pressable style={styles.button} onPress={handleAddPhoto}>
        <Text style={styles.buttonText}>Ajouter une photo</Text>
      </Pressable>
        <View>
          <Pressable style={styles.button} onPress={handlePlantPhoto}>
            <Text style={styles.buttonText}>Vérification de la plante</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleDeletePhoto}>
            <Text style={styles.buttonText}>Supprimer la photo</Text>
          </Pressable>
          {photo && <Image source={{ uri: photo }} style={styles.photo} />}
        </View>      
      <BigButtonDown buttonText="Valider" onPress={handleValidatePhoto} />
      </>
    ) : (
      <Loading />
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#668F80',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  photo: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  plantName: {
    fontSize: 18,
    marginBottom: 10,
  },
});