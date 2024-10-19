import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assurez-vous que cet import est présent
import { CheckBox } from '@rneui/themed';
import BigButtonDown from '../../components/BigButtonDown';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ajout de l'import

export default function Notif() {
    const navigation = useNavigation(); // Utilisation de useNavigation

    const [emailChecked, setEmailChecked] = useState(false);
    const [appChecked, setAppChecked] = useState(false);
    const [smsChecked, setSmsChecked] = useState(false);

    // Fonction pour charger les préférences de notification
    const loadPreferences = async () => {
        const email = await AsyncStorage.getItem('emailChecked');
        const app = await AsyncStorage.getItem('appChecked');
        const sms = await AsyncStorage.getItem('smsChecked');
        if (email) setEmailChecked(JSON.parse(email));
        if (app) setAppChecked(JSON.parse(app));
        if (sms) setSmsChecked(JSON.parse(sms));
    };

    // Fonction pour sauvegarder les préférences de notification
    const savePreferences = async () => {
        await AsyncStorage.setItem('emailChecked', JSON.stringify(emailChecked));
        await AsyncStorage.setItem('appChecked', JSON.stringify(appChecked));
        await AsyncStorage.setItem('smsChecked', JSON.stringify(smsChecked));
    };

    // Charger les préférences lors du premier rendu
    useEffect(() => {
        loadPreferences();
    }, []);

    // Sauvegarder les préférences lors de la validation
    const handleValidation = () => {
        savePreferences();
        navigation.goBack();
    };

    const handleCheckboxPress = (type: string) => {
        if (type === 'email') setEmailChecked(!emailChecked);
        if (type === 'app') setAppChecked(!appChecked);
        if (type === 'sms') setSmsChecked(!smsChecked);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={styles.notificationContainer}>
                <Text style={styles.notificationTitle}>Notifications</Text>
                <Text style={styles.notificationText}>
                    Nous utilisons différents types de notifications pour vous tenir informé des soins de vos plantes :
                </Text>
                <View style={styles.notificationItem}>
                    <CheckBox
                        checked={emailChecked}
                        onPress={() => handleCheckboxPress('email')}
                        title="Email : Vous recevrez des emails pour les rappels de soins et les conseils."
                        checkedColor='#668F80'
                        uncheckedColor='#668F80'
                        size={32}
                        containerStyle={{backgroundColor: '#f9f9f9'}}
                    />
                </View>
                <View style={styles.notificationItem}>
                    <CheckBox
                        checked={appChecked}
                        onPress={() => handleCheckboxPress('app')}
                        title="App : Des notifications push seront envoyées directement sur votre appareil."
                        textStyle={{marginRight:20}}
                        checkedColor='#668F80'
                        uncheckedColor='#668F80'
                        size={32}
                        containerStyle={{backgroundColor: '#f9f9f9'}}
                    />
                </View>
                <View style={styles.notificationItem}>
                    <CheckBox
                        checked={smsChecked}
                        onPress={() => handleCheckboxPress('sms')}
                        title="Messages : Vous pouvez également recevoir des SMS pour les rappels importants."
                        checkedColor='#668F80'
                        uncheckedColor='#668F80'
                        size={32}
                        containerStyle={{backgroundColor: '#f9f9f9'}}
                    />
                </View>
                <Text style={styles.notificationText}>
                    Vous pouvez gérer vos préférences de notification dans les paramètres de l'application.
                </Text>
            </View>
            <BigButtonDown buttonText="Valider" onPress={handleValidation} />
        </View>
    );
}

const styles = StyleSheet.create({
    notificationContainer: {
        padding: 20,
        justifyContent: 'center',
    },
    notificationTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    notificationText: {
        fontSize: 14,
        marginBottom: 10,
    },
    notificationItem: {
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 32,
        height: 32,
        marginRight: 10,
    },
    notificationType: {
        fontSize: 14,
        marginRight: 20,
    },
});