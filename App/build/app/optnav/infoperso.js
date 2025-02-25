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
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function InfoPerso() {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [numero, setNumero] = useState('');
    const [adresse, setAdresse] = useState('');
    const [ville, setVille] = useState('');
    const apiUrl = process.env.EXPO_PUBLIC_API_IP;
    const fetchProfileData = () => __awaiter(this, void 0, void 0, function* () {
        const userToken = yield AsyncStorage.getItem('userToken');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken || '',
            }
        };
        fetch(`${apiUrl}/user/profil`, options)
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                setPrenom(data.user.lastName);
                setNom(data.user.firstName);
                setEmail(data.user.email);
                setNumero(data.user.phone);
                setAdresse(data.user.address);
                setVille(data.user.cityName);
            }
        })
            .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    });
    useEffect(() => {
        fetchProfileData();
    }, []);
    return (<View style={styles.container}>
            <Text style={styles.title}>Mes Informations Personnelles</Text>

            <Text style={styles.inputTitle}>Nom :</Text>
            <TextInput style={styles.input} placeholder="Nom" value={nom} editable={false}/>

            <Text style={styles.inputTitle}>Prénom :</Text>
            <TextInput style={styles.input} placeholder="Prénom" value={prenom} editable={false}/>

            <Text style={styles.inputTitle}>Email :</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} editable={false}/>

            <Text style={styles.inputTitle}>Numéro de téléphone :</Text>
            <TextInput style={styles.input} placeholder="Numéro de téléphone" value={numero.replace(/.(?=.{2})/g, '*')} editable={false}/>

            <Text style={styles.inputTitle}>Adresse :</Text>
            <TextInput style={styles.input} placeholder="Adresse" value={adresse} editable={false}/>

            <Text style={styles.inputTitle}>Ville :</Text>
            <TextInput style={styles.input} placeholder="Ville" value={ville} editable={false}/>
        </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    inputTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
});
