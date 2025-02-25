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
import { StyleSheet, View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import BigButtonDown from '../../components/BigButtonDown';
export default function PubDesc() {
    const navigation = useNavigation();
    const route = useRoute();
    const [description, setDescription] = useState('');
    const [descCompleted, setDescCompleted] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    useEffect(() => {
        loadDescription();
    }, []);
    const loadDescription = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const savedDescription = yield AsyncStorage.getItem('savedDescription');
            if (savedDescription) {
                setDescription(savedDescription);
                setDescCompleted(true);
                setIsEditing(false);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement de la description:', error);
        }
    });
    const saveDescription = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield AsyncStorage.setItem('savedDescription', description);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde de la description:', error);
        }
    });
    const handleValidation = () => {
        if (description.trim() !== '') {
            setDescCompleted(true);
            setIsEditing(false);
            saveDescription();
            navigation.navigate('Publier', { descValid: true, description: description });
        }
        else {
            navigation.navigate('Publier', { descValid: false, description: '' });
        }
    };
    const clearDescription = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield AsyncStorage.removeItem('savedDescription');
            setDescription('');
            setDescCompleted(false);
            setIsEditing(true);
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la description sauvegardée:', error);
        }
    });
    const editDescription = () => {
        setIsEditing(true);
    };
    return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {descCompleted ? <Text style={styles.text}>Description : {description}</Text> : null}
        {isEditing && (<>
            <Text style={styles.hintText}>Vous avez fini d'écrire ? Cliquez dans la zone ci-dessus</Text>
            <TextInput style={styles.input} placeholder="Entrez la description" value={description} onChangeText={text => setDescription(text)} multiline textAlignVertical="top" onSubmitEditing={Keyboard.dismiss}/>
          </>)}
        {!isEditing && (<Pressable onPress={editDescription}>
            <Text style={styles.editButton}>Modifier la description</Text>
          </Pressable>)}
        <Pressable onPress={clearDescription}>
          <Text style={styles.clearButton}>Vider la description</Text>
        </Pressable>
        <BigButtonDown buttonText="Valider" onPress={handleValidation}/>
      </View>
    </TouchableWithoutFeedback>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    input: {
        height: 200,
        width: '90%',
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
    hintText: {
        fontSize: 14,
        color: 'gray',
        opacity: 0.7,
        marginBottom: 5,
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
