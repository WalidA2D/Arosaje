import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import BigButtonDown from '../../components/BigButtonDown';

type RootStackParamList = {
  Publier: { descValid?: boolean, description: string };
  Desc: { description: '' };
};

type UpdateDescNavigationProp = StackNavigationProp<RootStackParamList, 'Desc'>;
type UpdateDescRouteProp = RouteProp<RootStackParamList, 'Desc'>;

export default function PubDesc() {
  const navigation = useNavigation<UpdateDescNavigationProp>();
  const route = useRoute<UpdateDescRouteProp>();
  const [description, setDescription] = useState('');
  const [descCompleted, setDescCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    loadDescription();
  }, []);

  const loadDescription = async () => {
    try {
      const savedDescription = await AsyncStorage.getItem('savedDescription');
      if (savedDescription) {
        setDescription(savedDescription);
        setDescCompleted(true);
        setIsEditing(false);
      }
    } catch (error) {
      // console.error('Erreur lors du chargement de la description:', error);
    }
  };

  const saveDescription = async () => {
    try {
      await AsyncStorage.setItem('savedDescription', description);
    } catch (error) {
      // console.error('Erreur lors de la sauvegarde de la description:', error);
    }
  };

  const handleValidation = () => {
    if (description.trim() !== '') {
      setDescCompleted(true);
      setIsEditing(false);
      saveDescription();
      navigation.navigate('Publier', { descValid: true, description: description });
    } else {
      navigation.navigate('Publier', { descValid: false, description: '' });
    }
  };

  const clearDescription = async () => {
    try {
      await AsyncStorage.removeItem('savedDescription');
      setDescription('');
      setDescCompleted(false);
      setIsEditing(true);
    } catch (error) {
      // console.error('Erreur lors de la suppression de la description sauvegardée:', error);
    }
  };

  const editDescription = () => {
    setIsEditing(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {descCompleted ? <Text style={styles.text}>Description : {description}</Text> : null}
        {isEditing && (
          <>
            <Text style={styles.hintText}>Vous avez fini d'écrire ? Cliquez dans la zone ci-dessus</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez la description"
              value={description}
              onChangeText={text => setDescription(text)}
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