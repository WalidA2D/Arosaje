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
import { StyleSheet, View, Text, TextInput, Pressable, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import BigButtonDown from '../../components/BigButtonDown';
const PubTitre = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [titre, setTitre] = useState('');
    const [titreCompleted, setTitreCompleted] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    useEffect(() => {
        loadTitre();
    }, []);
    const loadTitre = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedTitre = yield AsyncStorage.getItem('savedTitre');
            if (savedTitre) {
                setTitre(savedTitre);
                setTitreCompleted(true);
                setIsEditing(false);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement du titre:', error);
        }
    });
    const saveTitre = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield AsyncStorage.setItem('savedTitre', titre);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde du titre:', error);
        }
    });
    const handleValidation = () => {
        if (titre.trim() !== '') {
            setTitreCompleted(true);
            setIsEditing(false);
            saveTitre();
            navigation.navigate('Publier', { titreValid: true, titre: titre });
        }
        else {
            navigation.navigate('Publier', { titreValid: false, titre: '' });
        }
    };
    const clearTitre = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield AsyncStorage.removeItem('savedTitre');
            setTitre('');
            setTitreCompleted(false);
            setIsEditing(true);
        }
        catch (error) {
            console.error('Erreur lors de la suppression du titre sauvegardé:', error);
        }
    });
    const editTitre = () => {
        setIsEditing(true);
    };
    return (<View style={styles.container}>
        {titreCompleted ? <Text style={styles.text}>Titre : {titre}</Text> : null}
        {isEditing && (<>
            <TextInput style={styles.input} placeholder="Entrez le titre" value={titre} onChangeText={text => setTitre(text)} textAlignVertical="top" returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
          </>)}
        {!isEditing && (<Pressable onPress={editTitre}>
            <Text style={styles.editButton}>Modifier le titre</Text>
          </Pressable>)}
        <Pressable onPress={clearTitre}>
          <Text style={styles.clearButton}>Vider le titre</Text>
        </Pressable>
        <BigButtonDown buttonText="Valider" onPress={handleValidation}/>
      </View>);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
    },
    editButton: {
        fontSize: 16,
        color: 'blue',
        marginTop: 20,
    },
    clearButton: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
});
export default PubTitre;
