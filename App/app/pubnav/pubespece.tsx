import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Pressable, Modal } from 'react-native';
import AnimatedCheckbox from 'react-native-checkbox-reanimated'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Loading from '../../components/Loading';
import BigButtonDown from '../../components/BigButtonDown';

type RootStackParamList = {
  Publier: { espValid?: boolean, espece: string };
  Espece: { espece: '' };
};

type UpdateEspeceNavigationProp = StackNavigationProp<RootStackParamList, 'Espece'>;
type UpdateEspeceRouteProp = RouteProp<RootStackParamList, 'Espece'>;

export default function PubEspece() {
  const navigation = useNavigation<UpdateEspeceNavigationProp>();
  const route = useRoute<UpdateEspeceRouteProp>();
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSpeciesDetails, setSelectedSpeciesDetails] = useState<any | null>(null);
  const [checkedId, setCheckedId] = useState<number | null>(null);

  const handleCheckboxPress = (id: number) => {
    setCheckedId(prev => (prev === id ? null : id));
  }

  const showSpeciesDetails = async (id: number) => {
    try {
      const response = await axios.get(`https://trefle.io/api/v1/species/${id}?token=48y8dGrqGaAxEOkOWOkDi8z5EjU1XcN9gF1BWFAJmn8`);
      setSelectedSpeciesDetails(response.data.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'espèce:", error);
    }
  };

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get('https://trefle.io/api/v1/species?token=48y8dGrqGaAxEOkOWOkDi8z5EjU1XcN9gF1BWFAJmn8');
        const speciesData = response.data.data;
        // Ajout de l'élément "Autre / Je ne sais pas"
        const otherSpecies = { id: -1, common_name: "Autre / Je ne sais pas", image_url: "" };
        setSpecies([...speciesData, otherSpecies]);
        setLoading(false);
      } catch (error: any) {
        setError("Erreur: " + (error as Error).message);
        setLoading(false);
      }
    };

    fetchSpecies();
  }, []);

  const handleValidation = () => {
    if (checkedId !== null) {
      const selectedSpecies = species.find(species => species.id === checkedId);
      navigation.navigate('Publier', { espValid: true, espece: selectedSpecies.common_name });
    } else {
      navigation.navigate('Publier', { espValid: false, espece: '' });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={species}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={<View style={styles.footerPadding} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.image} />
            ) : (
              <View style={styles.image} />
            )}
            <Text>{item.common_name}</Text>
            <View style={styles.itemBtn}>
              {item.id !== -1 && (
                <TouchableOpacity onPress={() => showSpeciesDetails(item.id)}>
                  <Ionicons name="information-circle-outline" size={32} color="black" />
                </TouchableOpacity>
              )}
              <Pressable onPress={() => handleCheckboxPress(item.id)} style={styles.checkbox}>
                <AnimatedCheckbox
                  checked={checkedId === item.id}
                  highlightColor="#668F80"
                  checkmarkColor="#ffffff"
                  boxOutlineColor="#668F80"
                />
              </Pressable>
            </View>
          </View>
        )}
      />
      <BigButtonDown buttonText="Choisir" onPress={handleValidation} />
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        {selectedSpeciesDetails && (
          <View style={styles.modalContent}>
            <Text>Nom : {selectedSpeciesDetails.common_name}</Text>
            <Text>Nom scientifique : {selectedSpeciesDetails.scientific_name}</Text>
            <Text>Années : {selectedSpeciesDetails.year}</Text>
            <Text>Nom de famille : {selectedSpeciesDetails.family_common_name}</Text>
            <Text>Endroits : {selectedSpeciesDetails.observations}</Text>
            <Image source={{ uri: selectedSpeciesDetails.image_url }} style={styles.imageModal} />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Retour</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemBtn: {
    padding: 20,
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  checkbox: {
    width: 32,
    height: 32,
    marginLeft: 10
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModal: {
    width: 250,
    height: 250,
  },
  footerPadding: {
    height: 100,
  },
});