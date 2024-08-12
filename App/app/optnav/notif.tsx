import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AnimatedCheckbox from 'react-native-checkbox-reanimated';
import BigButtonDown from '../../components/BigButtonDown';

export default function Notif() {
    const [emailChecked, setEmailChecked] = useState(false);
    const [appChecked, setAppChecked] = useState(false);
    const [smsChecked, setSmsChecked] = useState(false);

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
                    <Pressable onPress={() => handleCheckboxPress('email')} style={styles.checkbox}>
                        <AnimatedCheckbox
                            checked={emailChecked}
                            highlightColor="#668F80"
                            checkmarkColor="#ffffff"
                            boxOutlineColor="#668F80"
                        />
                    </Pressable>
                    <Text style={styles.notificationType}>Email : Vous recevrez des emails pour les rappels de soins et les conseils.</Text>
                </View>
                <View style={styles.notificationItem}>
                    <Pressable onPress={() => handleCheckboxPress('app')} style={styles.checkbox}>
                        <AnimatedCheckbox
                            checked={appChecked}
                            highlightColor="#668F80"
                            checkmarkColor="#ffffff"
                            boxOutlineColor="#668F80"
                        />
                    </Pressable>
                    <Text style={styles.notificationType}>App : Des notifications push seront envoyées directement sur votre appareil.</Text>
                </View>
                <View style={styles.notificationItem}>
                    <Pressable onPress={() => handleCheckboxPress('sms')} style={styles.checkbox}>
                        <AnimatedCheckbox
                            checked={smsChecked}
                            highlightColor="#668F80"
                            checkmarkColor="#ffffff"
                            boxOutlineColor="#668F80"
                        />
                    </Pressable>
                    <Text style={styles.notificationType}>Messages : Vous pouvez également recevoir des SMS pour les rappels importants.</Text>
                </View>
                <Text style={styles.notificationText}>
                    Vous pouvez gérer vos préférences de notification dans les paramètres de l'application.
                </Text>
            </View>
            <BigButtonDown buttonText="Valider" />
        </View>
    );
}

const styles = StyleSheet.create({
    notificationContainer: {
        padding: 20,
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
        flexDirection: 'row',
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
    },
});