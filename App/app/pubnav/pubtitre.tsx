import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PubTitre = () => {
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
    }
  };

  return (
    <View style={styles.container}>
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
      {titreCompleted ? <Text style={styles.text}>Titre : {titre}</Text> : null}
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
});

export default PubTitre;