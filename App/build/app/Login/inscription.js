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
import { StyleSheet, View, TextInput, Text, Alert, Pressable, FlatList, Modal } from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';
import * as Location from 'expo-location';
import { CheckBox } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Load from '../../components/Loading';
import DonneesPersonnelles from '../optnav/donnees';
import axios from 'axios';
import { debounce } from 'lodash';
import emailjs from '@emailjs/browser';
const SERVICE_ID = 'service_a31jq0g';
const TEMPLATE_ID = 'template_wc6me4u';
const PUBLIC_KEY = 'VGiQ5GzTLtnDUMYhn';
export default function InscriptionScreen({ setIsModalVisible }) {
    const [step, setStep] = useState(1);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cityName, setCityName] = useState('');
    const [addressValid, setAddressValid] = useState(true);
    const [cityValid, setCityValid] = useState(true);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isConsentChecked, setIsConsentChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postalCode, setPostalCode] = useState('');
    const [postalCodeValid, setPostalCodeValid] = useState(true);
    const [isDonneesVisible, setIsDonneesVisible] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^\d{10}$/;
    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    useEffect(() => {
        // Initialisation d'EmailJS avec les options recommandées
        emailjs.init({
            publicKey: PUBLIC_KEY,
            limitRate: {
                // Permettre 1 requête toutes les 3 secondes
                throttle: 3000,
            }
        });
    }, []);
    const handleNext = () => {
        if (step === 1 && lastName && firstName && email) {
            if (!emailRegex.test(email)) {
                Alert.alert('Erreur', 'Veuillez saisir une adresse e-mail valide.');
            }
            else {
                setStep(2);
            }
        }
        else if (step === 2 && password && confirmPassword && password === confirmPassword && passwordRegex.test(password)) {
            setStep(3);
        }
        else if (step === 3 && phone && phoneRegex.test(phone)) {
            setStep(4);
        }
        else if (step === 4 && address && cityName && postalCode && addressValid && cityValid && postalCodeValid) {
            setStep(5);
        }
    };
    const handleConfirm = () => __awaiter(this, void 0, void 0, function* () {
        if (step === 5 && isConsentChecked) {
            const userData = {
                lastName,
                firstName,
                email,
                address,
                postalCode,
                phone,
                cityName,
                password
            };
            try {
                const response = yield fetch(`${apiUrl}/user/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                const data = yield response.json();
                if (data.success) {
                    const emailData = {
                        service_id: SERVICE_ID,
                        template_id: TEMPLATE_ID,
                        user_id: PUBLIC_KEY,
                        template_params: {
                            from_name: "Arosa-je",
                            to_name: firstName,
                            to_mail: email,
                            reply_to: "no-reply@arosa-je.com",
                            message: 'Bienvenue sur Arosa-je ! Votre compte a été créé avec succès.'
                        },
                        accessToken: PUBLIC_KEY
                    };
                    try {
                        setIsLoading(true);
                        const emailResponse = yield fetch('https://api.emailjs.com/api/v1.0/email/send', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'origin': 'http://localhost',
                            },
                            body: JSON.stringify(emailData)
                        });
                        if (emailResponse.ok) {
                            console.log('Email envoyé avec succès, status:', emailResponse.status);
                            console.log('Email envoyé à:', email);
                            Alert.alert("Bienvenue", "Inscription réussie ! Un email de confirmation vous a été envoyé. Veuillez vérifier votre dossier spam si vous ne le recevez pas dans les prochaines minutes.");
                            setIsModalVisible(false, 'inscription');
                        }
                        else {
                            const errorData = yield emailResponse.text();
                            console.error('Réponse détaillée du serveur EmailJS:', errorData);
                            throw new Error(`Erreur lors de l'envoi de l'email: ${errorData}`);
                        }
                    }
                    catch (emailError) {
                        console.error('Détails complets de l\'erreur EmailJS:', emailError);
                        Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi de l'email.");
                    }
                    finally {
                        setIsLoading(false);
                    }
                }
                else {
                    Alert.alert("Échec", data.msg || "L'inscription a échoué. Veuillez réessayer.");
                }
            }
            catch (error) {
                console.error('Erreur lors de l\'inscription:', error);
                Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription.");
            }
        }
        else {
            Alert.alert("Échec", "Veuillez accepter les termes et conditions.");
        }
    });
    const handleAutoLocation = () => __awaiter(this, void 0, void 0, function* () {
        setIsLoading(true);
        let { status } = yield Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            setIsLoading(false);
            return;
        }
        let location = yield Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        let address = yield Location.reverseGeocodeAsync({ latitude, longitude });
        if (address.length > 0) {
            const { street, city, region, postalCode } = address[0];
            const fullAddress = `${street}, ${city}, ${postalCode}, ${region}`;
            const parts = fullAddress.split(', ');
            let addressPart = parts[0];
            let cityPart = parts[1];
            let codePostal = '';
            // Cherche le code postal (partie qui commence par un chiffre)
            const postalCodePart = parts.find(part => /^\d{5}/.test(part));
            if (postalCodePart) {
                codePostal = postalCodePart;
                // Si l'adresse commence par un numéro, prend les deux premières parties
                if (/^\d/.test(parts[0])) {
                    addressPart = `${parts[0]} ${parts[1]}`;
                    // Trouve la ville (partie juste avant le code postal)
                    const postalIndex = parts.indexOf(postalCodePart);
                    cityPart = parts[postalIndex - 1];
                }
                else {
                    // Sinon prend juste la première partie comme adresse
                    addressPart = parts[0];
                    // Trouve la ville (partie juste avant le code postal)
                    const postalIndex = parts.indexOf(postalCodePart);
                    cityPart = parts[postalIndex - 1];
                }
            }
            setAddress(addressPart);
            setCityName(cityPart);
            setPostalCode(codePostal);
            setAddressValid(true);
            setCityValid(true);
            setPostalCodeValid(true);
        }
        setIsLoading(false);
    });
    const debouncedFetchSuggestions = debounce((input, type) => __awaiter(this, void 0, void 0, function* () {
        if (input.length < 3)
            return;
        const response = yield axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&countrycodes=fr`);
        const data = response.data.map((item) => ({
            place_id: item.place_id,
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon
        }));
        if (type === 'address') {
            setAddressSuggestions(data);
        }
        else {
            setCitySuggestions(data);
        }
    }), 500);
    const validateCity = () => __awaiter(this, void 0, void 0, function* () {
        if (!cityName)
            return;
        const response = yield fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}&addressdetails=1&countrycodes=fr`);
        const data = yield response.json();
        setCityValid(data.length > 0);
        setCitySuggestions(data); // Mettre à jour les suggestions de ville
    });
    const validateAddress = () => __awaiter(this, void 0, void 0, function* () {
        if (!address || !cityName)
            return;
        const response = yield fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address},${cityName}&addressdetails=1&countrycodes=fr`);
        const data = yield response.json();
        setAddressValid(data.length > 0);
        setAddressSuggestions(data); // Mettre à jour les suggestions d'adresse
    });
    const renderSuggestion = ({ item }) => (<Pressable style={styles.suggestion} onPress={() => {
            const parts = item.display_name.split(', ');
            let addressPart = parts[0];
            let cityPart = parts[1];
            let codePostal = '';
            // Cherche le code postal (partie qui commence par 5 chiffres)
            const postalCodePart = parts.find(part => /^\d{5}/.test(part));
            if (postalCodePart) {
                codePostal = postalCodePart;
                // Si l'adresse commence par un numéro, prend les deux premières parties
                if (/^\d/.test(parts[0])) {
                    addressPart = `${parts[0]} ${parts[1]}`;
                    // Trouve la ville (partie juste avant le code postal)
                    const postalIndex = parts.indexOf(postalCodePart);
                    cityPart = parts[postalIndex - 1];
                }
                else {
                    // Sinon prend juste la première partie comme adresse
                    addressPart = parts[0];
                    // Trouve la ville (partie juste avant le code postal)
                    const postalIndex = parts.indexOf(postalCodePart);
                    cityPart = parts[postalIndex - 1];
                }
            }
            setAddress(addressPart);
            setCityName(cityPart);
            setPostalCode(codePostal);
            setAddressSuggestions([]);
            setCitySuggestions([]);
        }}>
            <Text>{item.display_name}</Text>
        </Pressable>);
    return (<View style={styles.container}>
            <View style={styles.header}>
                <HeaderTitle title='Inscription'/>
            </View>
            {step === 1 && (<>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Nom:</Text>
                        <TextInput placeholder="Nom" value={lastName} onChangeText={setLastName} style={styles.input}/>
                        <Text style={styles.textSizeInput}>Prénom:</Text>
                        <TextInput placeholder="Prénom" value={firstName} onChangeText={setFirstName} style={styles.input}/>
                        <Text style={styles.textSizeInput}>Email:</Text>
                        <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" onBlur={() => {
                if (email && !emailRegex.test(email)) {
                    Alert.alert('Erreur', 'Veuillez saisir une adresse e-mail valide.');
                }
            }} placeholder="Email"/>
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleNext}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>)}
            {step === 2 && (<>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Mot de passe:</Text>
                        <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} autoCapitalize='words' secureTextEntry={true} style={styles.input}/>
                        <Text style={styles.textSizeInput}>Confirmation du Mot de passe:</Text>
                        <TextInput placeholder="Confirmation du mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} style={styles.input}/>
                        <Text style={[styles.textInput, { color: 'red', textAlign: 'center' }]}>Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (@$!%*?&).</Text>
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleNext}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>)}
            {step === 3 && (<>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Téléphone:</Text>
                        <TextInput placeholder="Téléphone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" onBlur={() => {
                if (phone.length === 0) {
                    setPhone('');
                }
            }} returnKeyType="done"/>
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={() => {
                if (!phoneRegex.test(phone)) {
                    Alert.alert("Erreur", "Veuillez entrer un numéro de téléphone valide (10 chiffres)");
                }
                else {
                    handleNext();
                }
            }}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>)}
            {step === 4 && (<>
                    <View style={styles.textInput}>
                    <Text style={styles.textSizeInput}>Addresse:</Text>
                        <TextInput placeholder="Addresse" value={address} onChangeText={(text) => {
                setAddress(text);
                debouncedFetchSuggestions(text, 'address');
            }} style={[styles.input, !addressValid && styles.invalidInput]} onBlur={validateAddress} editable={true}/>
                        <FlatList data={addressSuggestions} keyExtractor={(item) => item.place_id} renderItem={renderSuggestion} style={styles.suggestionList}/>
                        <Text style={styles.textSizeInput}>Ville:</Text>
                        <TextInput placeholder="Ville" value={`${cityName} ${postalCode}`} onChangeText={(text) => {
                setCityName(text);
                debouncedFetchSuggestions(text, 'city');
            }} style={[styles.input, !cityValid && styles.invalidInput]} onBlur={validateCity} editable={false}/>
                        {/*<FlatList
                data={citySuggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={renderSuggestion}
                style={styles.suggestionList}
            />*/}
                        <Text style={[styles.textInput, { color: 'red', textAlign: 'center' }]}>Pour utiliser la localisation automatique, veillez à être a l'endroit oû ce trouve vos plantes.</Text>
                        {isLoading && <Load />}
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.autoLocationButton} onPress={handleAutoLocation} disabled={isLoading}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Localisation automatique</Text>
                                <Ionicons name="search-outline" size={24} color="white"/>
                            </Pressable>
                        </View>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleNext} disabled={isLoading}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>)}
            {step === 5 && (<>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Nom: {lastName}</Text>
                        <Text style={styles.textSizeInput}>Prénom: {firstName}</Text>
                        <Text style={styles.textSizeInput}>Email: {email}</Text>
                        <Text style={styles.textSizeInput}>Addresse: {address}</Text>
                        <Text style={styles.textSizeInput}>Ville: {cityName}, {postalCode}</Text>
                        <Text style={styles.textSizeInput}>Téléphone: {phone}</Text>
                    </View>
                    <View style={styles.consentContainer}>
                        <CheckBox checked={isConsentChecked} onPress={() => setIsConsentChecked(!isConsentChecked)} title="J'accepte les termes et conditions" textStyle={{ color: 'red' }} checkedColor='#668F80' uncheckedColor='#668F80' center/>
                    </View>
                    <Modal animationType="slide" transparent={true} visible={isDonneesVisible} onRequestClose={() => setIsDonneesVisible(false)}>
                        <View style={styles.modalContainer}></View>
                        <DonneesPersonnelles closeModal={() => setIsDonneesVisible(false)}/>
                    </Modal>

                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={() => setIsDonneesVisible(true)}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Politique de Confidentialité</Text>
                            </Pressable>
                        </View>
                        <View style={styles.selectorContainer}>
                            <Pressable style={[styles.selectorButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#668F80' }]} onPress={() => setStep(1)}>
                                <Text style={{ color: '#668F80', fontSize: 18, fontWeight: 'bold', }}>Modifier</Text>
                            </Pressable>
                        </View>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleConfirm}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Confirmer</Text>
                            </Pressable>
                        </View>
                    </View>
                </>)}
        </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingBottom: 10,
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
    input: {
        backgroundColor: '#F0F0F0',
        height: 50,
        width: '90%',
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    textSizeInput: {
        fontSize: 16
    },
    textInput: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    invalidInput: {
        borderColor: 'red',
        borderWidth: 2,
    },
    fixedDetailsBtn: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
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
        backgroundColor: '#668F80',
    },
    autoLocationButton: {
        flex: 1,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#668F80',
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    suggestionList: {
        width: '90%',
        maxHeight: 150,
    },
    consentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        padding: 20,
        justifyContent: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    modalContainer: {
        paddingTop: 25,
        paddingBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        color: '#007BFF',
        marginTop: 20,
    },
});
