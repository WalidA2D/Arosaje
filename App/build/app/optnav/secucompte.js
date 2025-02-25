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
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SecuCompte() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasseActuel] = useState('');
    const [motDePasseActuelCorrect, setMotDePasseActuelCorrect] = useState(false);
    const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
    const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    useEffect(() => {
        const getEmailFromStorage = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const storedEmail = yield AsyncStorage.getItem('email');
                if (storedEmail !== null) {
                    setEmail(storedEmail);
                }
            }
            catch (error) {
                console.error('Erreur lors de la récupération de l\'email depuis le local storage:', error);
            }
        });
        getEmailFromStorage();
    }, []);
    const verifierMotDePasseActuel = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${apiUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: motDePasse,
                }),
            });
            const data = yield response.json();
            if (data.success) {
                setMotDePasseActuelCorrect(true);
            }
            else {
                Alert.alert("Erreur", "Mot de passe actuel incorrect");
            }
        }
        catch (error) {
            console.error('Erreur lors de la vérification du mot de passe actuel:', error);
        }
    });
    const changerMotDePasse = () => __awaiter(this, void 0, void 0, function* () {
        if (!passwordRegex.test(nouveauMotDePasse)) {
            Alert.alert("Erreur", "Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }
        if (nouveauMotDePasse !== confirmationMotDePasse) {
            Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
            return;
        }
        try {
            const userToken = yield AsyncStorage.getItem('userToken');
            const response = yield fetch(`${apiUrl}/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken || '',
                },
                body: JSON.stringify({
                    email: email,
                    password: nouveauMotDePasse,
                }),
            });
            const data = yield response.json();
            if (data.success) {
                Alert.alert("Succès", "Le mot de passe a été changé avec succès.");
                setMotDePasseActuelCorrect(false);
                setNouveauMotDePasse('');
                setConfirmationMotDePasse('');
            }
            else {
                Alert.alert("Erreur", "Échec du changement de mot de passe.");
            }
        }
        catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
        }
    });
    return (<View>
            <Text style={styles.inputTitle}>Email :</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} editable={false}/>

            <Text style={styles.inputTitle}>Mot de passe actuel :</Text>
            <TextInput style={styles.input} placeholder="Mot de passe actuel" secureTextEntry={true} onChangeText={setMotDePasseActuel} editable={!motDePasseActuelCorrect}/>

            <Button title="Vérifier le mot de passe actuel" onPress={verifierMotDePasseActuel}/>

            {motDePasseActuelCorrect && (<>
                    <Text style={styles.inputTitle}>Nouveau mot de passe :</Text>
                    <TextInput style={styles.input} placeholder="Nouveau mot de passe" secureTextEntry={true} onChangeText={setNouveauMotDePasse}/>

                    <Text style={styles.inputTitle}>Confirmer le nouveau mot de passe :</Text>
                    <TextInput style={styles.input} placeholder="Confirmer le nouveau mot de passe" secureTextEntry={true} onChangeText={setConfirmationMotDePasse}/>

                    <Button title="Changer le mot de passe" onPress={changerMotDePasse}/>
                </>)}
        </View>);
}
const styles = StyleSheet.create({
    inputTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginTop: 5,
        width: '90%',
        alignSelf: 'center',
    },
});
