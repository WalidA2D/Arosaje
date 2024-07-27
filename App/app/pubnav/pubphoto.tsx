import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import BigButtonDown from '../../components/BigButtonDown';

type RootStackParamList = {
  Photo: { photo: '' };
  Publier: { photoValid?: boolean };
};

type UpdatePhotoNavigationProp = StackNavigationProp<RootStackParamList, 'Photo'>;
type UpdatePhotoRouteProp = RouteProp<RootStackParamList, 'Photo'>;

export default function PubPhoto() {
  const navigation = useNavigation<UpdatePhotoNavigationProp>();
  const route = useRoute<UpdatePhotoRouteProp>();
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Désolé, nous avons besoin des permissions de la caméra pour que cela fonctionne !');
      }
      const storedPhoto = await AsyncStorage.getItem('photo');
      if (storedPhoto) {
        setPhoto(storedPhoto);
      }
    })();
  }, []);

  const handleValidatePhoto = async () => {
    if (photo) {
      await AsyncStorage.setItem('photo', photo);
      navigation.navigate('Publier', { photoValid: true });
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
    setPhoto(null);
    await AsyncStorage.removeItem('photo');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleAddPhoto}>
        <Text style={styles.buttonText}>Ajouter une photo</Text>
      </TouchableOpacity>
      {photo && (
        <View>
          <TouchableOpacity style={styles.button} onPress={handleDeletePhoto}>
            <Text style={styles.buttonText}>Supprimer la photo</Text>
          </TouchableOpacity>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
      )}
      <BigButtonDown buttonText="Valider" onPress={handleValidatePhoto} />
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
});