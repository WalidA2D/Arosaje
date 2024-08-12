import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InfoLeg() {
    return (
        <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <View style={styles.legalInfoContainer}>
                <Text style={styles.legalInfoTitle}>Informations Légales</Text>
                <Text style={styles.legalInfoText}>
                    Ceci est un exemple d'informations légales pour votre application de garde de plante.
                    Veuillez consulter un professionnel pour obtenir des informations légales précises et adaptées à votre situation.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    legalInfoContainer: {
        padding: 20,
    },
    legalInfoTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    legalInfoText: {
        fontSize: 14,
    },
});