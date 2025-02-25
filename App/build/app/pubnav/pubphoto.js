var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import BigButtonDown from '../../components/BigButtonDown';
import Loading from '../../components/Loading';
export default function PubPhoto() {
    const navigation = useNavigation();
    const route = useRoute();
    const [photo, setPhoto] = useState(null);
    const [plantName, setPlantName] = useState(null);
    const [loading, setLoading] = useState(false);
    const PLANTNET = process.env.EXPO_PUBLIC_API_PLANTNET;
    useEffect(() => {
        (() => __awaiter(this, void 0, void 0, function* () {
            const { status } = yield ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Désolé, nous avons besoin des permissions de la caméra pour que cela fonctionne !');
            }
            const storedPhoto = yield AsyncStorage.getItem('photo');
            const storedPlant = yield AsyncStorage.getItem('plant');
            if (storedPhoto) {
                setPhoto(storedPhoto);
            }
            if (storedPlant) {
                setPlantName(storedPlant);
            }
        }))();
    }, []);
    const identifyPlant = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        setLoading(true);
        if (photo) {
            const formData = new FormData();
            formData.append('images', {
                uri: photo,
                name: 'plant.jpg',
                type: 'image/jpg',
            });
            try {
                const response = yield fetch(`https://my-api.plantnet.org/v2/identify/all?lang=fr&pageSize=300&page=1&api-key=${PLANTNET}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });
                console.log(formData);
                console.log(response.status);
                if (!response.ok) {
                    if (response.status === 404) {
                        setPlantName('Plante inconnue / Non reconnue');
                    }
                    else {
                        throw new Error('Something went wrong with the plant identification');
                    }
                }
                const result = yield response.json();
                const bestMatch = result.results[0];
                const plantName = ((_a = bestMatch === null || bestMatch === void 0 ? void 0 : bestMatch.species) === null || _a === void 0 ? void 0 : _a.scientificNameWithoutAuthor) || 'Plante inconnue / Non reconnue';
                setPlantName(plantName);
            }
            catch (error) {
                console.error(error);
                Alert.alert('Erreur', 'Impossible d’identifier la plante');
            }
            finally {
                setLoading(false);
            }
        }
        else {
            Alert.alert('Photo manquante', 'Veuillez ajouter une photo en premier');
        }
    });
    const handleValidatePhoto = () => __awaiter(this, void 0, void 0, function* () {
        if (photo) {
            yield AsyncStorage.setItem('photo', photo || '');
            yield AsyncStorage.setItem('plant', plantName || '');
            navigation.navigate('Publier', { photoValid: true, plantName: plantName || '' });
        }
        else {
            navigation.navigate('Publier', { photoValid: false });
        }
    });
    const handleAddPhoto = () => __awaiter(this, void 0, void 0, function* () {
        Alert.alert("Ajouter une photo", "Choisissez une option", [
            {
                text: "Prendre une photo",
                onPress: () => __awaiter(this, void 0, void 0, function* () {
                    const { status } = yield ImagePicker.requestCameraPermissionsAsync();
                    if (status === 'granted') {
                        let result = yield ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });
                        if (!result.canceled) {
                            const uri = result.assets[0].uri;
                            setPhoto(uri);
                            yield AsyncStorage.setItem('photo', uri);
                        }
                    }
                    else {
                        alert('Permission de caméra non accordée');
                    }
                })
            },
            {
                text: "Choisir dans la galerie",
                onPress: () => __awaiter(this, void 0, void 0, function* () {
                    let result = yield ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });
                    if (!result.canceled) {
                        const uri = result.assets[0].uri;
                        setPhoto(uri);
                        yield AsyncStorage.setItem('photo', uri);
                    }
                })
            },
            { text: "Annuler", style: "cancel" }
        ]);
    });
    const handleDeletePhoto = () => __awaiter(this, void 0, void 0, function* () {
        if (photo || plantName) {
            setPhoto(null);
            setPlantName(null);
            yield AsyncStorage.removeItem('photo');
            yield AsyncStorage.removeItem('plant');
        }
        else {
            Alert.alert('Photo manquante', 'Veuillez ajouter une photo en premier');
        }
    });
    const handlePlantPhoto = () => __awaiter(this, void 0, void 0, function* () {
        if (photo) {
            yield identifyPlant();
        }
        else {
            Alert.alert('Photo manquante', 'Veuillez ajouter une photo en premier');
        }
    });
    { /*const GoPlantes = async () => {
      navigation.navigate('Plantes', { plante: '' });
    };*/
    }
    return (<View style={styles.container}>
      {!loading ? (<>
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
          {photo && <Image source={{ uri: photo }} style={styles.photo}/>}
        </View>      
      <BigButtonDown buttonText="Valider" onPress={handleValidatePhoto}/>
      </>) : (<Loading />)}
    </View>);
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
