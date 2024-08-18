import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { NavigationContainer, useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ListDash from '../../components/ListDash';

import PubTitre from '../pubnav/pubtitre';
import PubDate from '../pubnav/pubdate';
import PubPhoto from '../pubnav/pubphoto';
import PubDesc from '../pubnav/pubdesc';
import PubLoca from '../pubnav/publoca';
import PubEspece from '../pubnav/pubespece';
import PubEntretien from '../pubnav/pubentretien';

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Publier: {
    titreValid?: boolean,
    titre: string,
    dateValid?: boolean,
    selectedStartDate: string,
    selectedEndDate: string
    descValid?: boolean,
    description: string,
    locValid?: boolean,
    localisation: string,
    cityName: string,
    espValid?: boolean,
    espece: string,
    photoValid?: boolean,
    photo: string,
    plantName: string,
    entretien: string,
    ettValid?: boolean,
  };
  Titre: { titre: '' };
  Date: { selectedStartDate: '', selectedEndDate: '' }
  Description: { description: '' };
  Localisation: { localisation: '', cityName: '' };
  Espece: { espece: '' };
  Photo: { photo: '', plantName: '' };
  Entretien: { entretien: '' };
};

type UpdatePublierNavigationProp = StackNavigationProp<RootStackParamList, 'Publier'>;
type UpdatePublierRouteProp = RouteProp<RootStackParamList, 'Publier'>;

