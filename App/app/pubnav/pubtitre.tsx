import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Titre: { titre: '' };
  Publier: { titreValid?: boolean, titre: string };
};

type UpdateTitreNavigationProp = StackNavigationProp<RootStackParamList, 'Titre'>;
type UpdateTitreRouteProp = RouteProp<RootStackParamList, 'Titre'>;


const PubTitre = () => {
  const navigation = useNavigation<UpdateTitreNavigationProp>();
  const route = useRoute<UpdateTitreRouteProp>();
  const [titre, setTitre] = useState('');
  const [titreCompleted, setTitreCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    loadTitre();
  }, []);

  const loadTitre = async () => {
    try {
      const savedTitre = await AsyncStorage.getItem('savedTitre');
      if (savedTitre) {
        setTitre(savedTitre);
        setTitreCompleted(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du titre:', error);
    }
  };

  const saveTitre = async () => {
    try {
      await AsyncStorage.setItem('savedTitre', titre);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du titre:', error);
    }
  };

  const handleValidation = () => {
    if (titre.trim() !== '') {
      setTitreCompleted(true);
      setIsEditing(false);
      saveTitre();
      navigation.navigate('Publier', { titreValid: true, titre: titre });
    } else {
      navigation.navigate('Publier', { titreValid: false, titre: '' });
    }
  };

  const clearTitre = async () => {
    try {
      await AsyncStorage.removeItem('savedTitre');
      setTitre('');
      setTitreCompleted(false);
      setIsEditing(true);
    } catch (error) {
      console.error('Erreur lors de la suppression du titre sauvegardé:', error);
    }
  };

  return (
    <View style={styles.container}>
      {titreCompleted ? <Text style={styles.text}>Titre : {titre}</Text> : null}
      {isEditing && (
        <TextInput
          style={styles.input}
          placeholder="Entrez le titre"
          value={titre}
          onChangeText={text => setTitre(text)}
        />
      )}
      <Button
        title="Valider"
        onPress={handleValidation}
      />
      <TouchableOpacity onPress={clearTitre}>
        <Text style={styles.clearButton}>Vider Titre</Text>
      </TouchableOpacity>
    </View>
  );
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
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  clearButton: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});

export default PubTitre;