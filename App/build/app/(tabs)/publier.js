var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, Alert } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
function PublierScreen({}) {
    return (<NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Publier" screenOptions={{
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
        <Stack.Screen name="Publier" component={PublierContent}/>
        <Stack.Screen name="Titre" component={PubTitre} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Date" component={PubDate} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Photo" component={PubPhoto} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Description" component={PubDesc} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Localisation" component={PubLoca} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Espece" component={PubEspece} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Entretien" component={PubEntretien} options={{
            headerBackTitleVisible: false
        }}/>
      </Stack.Navigator>
    </NavigationContainer>);
}
function PublierContent() {
    const navigation = useNavigation();
    const route = useRoute();
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
    const [isSending, setIsSending] = useState(false); // Ajout d'un état pour gérer l'envoi
    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    const resetPost = () => {
        Alert.alert("Confirmation", "ATTENTION êtes vous sûre que vous voulez recommencez le post ? (toutes les informations seront remise à zéro).", [
            { text: "Oui", onPress: () => resetForm() },
            {
                text: "Non",
                style: "cancel"
            }
        ], { cancelable: false });
    };
    const handleSend = () => __awaiter(this, void 0, void 0, function* () {
        if (isSending)
            return; // Empêche l'envoi si déjà en cours
        setIsSending(true); // Définit l'état à vrai pour indiquer que l'envoi est en cours
        try {
            const userToken = yield AsyncStorage.getItem('userToken');
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
            const postalCode = extractPostalCode(cityName);
            if (postalCode) {
                formData.append('postalCode', postalCode);
            }
            else {
                console.error('Code postal non trouvé dans la localisation');
            }
            formData.append('state', JSON.stringify(false));
            formData.append('plant', planteName);
            formData.append('images', {
                uri: photo,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });
            const response = yield fetch(`${apiUrl}/post/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': userToken,
                },
                body: formData,
            });
            console.log(response);
            if (response.ok) {
                Alert.alert('Succès', 'Le post a été envoyé avec succès');
                setModalVisible(false);
                resetForm();
            }
            else {
                Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du post');
            }
        }
        catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi du post');
        }
        finally {
            setIsSending(false); // Réinitialise l'état après l'envoi
        }
    });
    const resetForm = () => __awaiter(this, void 0, void 0, function* () {
        setTitre('');
        yield AsyncStorage.removeItem('titre');
        yield AsyncStorage.removeItem('titreValid');
        yield AsyncStorage.removeItem('savedTitre');
        setDescription('');
        yield AsyncStorage.removeItem('description');
        yield AsyncStorage.removeItem('descValid');
        yield AsyncStorage.removeItem('savedDescription');
        setSelectedStartDate('');
        yield AsyncStorage.removeItem('selectedStartDate');
        yield AsyncStorage.removeItem('dateValid');
        setSelectedEndDate('');
        yield AsyncStorage.removeItem('selectedEndDate');
        setLocalisation('');
        setCityName('');
        yield AsyncStorage.removeItem('localisation');
        yield AsyncStorage.removeItem('cityName');
        yield AsyncStorage.removeItem('locValid');
        yield AsyncStorage.removeItem('savedLocalisation');
        yield AsyncStorage.removeItem('savedCityName');
        setEspece('');
        yield AsyncStorage.removeItem('espece');
        yield AsyncStorage.removeItem('espValid');
        setEntretien('');
        yield AsyncStorage.removeItem('entretien');
        setPhoto('');
        setPlante('');
        yield AsyncStorage.removeItem('photo');
        yield AsyncStorage.removeItem('plante');
        yield AsyncStorage.removeItem('photoValid');
        setTitreValid(false);
        setDateValid(false);
        setDescValid(false);
        setLocValid(false);
        setEspValid(false);
        setPhotoValid(false);
        setEttValid(false);
        setIsValid(false);
    });
    const extractPostalCode = (address) => {
        const regex = /\b\d{5}\b/;
        const match = address.match(regex);
        return match ? match[0] : "";
    };
    useEffect(() => {
        const loadData = () => __awaiter(this, void 0, void 0, function* () {
            const storedTitre = yield AsyncStorage.getItem('titre');
            const storedStartDate = yield AsyncStorage.getItem('selectedStartDate');
            const storedEndDate = yield AsyncStorage.getItem('selectedEndDate');
            const storedDescription = yield AsyncStorage.getItem('description');
            const storedTitreValid = yield AsyncStorage.getItem('titreValid');
            const storedDateValid = yield AsyncStorage.getItem('dateValid');
            const storedDescValid = yield AsyncStorage.getItem('descValid');
            const storedLocValid = yield AsyncStorage.getItem('locValid');
            const storedLocalisation = yield AsyncStorage.getItem('localisation');
            const storedCityName = yield AsyncStorage.getItem('cityName');
            const storedEspValid = yield AsyncStorage.getItem('espValid');
            const storedEspece = yield AsyncStorage.getItem('espece');
            const storedEntretien = yield AsyncStorage.getItem('entretien');
            const storedettValid = yield AsyncStorage.getItem('ettValid');
            const storedphotoValid = yield AsyncStorage.getItem('photoValid');
            const storedphoto = yield AsyncStorage.getItem('photo');
            const storedplantName = yield AsyncStorage.getItem('plante');
            console.log('Loaded Data:', {
                storedTitreValid,
                storedDateValid,
                storedDescValid,
                storedLocValid,
                storedEspValid,
                storedphotoValid,
                storedettValid
            });
            if (storedTitre)
                setTitre(storedTitre);
            if (storedStartDate)
                setSelectedStartDate(storedStartDate);
            if (storedEndDate)
                setSelectedEndDate(storedEndDate);
            if (storedDescription)
                setDescription(storedDescription);
            if (storedEspece)
                setEspece(storedEspece);
            if (storedLocalisation)
                setLocalisation(storedLocalisation);
            if (storedCityName)
                setCityName(storedCityName);
            if (storedTitreValid)
                setTitreValid(storedTitreValid === 'true');
            if (storedDateValid)
                setDateValid(storedDateValid === 'true');
            if (storedDescValid)
                setDescValid(storedDescValid === 'true');
            if (storedLocValid)
                setLocValid(storedLocValid === 'true');
            if (storedEspValid)
                setEspValid(storedEspValid === 'true');
            if (storedphotoValid)
                setPhotoValid(storedphotoValid === 'true');
            if (storedettValid)
                setEttValid(storedettValid === 'true');
            if (storedEntretien)
                setEntretien(storedEntretien);
            if (storedphoto)
                setPhoto(storedphoto);
            if (storedplantName)
                setPlante(storedplantName);
        });
        loadData();
        const unsubscribe = navigation.addListener('focus', () => {
            const { titreValid, dateValid, descValid, locValid, espValid, photoValid, ettValid, localisation, cityName } = route.params || {};
            setIsValid((titreValid !== undefined ? titreValid : false) &&
                (dateValid !== undefined ? dateValid : false) &&
                (descValid !== undefined ? descValid : false) &&
                (locValid !== undefined ? locValid : false) &&
                (espValid !== undefined ? espValid : false) &&
                (photoValid !== undefined ? photoValid : false));
            if (localisation)
                setLocalisation(localisation);
            if (cityName)
                setCityName(cityName);
        });
        return unsubscribe;
    }, [navigation, route.params]);
    useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        if ((_a = route.params) === null || _a === void 0 ? void 0 : _a.titre) {
            setTitre(route.params.titre);
            AsyncStorage.setItem('titre', route.params.titre);
        }
        if ((_b = route.params) === null || _b === void 0 ? void 0 : _b.selectedStartDate) {
            setSelectedStartDate(route.params.selectedStartDate);
            AsyncStorage.setItem('selectedStartDate', route.params.selectedStartDate);
        }
        if ((_c = route.params) === null || _c === void 0 ? void 0 : _c.selectedEndDate) {
            setSelectedEndDate(route.params.selectedEndDate);
            AsyncStorage.setItem('selectedEndDate', route.params.selectedEndDate);
        }
        if ((_d = route.params) === null || _d === void 0 ? void 0 : _d.description) {
            setDescription(route.params.description);
            AsyncStorage.setItem('description', route.params.description);
        }
        if ((_e = route.params) === null || _e === void 0 ? void 0 : _e.localisation) {
            setLocalisation(route.params.localisation);
            AsyncStorage.setItem('localisation', route.params.localisation);
        }
        if ((_f = route.params) === null || _f === void 0 ? void 0 : _f.cityName) {
            setCityName(route.params.cityName);
            AsyncStorage.setItem('cityName', route.params.cityName);
        }
        if ((_g = route.params) === null || _g === void 0 ? void 0 : _g.espece) {
            setEspece(route.params.espece);
            AsyncStorage.setItem('espece', route.params.espece);
        }
        if ((_h = route.params) === null || _h === void 0 ? void 0 : _h.entretien) {
            setPlante(route.params.entretien);
            AsyncStorage.setItem('entretien', route.params.entretien);
        }
        if ((_j = route.params) === null || _j === void 0 ? void 0 : _j.photo) {
            setPhoto(route.params.photo);
            AsyncStorage.setItem('photo', route.params.photo);
        }
        if ((_k = route.params) === null || _k === void 0 ? void 0 : _k.plantName) {
            setPlante(route.params.plantName);
            AsyncStorage.setItem('plant', route.params.plantName);
        }
        if (((_l = route.params) === null || _l === void 0 ? void 0 : _l.titreValid) !== undefined) {
            setTitreValid(route.params.titreValid);
            AsyncStorage.setItem('titreValid', route.params.titreValid.toString());
            if (!route.params.titreValid) {
                setTitre('');
                AsyncStorage.removeItem('titre');
            }
        }
        if (((_m = route.params) === null || _m === void 0 ? void 0 : _m.dateValid) !== undefined) {
            setDateValid(route.params.dateValid);
            AsyncStorage.setItem('dateValid', route.params.dateValid.toString());
            if (!route.params.dateValid) {
                setSelectedStartDate('');
                setSelectedEndDate('');
                AsyncStorage.removeItem('selectedStartDate');
                AsyncStorage.removeItem('selectedEndDate');
            }
        }
        if (((_o = route.params) === null || _o === void 0 ? void 0 : _o.descValid) !== undefined) {
            setDescValid(route.params.descValid);
            AsyncStorage.setItem('descValid', route.params.descValid.toString());
            if (!route.params.descValid) {
                setDescription('');
                AsyncStorage.removeItem('description');
            }
        }
        if (((_p = route.params) === null || _p === void 0 ? void 0 : _p.locValid) !== undefined) {
            setLocValid(route.params.locValid);
            AsyncStorage.setItem('locValid', route.params.locValid.toString());
            if (!route.params.locValid) {
                setLocalisation('');
                setCityName('');
                AsyncStorage.removeItem('localisation');
                AsyncStorage.removeItem('cityName');
            }
        }
        if (((_q = route.params) === null || _q === void 0 ? void 0 : _q.espValid) !== undefined) {
            setEspValid(route.params.espValid);
            AsyncStorage.setItem('espValid', route.params.espValid.toString());
            if (!route.params.espValid) {
                setEspece('');
                AsyncStorage.removeItem('espece');
            }
        }
        if (((_r = route.params) === null || _r === void 0 ? void 0 : _r.photoValid) !== undefined) {
            setPhotoValid(route.params.photoValid);
            AsyncStorage.setItem('photoValid', route.params.photoValid.toString());
            if (!route.params.photoValid) {
                setPhoto('');
                AsyncStorage.removeItem('photo');
            }
        }
        if (((_s = route.params) === null || _s === void 0 ? void 0 : _s.ettValid) !== undefined) {
            setPhotoValid(route.params.ettValid);
            AsyncStorage.setItem('ettValid', route.params.ettValid.toString());
            if (!route.params.ettValid) {
                setEntretien('');
                AsyncStorage.removeItem('entretien');
            }
        }
        if (((_t = route.params) === null || _t === void 0 ? void 0 : _t.photoValid) !== undefined) {
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
        if (params.titreValid !== undefined)
            setTitreValid(params.titreValid);
        if (params.dateValid !== undefined)
            setDateValid(params.dateValid);
        if (params.descValid !== undefined)
            setDescValid(params.descValid);
        if (params.locValid !== undefined)
            setLocValid(params.locValid);
        if (params.espValid !== undefined)
            setEspValid(params.espValid);
        if (params.photoValid !== undefined)
            setPhotoValid(params.photoValid);
        if (params.ettValid !== undefined)
            setEttValid(params.ettValid);
    }, [route.params]);
    useEffect(() => {
        setIsValid(titreValid && dateValid && descValid && locValid && espValid && photoValid);
    }, [titreValid, dateValid, descValid, locValid, espValid, photoValid]);
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    return (<View style={styles.container}>
      <View style={styles.fixedDetails}>
        <ListDash buttonText={`Titre : ${titre}`} onPress={() => navigation.navigate('Titre', { titre: "" })}/>
        <Ionicons name={titreValid ? 'checkmark-circle' : 'close-circle'} size={24} color={titreValid ? "#668F80" : "#ff2b24"} style={styles.iconValid}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText={`Date(s) : ${selectedStartDate ? formatDate(selectedStartDate) : ''} - ${selectedEndDate ? formatDate(selectedEndDate) : ''}`} onPress={() => navigation.navigate('Date', { selectedStartDate: "", selectedEndDate: "" })}/>
        <Ionicons name={dateValid ? 'checkmark-circle' : 'close-circle'} size={24} color={dateValid ? "#668F80" : "#ff2b24"} style={styles.iconValid}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText={`Photo : ${photo ? '{...},' : ''} ${planteName}`} onPress={() => navigation.navigate('Photo', { photo: "", plantName: '' })}/>
        <Ionicons name={photoValid ? 'checkmark-circle' : 'close-circle'} size={24} color={photoValid ? "#668F80" : "#ff2b24"} style={styles.iconValid}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText={`Description : ${description ? '{...}' : ''}`} onPress={() => navigation.navigate('Description', { description: "" })}/>
        <Ionicons name={descValid ? 'checkmark-circle' : 'close-circle'} size={24} color={descValid ? "#668F80" : "#ff2b24"} style={styles.iconValid}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText={`Localisation : ${localisation ? '{...} ,' : ''} ${cityName}`} onPress={() => navigation.navigate('Localisation', { localisation: "", cityName: "" })}/>
        <Ionicons name={locValid ? 'checkmark-circle' : 'close-circle'} size={24} color={locValid ? "#668F80" : "#ff2b24"} style={styles.iconValid}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText={`Espèce : ${espece}`} onPress={() => navigation.navigate('Espece', { espece: "" })}/>
        <Ionicons name={espValid ? 'checkmark-circle' : 'close-circle'} size={24} color={espValid ? "#668F80" : "#ff2b24"} style={styles.iconValid}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText={`${entretien ? 'Exigence d’entretien : {...}' : 'Exigence d’entretien (optionel)'}`} onPress={() => navigation.navigate('Entretien', { entretien: "" })}/>
        <Ionicons name={ettValid ? 'checkmark-circle' : 'close-circle'} size={24} color={ettValid ? "#668F80" : "#828282"} style={styles.iconValid}/>
        <View style={styles.separatorDetails}/>
      </View>
      <View style={styles.fixedDetailsBtn}>
        <Pressable onPress={() => resetPost()} style={styles.clearButtonContainer}>
          <Text style={styles.clearButton}>Recommencez</Text>
        </Pressable>
        <View style={styles.selectorContainer}>
          <Pressable style={[styles.selectorButton, { backgroundColor: isValid ? '#668F80' : '#828282' }]} disabled={!isValid} onPress={() => setModalVisible(true)}>
            <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
              Valider
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal animationType="slide" visible={modalVisible} onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <View style={styles.modalViewBg}>
            <Text style={styles.modalTitre}>Confirmation</Text>
            <Text style={styles.modalText}>Vérifiez attentivement les informations que vous envoyez. La saisie de fausses informations peut entraîner des conséquences indésirables.</Text>
            <View style={styles.fixedDetailsBtnModal}>
              <View style={styles.selectorContainer}>
                <Pressable style={[styles.selectorButton, { backgroundColor: '#668F80' }]} onPress={() => handleSend()} disabled={isSending}>
                  <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
                    {isSending ? 'Envoi...' : 'Envoyer'}
                  </Text>
                </Pressable>
              </View>
              <View style={styles.selectorContainer}>
                <Pressable style={[styles.selectorButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#668F80' }]} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#668F80', fontSize: 14, fontWeight: 'bold' }}>
                    Modifier
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>);
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