function PublierScreen({ }) {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Publier"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#668F80',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            color: '#FFF',
            fontSize: 24,
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="Publier" component={PublierContent} />
        <Stack.Screen name="Titre" component={PubTitre}
          options={{
            headerBackTitleVisible: false
          }} />
        <Stack.Screen name="Date" component={PubDate}
          options={{
            headerBackTitleVisible: false
          }} />
        <Stack.Screen name="Photo" component={PubPhoto}
          options={{
            headerBackTitleVisible: false
          }} />
        <Stack.Screen name="Description" component={PubDesc}
          options={{
            headerBackTitleVisible: false
          }} />
        <Stack.Screen name="Localisation" component={PubLoca}
          options={{
            headerBackTitleVisible: false
          }} />
        <Stack.Screen name="Espece" component={PubEspece}
          options={{
            headerBackTitleVisible: false
          }} />
        <Stack.Screen name="Entretien" component={PubEntretien}
          options={{
            headerBackTitleVisible: false
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function PublierContent() {
  const navigation = useNavigation<UpdatePublierNavigationProp>();
  const route = useRoute<UpdatePublierRouteProp>();
  const [isValid, setIsValid] = useState(false);
  const [titre, setTitre] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [titreValid, setTitreValid] = useState(false);
  const [dateValid, setDateValid] = useState(false);
  const [descValid, setDescValid] = useState(false);
  const [locValid, setLocValid] = useState(false);
  const [localisation, setLocalisation] = useState('');
  const [cityName, setCityName] = useState('');
  const [espValid, setEspValid] = useState(false);
  const [espece, setEspece] = useState('');
  const [photoValid, setPhotoValid] = useState(false);
  const [ettValid, setEttValid] = useState(false); // Entretien optionnel
  const [entretien, setEntretien] = useState('');
  const [photo, setPhoto] = useState('');
  const [planteName, setPlante] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_IP;

  const resetPost = () => {
    Alert.alert(
      "Confirmation",
      "ATTENTION êtes vous sûre que vous voulez recommencez le post ? (toutes les informations seront remise à zéro).",
      [
        { text: "Oui", onPress: () => resetForm() },
        {
          text: "Non",
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }


  const handleSend = async () => {

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Erreur', 'Token utilisateur manquant');
        return;
      }

      const formData = new FormData();
      formData.append('title', titre);
      formData.append('description', description);
      formData.append('publishedAt', new Date().toISOString());
      formData.append('dateStart', selectedStartDate);
      formData.append('dateEnd', selectedEndDate);
      formData.append('address', localisation);
      formData.append('cityName', cityName);
      formData.append('state', JSON.stringify(false));
      formData.append('accepted', JSON.stringify(false));
      formData.append('plantOrigin', espece);
      formData.append('plantRequirements', entretien);
      formData.append('plantType', planteName);
      formData.append('images', {
        uri: photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as unknown as Blob);

      const response = await fetch(`${apiUrl}/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': userToken,
        },
        body: formData,
      });
      console.log(response)
      if (response.ok) {
        Alert.alert('Succès', 'Le post a été envoyé avec succès');
        setModalVisible(false);
        resetForm();
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du post');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du post');
    }
  };

  const resetForm = async () => {
    setTitre('');
    await AsyncStorage.removeItem('titre');
    await AsyncStorage.removeItem('titreValid');
    await AsyncStorage.removeItem('savedTitre');
    setDescription('');
    await AsyncStorage.removeItem('description');
    await AsyncStorage.removeItem('descValid');
    await AsyncStorage.removeItem('savedDescription');
    setSelectedStartDate('');
    await AsyncStorage.removeItem('selectedStartDate');
    await AsyncStorage.removeItem('dateValid');
    setSelectedEndDate('');
    await AsyncStorage.removeItem('selectedEndDate');
    setLocalisation('');
    setCityName('');
    await AsyncStorage.removeItem('localisation');
    await AsyncStorage.removeItem('cityName');
    await AsyncStorage.removeItem('locValid');
    await AsyncStorage.removeItem('savedLocalisation');
    await AsyncStorage.removeItem('savedCityName');
    setEspece('');
    await AsyncStorage.removeItem('espece');
    await AsyncStorage.removeItem('espValid');
    setEntretien('');
    await AsyncStorage.removeItem('entretien');
    setPhoto('');
    setPlante('');
    await AsyncStorage.removeItem('photo');
    await AsyncStorage.removeItem('plante');
    await AsyncStorage.removeItem('photoValid');
    setTitreValid(false);
    setDateValid(false);
    setDescValid(false);
    setLocValid(false);
    setEspValid(false);
    setPhotoValid(false);
    setEttValid(false);
    setIsValid(false);
  };

  useEffect(() => {
    const loadData = async () => {
      const storedTitre = await AsyncStorage.getItem('titre');
      const storedStartDate = await AsyncStorage.getItem('selectedStartDate');
      const storedEndDate = await AsyncStorage.getItem('selectedEndDate');
      const storedDescription = await AsyncStorage.getItem('description');
      const storedTitreValid = await AsyncStorage.getItem('titreValid');
      const storedDateValid = await AsyncStorage.getItem('dateValid');
      const storedDescValid = await AsyncStorage.getItem('descValid');
      const storedLocValid = await AsyncStorage.getItem('locValid');
      const storedLocalisation = await AsyncStorage.getItem('localisation');
      const storedCityName = await AsyncStorage.getItem('cityName');
      const storedEspValid = await AsyncStorage.getItem('espValid');
      const storedEspece = await AsyncStorage.getItem('espece');
      const storedEntretien = await AsyncStorage.getItem('entretien');
      const storedettValid = await AsyncStorage.getItem('ettValid');
      const storedphotoValid = await AsyncStorage.getItem('photoValid');
      const storedphoto = await AsyncStorage.getItem('photo');
      const storedplantName = await AsyncStorage.getItem('plante')

      console.log('Loaded Data:', {
        storedTitreValid,
        storedDateValid,
        storedDescValid,
        storedLocValid,
        storedEspValid,
        storedphotoValid,
        storedettValid
      });

      if (storedTitre) setTitre(storedTitre);
      if (storedStartDate) setSelectedStartDate(storedStartDate);
      if (storedEndDate) setSelectedEndDate(storedEndDate);
      if (storedDescription) setDescription(storedDescription);
      if (storedEspece) setEspece(storedEspece);
      if (storedLocalisation) setLocalisation(storedLocalisation);
      if (storedCityName) setCityName(storedCityName);
      if (storedTitreValid) setTitreValid(storedTitreValid === 'true');
      if (storedDateValid) setDateValid(storedDateValid === 'true');
      if (storedDescValid) setDescValid(storedDescValid === 'true');
      if (storedLocValid) setLocValid(storedLocValid === 'true');
      if (storedEspValid) setEspValid(storedEspValid === 'true');
      if (storedphotoValid) setPhotoValid(storedphotoValid === 'true');
      if (storedettValid) setEttValid(storedettValid === 'true');
      if (storedEntretien) setEntretien(storedEntretien);
      if (storedphoto) setPhoto(storedphoto);
      if (storedplantName) setPlante(storedplantName);
    };

    loadData();

    const unsubscribe = navigation.addListener('focus', () => {
      const { titreValid, dateValid, descValid, locValid, espValid, photoValid, ettValid, localisation, cityName } = route.params || {};
      console.log('Params:', { titreValid, dateValid, descValid, locValid, espValid, photoValid, ettValid, localisation, cityName });
      setIsValid(
        (titreValid !== undefined ? titreValid : false) &&
        (dateValid !== undefined ? dateValid : false) &&
        (descValid !== undefined ? descValid : false) &&
        (locValid !== undefined ? locValid : false) &&
        (espValid !== undefined ? espValid : false) &&
        (photoValid !== undefined ? photoValid : false)
      );
      if (localisation) setLocalisation(localisation);
      if (cityName) setCityName(cityName);
    });

    return unsubscribe;
  }, [navigation, route.params]);

  useEffect(() => {
    if (route.params?.titre) {
      setTitre(route.params.titre);
      AsyncStorage.setItem('titre', route.params.titre);
    }
    if (route.params?.selectedStartDate) {
      setSelectedStartDate(route.params.selectedStartDate);
      AsyncStorage.setItem('selectedStartDate', route.params.selectedStartDate);
    }
    if (route.params?.selectedEndDate) {
      setSelectedEndDate(route.params.selectedEndDate);
      AsyncStorage.setItem('selectedEndDate', route.params.selectedEndDate);
    }
    if (route.params?.description) {
      setDescription(route.params.description);
      AsyncStorage.setItem('description', route.params.description);
    }
    if (route.params?.localisation) {
      setLocalisation(route.params.localisation);
      AsyncStorage.setItem('localisation', route.params.localisation);
    }
    if (route.params?.cityName) {
      setCityName(route.params.cityName);
      AsyncStorage.setItem('cityName', route.params.cityName);
    }
    if (route.params?.espece) {
      setEspece(route.params.espece);
      AsyncStorage.setItem('espece', route.params.espece);
    }
    if (route.params?.entretien) {
      setPlante(route.params.entretien);
      AsyncStorage.setItem('entretien', route.params.entretien);
    }
    if (route.params?.photo) {
      setPhoto(route.params.photo);
      AsyncStorage.setItem('photo', route.params.photo);
    }
    if (route.params?.plantName) {
      setPlante(route.params.plantName);
      AsyncStorage.setItem('plant', route.params.plantName);
    }
    if (route.params?.titreValid !== undefined) {
      setTitreValid(route.params.titreValid);
      AsyncStorage.setItem('titreValid', route.params.titreValid.toString());
      if (!route.params.titreValid) {
        setTitre('');
        AsyncStorage.removeItem('titre');
      }
    }
    if (route.params?.dateValid !== undefined) {
      setDateValid(route.params.dateValid);
      AsyncStorage.setItem('dateValid', route.params.dateValid.toString());
      if (!route.params.dateValid) {
        setSelectedStartDate('');
        setSelectedEndDate('');
        AsyncStorage.removeItem('selectedStartDate');
        AsyncStorage.removeItem('selectedEndDate');
      }
    }
    if (route.params?.descValid !== undefined) {
      setDescValid(route.params.descValid);
      AsyncStorage.setItem('descValid', route.params.descValid.toString());
      if (!route.params.descValid) {
        setDescription('');
        AsyncStorage.removeItem('description');
      }
    }
    if (route.params?.locValid !== undefined) {
      setLocValid(route.params.locValid);
      AsyncStorage.setItem('locValid', route.params.locValid.toString());
      if (!route.params.locValid) {
        setLocalisation('');
        setCityName('');
        AsyncStorage.removeItem('localisation');
        AsyncStorage.removeItem('cityName');
      }
    }
    if (route.params?.espValid !== undefined) {
      setEspValid(route.params.espValid);
      AsyncStorage.setItem('espValid', route.params.espValid.toString());
      if (!route.params.espValid) {
        setEspece('');
        AsyncStorage.removeItem('espece');
      }
    }
    if (route.params?.photoValid !== undefined) {
      setPhotoValid(route.params.photoValid);
      AsyncStorage.setItem('photoValid', route.params.photoValid.toString());
      if (!route.params.photoValid) {
        setPhoto('');
        AsyncStorage.removeItem('photo');
      }
    }
    if (route.params?.ettValid !== undefined) {
      setPhotoValid(route.params.ettValid);
      AsyncStorage.setItem('ettValid', route.params.ettValid.toString());
      if (!route.params.ettValid) {
        setEntretien('');
        AsyncStorage.removeItem('entretien');
      }
    }
    if (route.params?.photoValid !== undefined) {
      setPhotoValid(route.params.photoValid);
      AsyncStorage.setItem('photoValid', route.params.photoValid.toString());
      if (!route.params.photoValid) {
        setPlante('');
        AsyncStorage.removeItem('plant');
      }
    }
  }, [route.params]);

  useEffect(() => {
    const params = route.params || {};

    if (params.titreValid !== undefined) setTitreValid(params.titreValid);
    if (params.dateValid !== undefined) setDateValid(params.dateValid);
    if (params.descValid !== undefined) setDescValid(params.descValid);
    if (params.locValid !== undefined) setLocValid(params.locValid);
    if (params.espValid !== undefined) setEspValid(params.espValid);
    if (params.photoValid !== undefined) setPhotoValid(params.photoValid);
    if (params.ettValid !== undefined) setEttValid(params.ettValid);
  }, [route.params]);

  useEffect(() => {
    setIsValid(titreValid && dateValid && descValid && locValid && espValid && photoValid);
  }, [titreValid, dateValid, descValid, locValid, espValid, photoValid]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedDetails}>
        <ListDash buttonText={`Titre : ${titre}`} onPress={() => navigation.navigate('Titre', { titre: "" })} />
        <Ionicons name={titreValid ? 'checkmark-circle' : 'close-circle'} size={24} color={titreValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Date(s) : ${selectedStartDate ? formatDate(selectedStartDate) : ''} - ${selectedEndDate ? formatDate(selectedEndDate) : ''}`} onPress={() => navigation.navigate('Date', { selectedStartDate: "", selectedEndDate: "" })} />
        <Ionicons name={dateValid ? 'checkmark-circle' : 'close-circle'} size={24} color={dateValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Photo : ${photo ? '{...},' : ''} ${planteName}`} onPress={() => navigation.navigate('Photo', { photo: "", plantName: '' })} />
        <Ionicons name={photoValid ? 'checkmark-circle' : 'close-circle'} size={24} color={photoValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Description : ${description ? '{...}' : ''}`} onPress={() => navigation.navigate('Description', { description: "" })} />
        <Ionicons name={descValid ? 'checkmark-circle' : 'close-circle'} size={24} color={descValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Localisation : ${localisation ? '{...} ,' : ''} ${cityName}`} onPress={() => navigation.navigate('Localisation', { localisation: "", cityName: "" })} />
        <Ionicons name={locValid ? 'checkmark-circle' : 'close-circle'} size={24} color={locValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`Espèce : ${espece}`} onPress={() => navigation.navigate('Espece', { espece: "" })} />
        <Ionicons name={espValid ? 'checkmark-circle' : 'close-circle'} size={24} color={espValid ? "#668F80" : "#ff2b24"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
        <ListDash buttonText={`${entretien ? 'Exigence d’entretien : {...}' : 'Exigence d’entretien (optionel)'}`} onPress={() => navigation.navigate('Entretien', { entretien: "" })} />
        <Ionicons name={ettValid ? 'checkmark-circle' : 'close-circle'} size={24} color={ettValid ? "#668F80" : "#828282"} style={styles.iconValid} />
        <View style={styles.separatorDetails} />
      </View>
      <View style={styles.fixedDetailsBtn}>
        <TouchableOpacity onPress={() => resetPost()} style={styles.clearButtonContainer}>
          <Text style={styles.clearButton}>Recommencez</Text>
        </TouchableOpacity>
        <View style={styles.selectorContainer}>
          <TouchableOpacity style={[styles.selectorButton, { backgroundColor: isValid ? '#668F80' : '#828282' }]} disabled={!isValid} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
              Valider
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalViewBg}>
            <Text style={styles.modalTitre}>Confirmation</Text>
            <Text style={styles.modalText}>Vérifiez attentivement les informations que vous envoyez. La saisie de fausses informations peut entraîner des conséquences indésirables.</Text>
            <View style={styles.fixedDetailsBtnModal}>
              <View style={styles.selectorContainer}>
                <TouchableOpacity style={[styles.selectorButton, { backgroundColor: '#668F80' }]} onPress={() => handleSend()}>
                  <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
                    Envoyer
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.selectorContainer}>
                <TouchableOpacity style={[styles.selectorButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#668F80' }]} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#668F80', fontSize: 14, fontWeight: 'bold' }}>
                    Modifier
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: 100,
    backgroundColor: '#668F80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    alignItems: 'center',
  },
  fixedDetails: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  scrollViewContent: {
    paddingTop: 20,
  },
  body: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  separatorDetails: {
    height: 1,
    backgroundColor: '#E8E8E8',
    width: '95%',
    marginVertical: 5,
    alignSelf: 'center',
  },
  selectorOptions: {
    padding: 10,
    color: '#BDBDBD',
  },
  selectorOptionsText: {
    fontSize: 14,
  },
  fixedDetailsBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    overflow: 'hidden',
    width: '90%',
    alignItems: 'center',
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconValid: {
    paddingHorizontal: 10,
  },
  modalView: {
    backgroundColor: '#668F80',
    padding: 35,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  modalViewBg: {
    backgroundColor: '#fff',
    padding: 35,
    borderRadius: 10,
    justifyContent: 'center',
  },
  fixedDetailsBtnModal: {
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: 15,
  },
  modalTitre: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 14,
    textAlign: 'center',
  },
  clearButtonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  clearButton: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});

export default PublierScreen;