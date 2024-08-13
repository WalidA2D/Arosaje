import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DonneesPersonnelles() {
    return (
        <View style={{ flex: 1, backgroundColor: '#f9f9f9', }}>
            <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Données Personnelles</Text>
                <Text style={styles.dataText}>
                    Nous collectons et utilisons vos données personnelles uniquement dans le cadre de l'application de garde de plante.
                    Vos données sont sécurisées et ne seront jamais partagées avec des tiers sans votre consentement explicite.
                </Text>
                <Text style={styles.dataText}>
                    Types de données collectées :
                </Text>
                <Text style={styles.dataList}>
                    - Nom et prénom{'\n'}
                    - Adresse e-mail{'\n'}
                    - Historique des soins des plantes{'\n'}
                    - Préférences de notification
                </Text>
                <Text style={styles.dataText}>
                    Pour toute question concernant vos données personnelles, veuillez nous contacter à l'adresse suivante : support@arosaje.com
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dataContainer: {
        padding: 20,
    },
    dataTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    dataText: {
        fontSize: 14,
        marginBottom: 10,
    },
    dataList: {
        fontSize: 14,
        marginBottom: 10,
    },
});