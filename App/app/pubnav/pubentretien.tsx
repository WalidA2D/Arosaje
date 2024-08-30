import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import BigButtonDown from '../../components/BigButtonDown';

type RootStackParamList = {
  Publier: { ettValid?: boolean, entretien: string };
  Entretien: { entretien: '' };
};

type UpdateEntretienNavigationProp = StackNavigationProp<RootStackParamList, 'Entretien'>;
type UpdateEntretienRouteProp = RouteProp<RootStackParamList, 'Entretien'>;

export default function PubEntretien() {
  const navigation = useNavigation<UpdateEntretienNavigationProp>();
  const route = useRoute<UpdateEntretienRouteProp>();
  const [entretien, setEntretien] = useState('');
  const [ettCompleted, setEttCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    loadEntretien();
  }, []);

  const loadEntretien = async () => {
    try {
      const savedEntretien = await AsyncStorage.getItem('savedEntretien');
      if (savedEntretien) {
        setEntretien(savedEntretien);
        setEttCompleted(true);
        setIsEditing(false);
      }
    } catch (error) {
      // console.error('Erreur lors du chargement de la description :', error);
    }
  };

  const saveDescription = async () => {
    try {
      await AsyncStorage.setItem('savedEntretien', entretien);
    } catch (error) {
      // console.error('Erreur lors de la sauvegarde de la description :', error);
    }
  };

  const handleValidation = () => {
    if (entretien.trim() !== '') {
      setEttCompleted(true);
      setIsEditing(false);
      saveDescription();
      navigation.navigate('Publier', { ettValid: true, entretien: entretien });
    } else {
      navigation.navigate('Publier', { ettValid: false, entretien: '' });
    }
  };

  const clearDescription = async () => {
    try {
      await AsyncStorage.removeItem('savedEntretien');
      setEntretien('');
      setEttCompleted(false);
      setIsEditing(true);
    } catch (error) {
      // console.error('Erreur lors de la suppression de la description sauvegardée :', error);
    }
  };

  const editDescription = () => {
    setIsEditing(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {ettCompleted ? <Text style={styles.text}>Description : {entretien}</Text> : null}
        {isEditing && (
          <>
            <Text style={styles.hintText}>Vous avez fini d'écrire ? Cliquez dans la zone ci-dessus</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez la description"
              value={entretien}
              onChangeText={text => setEntretien(text)}
              multiline
              textAlignVertical="top"
              onSubmitEditing={Keyboard.dismiss}
            />
          </>
        )}
        {!isEditing && (
          <Pressable onPress={editDescription}>
            <Text style={styles.editButton}>Modifier la description</Text>
          </Pressable>
        )}
        <Pressable onPress={clearDescription}>
          <Text style={styles.clearButton}>Vider la description</Text>
        </Pressable>
        <BigButtonDown buttonText="Valider" onPress={handleValidation} />
      </View>
    </TouchableWithoutFeedback>
  );
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