var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UpdateProfil = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    // Déstructuration des paramètres de la route
    const { lastName, firstName, address, phone, cityName } = route.params;
    // État local pour les champs de mise à jour du profil
    const [newLastName, setNewLastName] = useState(lastName);
    const [newFirstName, setNewFirstName] = useState(firstName);
    const [newAddress, setNewAddress] = useState(address);
    const [newPhone, setNewPhone] = useState(phone);
    const [newCityName, setNewCityName] = useState(cityName);
    // États pour les messages d'erreur
    const [phoneError, setPhoneError] = useState('');
    // États pour verrouiller/déverrouiller les champs
    const [isLastNameEditable, setIsLastNameEditable] = useState(false);
    const [isFirstNameEditable, setIsFirstNameEditable] = useState(false);
    const [isAddressEditable, setIsAddressEditable] = useState(false);
    const [isPhoneEditable, setIsPhoneEditable] = useState(false);
    const [isCityNameEditable, setIsCityNameEditable] = useState(false);
    // Fonction de validation du téléphone
    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/; // Exemple : 10 chiffres pour un numéro de téléphone français
        return phoneRegex.test(phone);
    };
    const ModifSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
        // Réinitialiser les messages d'erreur
        setPhoneError('');
        // Valider les champs
        let valid = true;
        if (!validatePhone(newPhone)) {
            setPhoneError('Veuillez entrer un numéro de téléphone valide (10 chiffres).');
            valid = false;
        }
        if (!valid) {
            return;
        }
        const userToken = yield AsyncStorage.getItem('userToken');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || '',
            },
            body: JSON.stringify({
                lastName: newLastName,
                firstName: newFirstName,
                address: newAddress,
                cityName: newCityName,
                phone: newPhone,
            }),
        };
        fetch(`${apiUrl}/user/update`, options)
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                navigation.navigate('Profil', { updated: true });
            }
            else {
                Alert.alert('Erreur', 'Erreur lors de la mise à jour du profil');
            }
        })
            .catch(error => {
            console.error('Error updating profile:', error);
            Alert.alert('Erreur', 'Erreur lors de la mise à jour du profil');
        });
    });
    return (<View style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom de famille:</Text>
            <View style={styles.row}>
              <TextInput style={[styles.input, isLastNameEditable && styles.editableInput]} value={newLastName} editable={isLastNameEditable} onChangeText={(text) => { setNewLastName(text); }}/>
              <Pressable onPress={() => setIsLastNameEditable(!isLastNameEditable)}>
                <Ionicons name={isLastNameEditable ? "close" : "pencil"} size={20} color="#668F80"/>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prénom:</Text>
            <View style={styles.row}>
              <TextInput style={[styles.input, isFirstNameEditable && styles.editableInput]} value={newFirstName} editable={isFirstNameEditable} onChangeText={(text) => { setNewFirstName(text); }}/>
              <Pressable onPress={() => setIsFirstNameEditable(!isFirstNameEditable)}>
                <Ionicons name={isFirstNameEditable ? "close" : "pencil"} size={20} color="#668F80"/>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Adresse:</Text>
            <View style={styles.row}>
              <TextInput style={[styles.input, isAddressEditable && styles.editableInput]} value={newAddress} editable={isAddressEditable} onChangeText={(text) => { setNewAddress(text); }}/>
              <Pressable onPress={() => setIsAddressEditable(!isAddressEditable)}>
                <Ionicons name={isAddressEditable ? "close" : "pencil"} size={20} color="#668F80"/>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ville:</Text>
            <View style={styles.row}>
              <TextInput style={[styles.input, isCityNameEditable && styles.editableInput]} value={newCityName} editable={isCityNameEditable} onChangeText={(text) => { setNewCityName(text); }}/>
              <Pressable onPress={() => setIsCityNameEditable(!isCityNameEditable)}>
                <Ionicons name={isCityNameEditable ? "close" : "pencil"} size={20} color="#668F80"/>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Téléphone:</Text>
            <View style={styles.row}>
              <TextInput style={[styles.input, isPhoneEditable && styles.editableInput]} value={newPhone} editable={isPhoneEditable} keyboardType="numeric" onChangeText={(text) => { setNewPhone(text); setPhoneError(''); }}/>
              <Pressable onPress={() => setIsPhoneEditable(!isPhoneEditable)}>
                <Ionicons name={isPhoneEditable ? "close" : "pencil"} size={20} color="#668F80"/>
              </Pressable>
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>
        </View>
      </ScrollView>
      <View style={styles.fixedDetailsBtn}>
        <View style={styles.selectorContainer}>
          <Pressable style={styles.selectorButton} onPress={ModifSubmit}>
            <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
              Mettre à jour
            </Text>
          </Pressable>
        </View>
      </View>
      
    </View>);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: '#F6F6F6',
        alignSelf: 'center',
        color: 'grey',
    },
    editableInput: {
        backgroundColor: '#668F80', // Couleur de la bordure lorsque le champ est éditable 
        color: '#FFF',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    fixedDetailsBtn: {
        paddingTop: 5,
        marginTop: 15,
        alignItems: 'center',
    },
    selectorContainer: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0',
        borderRadius: 25,
        overflow: 'hidden',
        width: '100%',
        alignItems: 'center',
    },
    selectorButton: {
        flex: 1,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#668F80',
    },
});
export default UpdateProfil;
